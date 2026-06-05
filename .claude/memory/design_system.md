---
name: design-system
description: "Полный визуальный язык проекта: все токены index.css, glass-card, типографика, компоненты UI"
metadata:
  type: project
---

## Фон (body)

- Цвет: `#0b0915` (`bg-bg`)
- Три radial-gradient на `body` (фиолетовый сверху, красный и синий снизу)
- `body::after` — SVG-шум `opacity-noise` (0.022), `mix-blend-mode: overlay`, `position: fixed`
- Базовый текст: `text-white/90`

---

## Цвета

### Base
```
--color-bg: #0b0915
```

### Premium accent palette
```
--color-premium-red:    #ff2e4d    text/bg/border-premium-red
--color-premium-green:  #00d88a    text/bg/border-premium-green
--color-premium-sky:    #1fb6ff    text/bg/border-premium-sky
--color-premium-blue:   #3f7bff    text/bg/border-premium-blue
--color-premium-orange: #ff8a1f    text/bg/border-premium-orange
--color-premium-yellow: #ffcc1f    text/bg/border-premium-yellow
--color-premium-purple: #c77bff    text/bg/border-premium-purple
--color-premium-pink:   #ff2eb4    text/bg/border-premium-pink
--color-premium-cyan:   #00e5ff    text/bg/border-premium-cyan
--color-premium-lime:   #84cc16    text/bg/border-premium-lime
--color-premium-teal:   #14b8a6    text/bg/border-premium-teal
--color-premium-indigo: #6366f1    text/bg/border-premium-indigo
```
Opacity модификаторы: `/5`, `/10`, `/20`, `/30`, `/40`, `/50`

### Семантические цвета текста (Typography.tsx)
```
white   → text-white
body    → text-white/80
muted   → text-white/50
faint   → text-white/25
dimmer  → text-white/15
```

---

## Border radius

```
--radius-premium-3xl: 40px  → rounded-premium-3xl  большие карточки aspect-3/4 (PassPhoneCard, DistributionFlow)
--radius-premium-2xl: 32px  → rounded-premium-2xl  крупные полноэкранные панели
--radius-premium-xl:  28px  → rounded-premium-xl   боттомшиты, крупные секции Settings
--radius-premium-lg:  20px  → rounded-premium-lg   карточки игр, режимы игры
--radius-premium-md:  16px  → rounded-premium-md   кнопки, небольшие карточки, language pills
--radius-premium-sm:  12px  → rounded-premium-sm   теги, иконки, icon-кнопки
--radius-premium-xs:  6px   → rounded-premium-xs   HUD-элементы, декоративные corner-accents
```
Также разрешён `rounded-full` для pill/badge/dot форм.

---

## Типографика

### Шрифты
```
--font-sans:    "Inter"           стандартный текст
--font-display: "Unbounded"       крупные заголовки → класс font-display
--font-mono:    "JetBrains Mono"  редко, технический текст
```

### Кастомные токены
```
--text-pico:        0.375rem  (6px)   декоративный HUD micro-text
--text-micro:       0.5rem    (8px)   абсолютный минимум
--text-micro:        0.5625rem (9px)   uppercase tracking-теги, badges
--text-tag:         0.625rem  (10px)  section-хедеры, метаданные
--text-label:       0.75rem   (12px)  лейблы очков, тегов игроков
--text-card:        1rem      (16px)  текст карточек, ответов
--text-heading:     1.75rem   (28px)  заголовок экрана (Typography.Title md)
--text-sub-heading: 1.5rem    (24px)  подзаголовок экрана
--text-big:         2rem      (32px)  крупный акцентный текст
--text-logo:        3.5rem    (56px)  главный лого PARTY HUB
--text-display-xl:  4.375rem  (70px)  hero-текст xl
--text-display-2xl: 5.5rem    (88px)  hero-текст full-screen
```

### Стандартный Tailwind для промежуточных
`text-xs`(12px) · `text-sm`(14px) · `text-base`(16px) · `text-lg`(18px) · `text-xl`(20px) · `text-2xl`(24px) · `text-3xl`(30px) и выше

### Паттерны написания
- Заголовки: `font-black italic uppercase tracking-tighter leading-none`
- Теги/метки: `font-black uppercase tracking-[0.4em]` (или другое em-значение)
- Кнопки primary: `font-black italic font-display`

---

## Тени

```css
/* Использование: style={{ boxShadow: 'var(--shadow-rim)' }}
   или в составной строке: '0 0 80px rgba(...), var(--shadow-card), ...' */

--shadow-rim:    inset 0 1px 0 rgba(255,255,255,0.06)   верхняя грань стеклянной карточки
--shadow-card:   0 32px 64px rgba(0,0,0,0.55)           крупные карточки (PassPhoneCard, Distribution)
--shadow-button: 0 8px 24px rgba(0,0,0,0.3)             кнопки, маленькие панели
```

---

## Blur

```css
/* Класс: backdrop-blur-overlay
   Inline style: backdropFilter: 'blur(var(--blur-overlay))'
   Оба варианта в Tailwind v4 генерируются из одного токена */

--blur-backdrop: 4px   dim-overlay за модалками
--blur-overlay:  20px  sticky headers (GameHeader)
--blur-modal:    32px  bottom sheets, модальные панели
```

---

## Opacity

```css
--opacity-noise: 0.022   /* → класс opacity-noise для SVG-шума и grid-текстур */
```

