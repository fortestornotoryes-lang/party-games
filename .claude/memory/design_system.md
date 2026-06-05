---
name: design-system
description: "Полный визуальный язык проекта: все токены index.css, glass-card, типографика, компоненты UI"
metadata:
  type: project
---

# Design System

## Фон (body)

- Цвет: `#0b0915` (`bg-bg`)
- Три `radial-gradient` на `body`:
    - фиолетовый сверху
    - красный снизу
    - синий снизу
- `body::after`:
    - SVG-шум
    - `opacity-noise` (`0.022`)
    - `mix-blend-mode: overlay`
    - `position: fixed`
- Базовый текст: `text-white/90`

## Цвета

### Base

```css
--color-bg: #0b0915;
```

### Premium accent palette

```css
--color-premium-red:    #ff2e4d;
--color-premium-green:  #00d88a;
--color-premium-sky:    #1fb6ff;
--color-premium-blue:   #3f7bff;
--color-premium-orange: #ff8a1f;
--color-premium-yellow: #ffcc1f;
--color-premium-purple: #c77bff;
--color-premium-pink:   #ff2eb4;
--color-premium-cyan:   #00e5ff;
--color-premium-lime:   #84cc16;
--color-premium-teal:   #14b8a6;
--color-premium-indigo: #6366f1;
```

Использование:
- `text-premium-red`
- `bg-premium-red`
- `border-premium-red`

Поддерживаемые opacity-модификаторы:
- `/5`
- `/10`
- `/20`
- `/30`
- `/40`
- `/50`

### Семантические цвета текста

Источник: `Typography.tsx`

```ts
white   → text-white
body    → text-white/80
muted   → text-white/50
faint   → text-white/25
dimmer  → text-white/15
```

## Border radius

```css
--radius-premium-3xl: 40px;
--radius-premium-2xl: 32px;
--radius-premium-xl:  28px;
--radius-premium-lg:  20px;
--radius-premium-md:  16px;
--radius-premium-sm:  12px;
--radius-premium-xs:  6px;
```

Использование:
- `rounded-premium-3xl` — большие карточки `aspect-3/4` (`PassPhoneCard`, `DistributionFlow`)
- `rounded-premium-2xl` — крупные полноэкранные панели
- `rounded-premium-xl` — bottom sheets, крупные секции `Settings`
- `rounded-premium-lg` — карточки игр, режимы игры
- `rounded-premium-md` — кнопки, небольшие карточки, language pills
- `rounded-premium-sm` — теги, иконки, icon-buttons
- `rounded-premium-xs` — HUD-элементы, декоративные corner accents

Дополнительно разрешён:
- `rounded-full` — pill / badge / dot формы

## Типографика

### Шрифты

```css
--font-sans:    "Inter";
--font-display: "Unbounded";
--font-mono:    "JetBrains Mono";
```

Назначение:
- `--font-sans` — стандартный текст
- `--font-display` — крупные заголовки, класс `font-display`
- `--font-mono` — редко, технический текст

### Кастомные size-токены

```css
--text-pico:         0.375rem;   /* 6px  */
--text-micro:        0.5rem;     /* 8px  */
--text-micro-alt:    0.5625rem;  /* 9px  */
--text-tag:          0.625rem;   /* 10px */
--text-label:        0.75rem;    /* 12px */
--text-card:         1rem;       /* 16px */
--text-heading:      1.75rem;    /* 28px */
--text-sub-heading:  1.5rem;     /* 24px */
--text-big:          2rem;       /* 32px */
--text-logo:         3.5rem;     /* 56px */
--text-display-xl:   4.375rem;   /* 70px */
--text-display-2xl:  5.5rem;     /* 88px */
```

### Стандартный Tailwind для промежуточных размеров

- `text-xs` — 12px
- `text-sm` — 14px
- `text-base` — 16px
- `text-lg` — 18px
- `text-xl` — 20px
- `text-2xl` — 24px
- `text-3xl` — 30px и выше

### Паттерны написания

- Заголовки: `font-black italic uppercase tracking-tighter leading-none`
- Теги / метки: `font-black uppercase tracking-[0.4em]`
- Primary-кнопки: `font-black italic font-display`

## Тени

```css
--shadow-rim:    inset 0 1px 0 rgba(255,255,255,0.06);
--shadow-card:   0 32px 64px rgba(0,0,0,0.55);
--shadow-button: 0 8px 24px rgba(0,0,0,0.3);
```

Использование:
- `--shadow-rim` — верхняя грань стеклянной карточки
- `--shadow-card` — крупные карточки (`PassPhoneCard`, `Distribution`)
- `--shadow-button` — кнопки, маленькие панели

Пример:
```tsx
style={{ boxShadow: 'var(--shadow-rim)' }}
```

или:

```tsx
style={{ boxShadow: '0 0 80px rgba(...), var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.08)' }}
```

## Blur

```css
--blur-backdrop: 4px;
--blur-overlay:  20px;
--blur-modal:    32px;
```

Использование:
- `--blur-backdrop` — dim overlay за модалками
- `--blur-overlay` — sticky headers (`GameHeader`)
- `--blur-modal` — bottom sheets, модальные панели

Класс:
- `backdrop-blur-overlay`

Inline:
```tsx
style={{ backdropFilter: 'blur(var(--blur-overlay))' }}
```

## Opacity

```css
--opacity-noise: 0.022;
```

Использование:
- класс `opacity-noise` для SVG-шума и grid-текстур

## Глобальные CSS-классы (`index.css`, `@layer base`)

### `.glass-card`

```css
.glass-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
}
```

Важно:
- не вкладывать `backdrop-blur-*` поверх `.glass-card`
- вложенные blur ухудшают производительность и ломают скролл

### `.glass-input`

