#!/usr/bin/env node
/**
 * Interactive setup wizard — Genetic AI Starter Kit.
 * Run from kit folder: node scripts/init.mjs  (Windows: double-click SETUP.cmd)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ask, chooseMenu, confirm } from './lib/prompt.mjs';
import { KIT_ROOT } from './lib/paths.mjs';
import { readPlatformVersion } from './lib/platform-version.mjs';
import { loadProfile } from './lib/profile-include.mjs';
import {
  shouldShowStarterBanner,
  printStarterBanner,
  isAgentStackProjectName,
  printAgentStackThanks,
} from './lib/starter-banner.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INSTALL_SCRIPT = path.join(__dirname, 'install.mjs');

const PROFILE_OPTIONS = [
  {
    id: 'standard',
    label: 'Стандарт',
    hint: 'рекомендуется: philosophy, карта, 5 rules, 4 skills',
  },
  {
    id: 'minimal',
    label: 'Минимальный',
    hint: 'малый репозиторий: AGENTS + 2 rules + stub-карта',
  },
  {
    id: 'full',
    label: 'AgentStack (полный)',
    hint: 'всё из standard + overlay MCP/8DNA + CI sample',
  },
  {
    id: 'founder',
    label: 'AgentStack (founder)',
    hint: 'как полный; приоритет direct-ship в сессиях основателя',
  },
];

const DOMAIN_OPTIONS = [
  { id: 'app', label: 'app', hint: 'приложение / frontend / общий продукт' },
  { id: 'api', label: 'api', hint: 'HTTP API / backend' },
  { id: 'repo', label: 'repo', hint: 'монорепо / платформа' },
  { id: 'mobile', label: 'mobile', hint: 'мобильный клиент' },
  { id: '__custom__', label: 'Другой (ввести вручную)', hint: '' },
];

function parseArgs(argv) {
  const opts = {
    target: null,
    profile: null,
    projectName: null,
    domain: null,
    withAgentstack: null,
    yes: false,
    dryRun: false,
    gitignoreKit: null,
    help: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--profile') opts.profile = argv[++i];
    else if (a === '--project-name') opts.projectName = argv[++i];
    else if (a === '--domain') opts.domain = argv[++i];
    else if (a === '--with-agentstack') opts.withAgentstack = true;
    else if (a === '--no-agentstack') opts.withAgentstack = false;
    else if (a === '--yes' || a === '-y') opts.yes = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--gitignore-kit') opts.gitignoreKit = argv[++i];
    else if (a === '--help' || a === '-h') opts.help = true;
  }
  return opts;
}

function printHelp() {
  console.log(`Genetic AI Starter — мастер установки

Запуск:
  node scripts/init.mjs
  SETUP.cmd                    (Windows, двойной щелчок)

Неинтерактивно:
  node scripts/init.mjs --yes --target <path> --profile standard \\
    --project-name "My App" --domain app

Опции:
  --target, --profile, --project-name, --domain
  --with-agentstack | --no-agentstack
  --gitignore-kit full|none   (full: philosophy/docs/ai не в git)
  --yes          пропустить подтверждение
  --dry-run      только показать install (передаётся в install.mjs)
`);
}

function isInteractive() {
  return process.stdin.isTTY && process.stdout.isTTY && !process.env.CI;
}

/** Expand %VAR% on Windows when passed literally from cmd. */
function expandEnvPath(p) {
  return p.replace(/%([^%]+)%/g, (_, name) => process.env[name] ?? `%${name}%`);
}

