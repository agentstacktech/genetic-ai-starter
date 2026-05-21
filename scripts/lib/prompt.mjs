/**
 * Simple readline prompts for init wizard (TTY only).
 */
import readline from 'node:readline';

/**
 * @param {string} question
 * @param {string} [defaultValue]
 * @returns {Promise<string>}
 */
export function ask(question, defaultValue = '') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const hint = defaultValue ? ` [${defaultValue}]` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${hint}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

/**
 * @param {string} title
 * @param {{ id: string, label: string, hint?: string }[]} options
 * @param {number} [defaultIndex] 0-based
 * @returns {Promise<string>} selected id
 */
export async function chooseMenu(title, options, defaultIndex = 0) {
  console.log(`\n${title}`);
  for (let i = 0; i < options.length; i++) {
    const o = options[i];
    const mark = i === defaultIndex ? '*' : ' ';
    const hint = o.hint ? ` — ${o.hint}` : '';
    console.log(`  ${mark} ${i + 1}) ${o.label}${hint}`);
  }
  const def = defaultIndex + 1;
  const raw = await ask(`Выбор (1–${options.length})`, String(def));
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1 || n > options.length) {
    return options[defaultIndex].id;
  }
  return options[n - 1].id;
}

/**
 * @param {string} question
 * @param {boolean} [defaultYes]
 */
export async function confirm(question, defaultYes = true) {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const raw = (await ask(`${question} (${hint})`, defaultYes ? 'Y' : 'N')).toLowerCase();
  if (!raw) return defaultYes;
  return raw === 'y' || raw === 'yes' || raw === 'д' || raw === 'да';
}