---

## Глобальные CSS-классы (index.css @layer base)

### .glass-card
```css
background: linear-gradient(135deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 100%);
border: 1px solid rgba(255,255,255,0.08);
backdrop-filter: blur(16px);
```
**Важно:** не вкладывать `backdrop-blur-*` поверх `glass-card` — вложенные blur убивают скроллинг. [[performance-rules]]

### .glass-input
```css
background: linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.015) 100%);
border: 1px solid rgba(255,255,255,0.07);
```

### .safe-top / .safe-bottom
`padding-top: env(safe-area-inset-top)` и аналогично снизу — для notch/home-bar.

### .font-display
Shortcut для `font-family: var(--font-display)` (Unbounded).

---

## Анимации (@theme)

Готовые классы анимаций, определённые через `--animate-*` токены:

```
animate-cyber-hard-1     — киберпанк-глитч слой 1 (steps 2, 1s infinite)
animate-cyber-hard-2     — киберпанк-глитч слой 2 (steps 2, 1s infinite)
animate-matrix-glitch    — матричный глитч (steps 4, 2s infinite)
animate-glitch           — базовый translate-глитч (0.3s cubic-bezier infinite)
animate-glitch-layer-1   — глитч + clip-path слой 1 (composite 1.5s + 0.3s)
animate-glitch-layer-2   — глитч + clip-path слой 2 (composite 1.5s + 0.3s)
```

---

## Компоненты UI (src/components/UI.tsx)

| Компонент | Описание |
|---|---|
| `<PrimaryButton>` | Основная кнопка. Варианты: `white`, `premium`, `red`, `blue`, `emerald`, `purple`, `outline`. Базовый класс: `w-full h-16 rounded-premium-md font-black italic text-xl` |
| `<SectionLabel>` | `text-label font-black uppercase tracking-[0.5em] italic` |
| `<Badge>` | `rounded-premium-sm text-micro font-black uppercase` |
| `<IconButton>` | `p-4 rounded-premium-sm`. Варианты: `ghost`, `filled`, `danger` |
| `<TabButton>` | `text-label font-black uppercase tracking-[0.3em] font-display italic` |
| `<PageWrapper>` | Обёртка страницы с `safe-top`, `overflow-y-auto`, правильным padding |

---

## Компонент Typography (src/components/Typography.tsx)

```
Typography.Display  — font-display font-black italic uppercase tracking-tighter leading-none
                      sizes: sm(text-4xl) md(text-5xl) lg(text-6xl) xl(text-display-xl) 2xl(text-display-2xl)
                      prop glow — добавляет textShadow свечение

Typography.Title    — font-black uppercase italic tracking-tighter
                      sizes: sm(text-xl) md(text-heading) lg(text-3xl) xl(text-4xl)

Typography.Heading  — font-black italic uppercase tracking-tighter
                      sizes: xs(text-base) sm(text-lg) md(text-2xl) lg(text-3xl)

Typography.Body     — leading-relaxed font-medium
                      sizes: xs(text-xs) sm(text-sm) base(text-base)

Typography.Label    — font-black uppercase (НЕ italic, НЕ font-display)
                      sizes: xs(text-tag, tracking-[0.4em]) sm(text-label, tracking-[0.3em]) md(text-xs, tracking-[0.2em])

Typography.Caption  — font-black uppercase
                      sizes: xs(text-micro, tracking-[0.35em]) sm(text-micro, tracking-[0.3em])

Typography.Score    — font-black italic tabular-nums (НЕ uppercase)
                      sizes: sm(text-3xl) md(text-4xl) lg(text-5xl) xl(text-6xl)
```
Цвет через prop `color`: `white` | `body` | `muted` | `faint` | `dimmer` | `red` | `blue` | `green` | `sky` | `orange` | `yellow` | `purple`

---

## Карточки игр (GameMenuCard)

```tsx
// Обёртка
className="w-full p-4 rounded-r-premium-lg flex items-center gap-4 bg-white/[0.035] border border-white/8 shadow-rim"

// Иконка
className={`w-13 h-13 rounded-premium-md ${t.solid} flex items-center justify-center`}

// Левая цветная полоска
className={`absolute left-0 top-0 bottom-0 w-1.25 rounded-r-full ${t.solid} opacity-75`}
```

---

## GameHeader (sticky header во время игры)

```tsx
// Позиция
className="sticky top-0 z-30 px-4 py-2.5 border-b border-white/6"
style={{
  background: 'rgba(11, 9, 21, 0.75)',
  backdropFilter: 'blur(var(--blur-overlay))',
  WebkitBackdropFilter: 'blur(var(--blur-overlay))',
}}

// Иконка игры
className={`w-8 h-8 rounded-premium-sm border ${t.headerTheme} bg-white/5`}

// Заголовок / subtitle
className="text-sm font-black uppercase italic tracking-tight"
className="text-micro text-white/35 uppercase tracking-[0.18em] font-black"
```

---

## PassPhoneCard

```tsx
className="w-full aspect-3/4 rounded-premium-2xl overflow-hidden"
style={{
  border: `1.5px solid ${accent.border}`,
  boxShadow: `var(--shadow-card), 0 0 40px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
}}
// Декоративные углы: rounded-tl/tr/bl/br-premium-xs
// Grid texture: opacity-noise
// Cyberpunk HUD container: rounded-premium-xs
```