```css
.glass-input {
  background: linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.015) 100%);
  border: 1px solid rgba(255,255,255,0.07);
}
```

### `.safe-top` / `.safe-bottom`

```css
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### `.font-display`

```css
.font-display {
  font-family: var(--font-display);
}
```

## Анимации (`@theme`)

Готовые animation-токены:

```css
--animate-cyber-hard-1:   cyber-hard-1 1s steps(2) infinite;
--animate-cyber-hard-2:   cyber-hard-2 1s steps(2) infinite;
--animate-matrix-glitch:  matrix-glitch 2s steps(4) infinite;
--animate-glitch:         glitch 0.3s cubic-bezier(...) infinite;
--animate-glitch-layer-1: glitch-layer-1 1.5s ...;
--animate-glitch-layer-2: glitch-layer-2 1.5s ...;
```

Назначение:
- `animate-cyber-hard-1` — киберпанк-глитч слой 1
- `animate-cyber-hard-2` — киберпанк-глитч слой 2
- `animate-matrix-glitch` — матричный глитч
- `animate-glitch` — базовый translate glitch
- `animate-glitch-layer-1` — composite glitch + clip-path, слой 1
- `animate-glitch-layer-2` — composite glitch + clip-path, слой 2

## UI-компоненты (`src/components/UI.tsx`)

| Компонент | Описание |
|---|---|
| `<PrimaryButton>` | Основная кнопка. Варианты: `white`, `premium`, `red`, `blue`, `emerald`, `purple`, `outline`. Базовый класс: `w-full h-16 rounded-premium-md font-black italic text-xl` |
| `<SectionLabel>` | `text-label font-black uppercase tracking-[0.5em] italic` |
| `<Badge>` | `rounded-premium-sm text-micro font-black uppercase` |
| `<IconButton>` | `p-4 rounded-premium-sm`. Варианты: `ghost`, `filled`, `danger` |
| `<TabButton>` | `text-label font-black uppercase tracking-[0.3em] font-display italic` |
| `<PageWrapper>` | Обёртка страницы с `safe-top`, `overflow-y-auto`, правильным padding |

## Typography (`src/components/Typography.tsx`)

### `Typography.Display`

```tsx
font-display font-black italic uppercase tracking-tighter leading-none
```

Размеры:
- `sm` → `text-4xl`
- `md` → `text-5xl`
- `lg` → `text-6xl`
- `xl` → `text-display-xl`
- `2xl` → `text-display-2xl`

Дополнительно:
- `glow` prop добавляет `textShadow`

### `Typography.Title`

```tsx
font-black uppercase italic tracking-tighter
```

Размеры:
- `sm` → `text-xl`
- `md` → `text-heading`
- `lg` → `text-3xl`
- `xl` → `text-4xl`

### `Typography.Heading`

```tsx
font-black italic uppercase tracking-tighter
```

Размеры:
- `xs` → `text-base`
- `sm` → `text-lg`
- `md` → `text-2xl`
- `lg` → `text-3xl`

### `Typography.Body`

```tsx
leading-relaxed font-medium
```

Размеры:
- `xs` → `text-xs`
- `sm` → `text-sm`
- `base` → `text-base`

### `Typography.Label`

```tsx
font-black uppercase
```

Примечание:
- не `italic`
- не `font-display`

Размеры:
- `xs` → `text-tag tracking-[0.4em]`
- `sm` → `text-label tracking-[0.3em]`
- `md` → `text-xs tracking-[0.2em]`

### `Typography.Caption`

```tsx
font-black uppercase
```

Размеры:
- `xs` → `text-micro tracking-[0.35em]`
- `sm` → `text-micro tracking-[0.3em]`

### `Typography.Score`

```tsx
font-black italic tabular-nums
```

Примечание:
- не `uppercase`

Размеры:
- `sm` → `text-3xl`
- `md` → `text-4xl`
- `lg` → `text-5xl`
- `xl` → `text-6xl`

### Цвета через prop `color`

```ts
white | body | muted | faint | dimmer | red | blue | green | sky | orange | yellow | purple
```

## Карточки игр (`GameMenuCard`)

### Обёртка

```tsx
className="w-full p-4 rounded-r-premium-lg flex items-center gap-4 bg-white/[0.035] border border-white/8 shadow-rim"
```

### Иконка

```tsx
className={`w-13 h-13 rounded-premium-md ${t.solid} flex items-center justify-center`}
```

### Левая цветная полоска

```tsx
className={`absolute left-0 top-0 bottom-0 w-1.25 rounded-r-full ${t.solid} opacity-75`}
```

## `GameHeader`

Sticky header во время игры.

### Позиция

```tsx
className="sticky top-0 z-30 px-4 py-2.5 border-b border-white/6"
style={{
  background: 'rgba(11, 9, 21, 0.75)',
  backdropFilter: 'blur(var(--blur-overlay))',
  WebkitBackdropFilter: 'blur(var(--blur-overlay))',
}}
```

### Иконка игры

```tsx
className={`w-8 h-8 rounded-premium-sm border ${t.headerTheme} bg-white/5`}
```

### Заголовок и subtitle

```tsx
className="text-sm font-black uppercase italic tracking-tight"
className="text-micro text-white/35 uppercase tracking-[0.18em] font-black"
```

## `PassPhoneCard`

```tsx
className="w-full aspect-3/4 rounded-premium-2xl overflow-hidden"
style={{
  border: `1.5px solid ${accent.border}`,
  boxShadow: `var(--shadow-card), 0 0 40px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
}}
```

Дополнительно:
- декоративные углы: `rounded-tl-premium-xs`, `rounded-tr-premium-xs`, `rounded-bl-premium-xs`, `rounded-br-premium-xs`
- grid texture: `opacity-noise`
- cyberpunk HUD container: `rounded-premium-xs`