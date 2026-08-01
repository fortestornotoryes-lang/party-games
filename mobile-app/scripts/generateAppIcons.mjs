// Разовый скрипт: растеризует public/icon.svg (веб-брендинг Party Hub) в набор
// иконок/сплэша для Expo. Запускать вручную после правки логотипа: node scripts/generateAppIcons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const outDir = path.resolve(__dirname, '..', 'assets', 'images');
mkdirSync(outDir, { recursive: true });

const svgPath = path.join(root, 'public', 'icon.svg');

// Полная иконка (фон + глиф) — iOS/favicon/splash-подложка
const fullIcon = () => sharp(svgPath).resize(1024, 1024);

// Глиф контроллера без фона — Android adaptive foreground/monochrome + splash-изображение
const glyphSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect x="96" y="196" width="320" height="160" rx="80" fill="none" stroke="#10b981" stroke-width="18"/>
  <rect x="148" y="256" width="56" height="20" rx="4" fill="#10b981"/>
  <rect x="166" y="238" width="20" height="56" rx="4" fill="#10b981"/>
  <circle cx="340" cy="248" r="12" fill="#10b981" opacity="0.4"/>
  <circle cx="364" cy="266" r="12" fill="#10b981"/>
  <circle cx="316" cy="266" r="12" fill="#10b981" opacity="0.4"/>
  <circle cx="340" cy="284" r="12" fill="#10b981" opacity="0.4"/>
  <circle cx="242" cy="266" r="7" fill="#10b981" opacity="0.5"/>
  <circle cx="266" cy="266" r="7" fill="#10b981" opacity="0.5"/>
  <ellipse cx="172" cy="356" rx="40" ry="28" fill="none" stroke="#10b981" stroke-width="18"/>
  <ellipse cx="340" cy="356" rx="40" ry="28" fill="none" stroke="#10b981" stroke-width="18"/>
</svg>`;
const glyphBuffer = Buffer.from(glyphSvg);

await fullIcon().png().toFile(path.join(outDir, 'icon.png'));
await sharp(glyphBuffer).resize(512, 512).png().toFile(path.join(outDir, 'android-icon-foreground.png'));
await sharp(glyphBuffer).resize(432, 432).png().toFile(path.join(outDir, 'android-icon-monochrome.png'));
await sharp(glyphBuffer)
  .resize(300, 300)
  .png()
  .toFile(path.join(outDir, 'splash-icon.png'));
await fullIcon().resize(48, 48).png().toFile(path.join(outDir, 'favicon.png'));

console.log('Иконки сгенерированы в', outDir);
