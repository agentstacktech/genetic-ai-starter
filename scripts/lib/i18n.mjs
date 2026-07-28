/**
 * Minimal install wizard i18n (S0/P6).
 * @typedef {'ru' | 'en'} InstallLocale
 */

/** @type {Record<InstallLocale, Record<string, string>>} */
const MESSAGES = {
  ru: {
    'setup.title': 'Genetic AI Starter Kit — мастер установки',
    'setup.node_missing': '[ОШИБКА] Node.js не найден.',
    'setup.node_hint': 'Установите Node.js 18+ с https://nodejs.org или: winget install OpenJS.NodeJS.LTS',
    'setup.done': 'Установка завершена.',
    'setup.failed': 'Установка завершилась с ошибкой (код {code}).',
    'wizard.target_title': 'Куда установить kit?',
    'wizard.target_here': 'В текущую папку',
    'wizard.target_path': 'Указать путь к проекту',
    'wizard.kit_cwd_hint':
      'Вы в папке kit — укажите папку вашего проекта (не устанавливайте в папку kit).',
    'no_tty':
      'Интерактивный ввод недоступен (нет TTY). Используйте --yes и флаги, например:\n  node scripts/init.mjs --yes --target <path> --profile standard --project-name "App" --domain app',
  },
  en: {
    'setup.title': 'Genetic AI Starter Kit — setup wizard',
    'setup.node_missing': '[ERROR] Node.js not found.',
    'setup.node_hint': 'Install Node.js 18+ from https://nodejs.org or: winget install OpenJS.NodeJS.LTS',
    'setup.done': 'Setup completed.',
    'setup.failed': 'Setup failed (exit code {code}).',
    'wizard.target_title': 'Where to install the kit?',
    'wizard.target_here': 'Current folder',
    'wizard.target_path': 'Enter project path',
    'wizard.kit_cwd_hint':
      'You are in the kit folder — choose your app project directory (do not install into the kit).',
    'no_tty':
      'Interactive input unavailable (no TTY). Use --yes with flags, e.g.:\n  node scripts/init.mjs --yes --target <path> --profile standard --project-name "App" --domain app',
  },
};

/**
 * @returns {InstallLocale}
 */
export function detectInstallLocale() {
  const forced = process.env.GENETIC_AI_LOCALE?.trim().toLowerCase();
  if (forced === 'en' || forced === 'ru') return forced;
  const lang = (process.env.LANG || process.env.LANGUAGE || '').toLowerCase();
  if (lang.startsWith('ru')) return 'ru';
  return 'en';
}

/**
 * @param {string} key
 * @param {Record<string, string>} [vars]
 * @param {InstallLocale} [locale]
 */
export function t(key, vars = {}, locale = detectInstallLocale()) {
  let text = MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{${k}}`, v);
  }
  return text;
}
