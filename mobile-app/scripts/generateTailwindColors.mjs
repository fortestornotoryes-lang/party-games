// Генерирует tailwind.colors.json из PREMIUM_RGB (src/shared/theme/colors.ts).
// Принцип тот же, что в веб-версии (scripts/generateThemeColors.ts):
// colors.ts — ЕДИНСТВЕННЫЙ источник цветов, сгенерированный json руками не править.
// Запуск: npm run theme:gen (автоматически в prestart).
import { readFileSync, writeFileSync } from 'node:fs';

const colorsUrl = new URL('../src/shared/theme/colors.ts', import.meta.url);
const outUrl = new URL('../tailwind.colors.json', import.meta.url);

const src = readFileSync(colorsUrl, 'utf8');
const block = src.match(/PREMIUM_RGB = \{([^}]+)\}/)?.[1];
if (!block) {
  throw new Error('PREMIUM_RGB не найден в src/shared/theme/colors.ts');
}

const entries = [...block.matchAll(/(\w+):\s*'([\d,]+)'/g)];
if (entries.length === 0) {
  throw new Error('Не удалось распарсить цвета PREMIUM_RGB');
}

// `<alpha-value>` — плейсхолдер Tailwind: включает модификаторы прозрачности
// вида bg-premium-red/10, как в веб-версии
const colors = Object.fromEntries(
  entries.map(([, name, rgb]) => [
    `premium-${name}`,
    `rgb(${rgb.split(',').join(' ')} / <alpha-value>)`,
  ])
);

writeFileSync(outUrl, `${JSON.stringify(colors, null, 2)}\n`);
console.log(`tailwind.colors.json: ${entries.length} цветов из PREMIUM_RGB`);