function readExistingLock(targetRoot) {
  const lockPath = path.join(targetRoot, '.genetic-ai', 'kit.lock.json');
  if (!fs.existsSync(lockPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch {
    return null;
  }
}

function profileIncludesAgentstack(profileId) {
  const p = loadProfile(profileId);
  return (p.extensions || []).includes('agentstack');
}

async function resolveTarget(cliTarget) {
  if (cliTarget) return path.resolve(cliTarget);

  const choice = await chooseMenu(
    'Куда установить kit?',
    [
      { id: 'here', label: 'В текущую папку', hint: path.resolve(process.cwd()) },
      { id: 'path', label: 'Указать путь к проекту', hint: '' },
    ],
    0,
  );

  if (choice === 'here') {
    return path.resolve(process.cwd());
  }

  const entered = await ask('Путь к папке проекта', process.cwd());
  return path.resolve(entered);
}

async function ensureTargetDir(targetRoot, skipConfirm = false) {
  if (fs.existsSync(targetRoot)) return;
  if (!skipConfirm) {
    const ok = await confirm(`Папка не существует. Создать?\n  ${targetRoot}`, true);
    if (!ok) {
      console.error('Отменено.');
      process.exit(1);
    }
  }
  fs.mkdirSync(targetRoot, { recursive: true });
  console.log(`Создана папка: ${targetRoot}`);
}

async function runWizard(cli) {
  const version = readPlatformVersion();
  if (shouldShowStarterBanner()) printStarterBanner();
  console.log('');
  console.log('=== Genetic AI Starter — мастер установки ===');
  console.log(`Платформа: ${version} · kit: ${KIT_ROOT}`);
  console.log('');

  const targetRoot = expandEnvPath(await resolveTarget(cli.target));
  await ensureTargetDir(targetRoot, cli.yes);

  const existing = readExistingLock(targetRoot);
  if (existing && !cli.yes) {
    console.log(
      `\nВ проекте уже есть kit: profile=${existing.profile} version=${existing.kitVersion}`,
    );
    const reinstall = await confirm('Переустановить / обновить файлы starter?', true);
    if (!reinstall) {
      console.log('Отменено. Для обновления позже: node scripts/upgrade.mjs --target <path>');
      process.exit(0);
    }
  }

  const defaultName = path.basename(targetRoot) || 'My Project';
  const projectName = cli.projectName || (await ask('Имя проекта (в AGENTS.md)', defaultName));
  if (isAgentStackProjectName(projectName)) printAgentStackThanks();

  let domain = cli.domain;
  if (!domain) {
    const domainChoice = await chooseMenu('Префикс genetic tags (domain)', DOMAIN_OPTIONS, 0);
    if (domainChoice === '__custom__') {
      domain = await ask('Введите domain', 'app');
    } else {
      domain = domainChoice;
    }
  }

  const profile =
    cli.profile ||
    (await chooseMenu('Профиль установки', PROFILE_OPTIONS, 0));

  let gitignoreKit = cli.gitignoreKit;
  if (!gitignoreKit) {
    if (cli.yes) {
      gitignoreKit = 'none';
    } else {
      gitignoreKit = await chooseMenu(
        'Git: файлы kit в репозитории?',
        [
          {
            id: 'full',
            label: 'Не коммитить (полный .gitignore)',
            hint: 'AGENTS, philosophy, docs/ai, cursor rules/skills — только локально',
          },
          {
            id: 'none',
            label: 'Коммитить вместе с проектом',
            hint: 'для команд с общей картой и genes',
          },
        ],
        0,
      );
    }
  } else if (gitignoreKit !== 'full' && gitignoreKit !== 'none') {
    console.error('--gitignore-kit must be full or none');
    process.exit(1);
  }

  let withAgentstack = cli.withAgentstack;
  if (withAgentstack === null) {
    if (profileIncludesAgentstack(profile)) {
      withAgentstack = true;
      console.log('\nРасширение AgentStack: включено (профиль ' + profile + ').');
    } else if (cli.yes) {
      withAgentstack = false;
    } else {
      withAgentstack = await confirm(
        'Добавить расширение AgentStack (MCP / 8DNA / canary rule)?',
        false,
      );
    }
  }

  const installArgs = [
    INSTALL_SCRIPT,
    '--target',
    targetRoot,
    '--profile',
    profile,
    '--project-name',
    projectName,
    '--domain',
    domain,
    '--strict',
  ];
  if (withAgentstack) installArgs.push('--with-agentstack');
  if (gitignoreKit === 'full') installArgs.push('--gitignore-kit', 'full');
  if (cli.dryRun) installArgs.push('--dry-run');
  if (existing) installArgs.push('--force-philosophy');

  console.log('\n--- Итого ---');
  console.log(`  Проект:     ${targetRoot}`);
  console.log(`  Имя:        ${projectName}`);
  console.log(`  Domain:     ${domain}`);
  console.log(`  Профиль:    ${profile}`);
  console.log(`  AgentStack: ${withAgentstack ? 'да' : 'нет'}`);
  console.log(`  .gitignore:  ${gitignoreKit === 'full' ? 'полный (kit не в git)' : 'не менять'}`);
  console.log(`  Режим:      ${cli.dryRun ? 'dry-run' : 'установка'}`);
  console.log('');

  if (!cli.yes) {
    const ok = await confirm('Начать установку?', true);
    if (!ok) {
      console.log('Отменено.');
      process.exit(0);
    }
  }

  console.log('\nУстановка...\n');
  const result = spawnSync(process.execPath, installArgs, { stdio: 'inherit', cwd: KIT_ROOT });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  if (!cli.dryRun) {
    console.log('\n--- Готово ---');
    console.log(`1. Откройте в Cursor: ${targetRoot}`);
    console.log('2. Прочитайте AGENTS.md и docs/ai/AI_NAVIGATION_MAP.md');
    console.log('3. Проверка: node scripts/doctor.mjs --target "' + targetRoot + '"');
    if (gitignoreKit === 'full') {
      console.log('4. Файлы kit в .gitignore — не попадут в git push (локально остаются для Cursor).');
    }
    console.log('');
  }
}

function applyNonInteractiveDefaults(cli) {
  const raw = cli.target ? expandEnvPath(cli.target) : process.cwd();
  const target = path.resolve(raw);
  return {
    ...cli,
    yes: true,
    target,
    profile: cli.profile || 'standard',
    projectName: cli.projectName || path.basename(target) || 'My Project',
    domain: cli.domain || 'app',
  };
}

async function main() {
  const cli = parseArgs(process.argv);
  if (cli.help) {
    printHelp();
    process.exit(0);
  }

  if (cli.yes) {
    const merged = applyNonInteractiveDefaults(cli);
    if (isAgentStackProjectName(merged.projectName)) printAgentStackThanks();
    await runWizard(merged);
    return;
  }

  if (!isInteractive()) {
    console.error(
      'Интерактивный ввод недоступен (нет TTY). Укажите флаги и --yes, либо запустите SETUP.cmd / node scripts/init.mjs в терминале.',
    );
    printHelp();
    process.exit(1);
  }

  await runWizard(cli);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
