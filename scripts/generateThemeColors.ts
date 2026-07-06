import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PREMIUM_RGB } from '../src/shared/theme/colors';

// «255,46,77» → «#ff2e4d»
const rgbToHex = (rgb: string): string =>
  '#' +
  rgb
    .split(',')
    .map((channel) => Number(channel.trim()).toString(16).padStart(2, '0'))
    .join('');

const tokens = Object.entries(PREMIUM_RGB)
  .map(([name, rgb]) => `  --color-premium-${name}: ${rgbToHex(rgb)};`)
  .join('\n');

const css = `/* АВТОГЕНЕРИРОВАНО из src/shared/theme/colors.ts (PREMIUM_RGB) — не редактировать руками.
   Пересоздать: npm run theme:gen (запускается автоматически перед dev и build). */
@theme {
${tokens}
}
`;

const outFile = join(
  dirname(fileURLToPath(import.meta.url)),
  '../src/app/styles/premium-colors.css'
);
writeFileSync(outFile, css);
console.log(`premium-colors.css: записано ${Object.keys(PREMIUM_RGB).length} токенов`);
