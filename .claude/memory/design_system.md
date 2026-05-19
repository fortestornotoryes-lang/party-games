---
name: design-system
description: "Текущий визуальный язык: premium-цвета, glass-card, типографика, border-radius, компоненты"
metadata: 
  node_type: memory
  type: project
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## Фон и базовые цвета

- Фон тела: `#0B0915`
- `body::before` — `position: fixed`, два наслоённых radial-gradient (синий + зелёный снизу)
- `body::after` — `position: fixed`, SVG-шум opacity 0.03, `mix-blend-mode: overlay`
- Текст: `text-slate-100`

## Premium цветовые токены (index.css @theme)

```
--color-premium-red:    #FF2E4D
--color-premium-green:  #00D88A
--color-premium-sky:    #1FB6FF
--color-premium-blue:   #3F7BFF
--color-premium-orange: #FF8A1F
--color-premium-yellow: #FFCC1F
--color-premium-purple: #C77BFF
```

Использование: `bg-premium-red`, `text-premium-sky`, `border-premium-green/40`, etc.

## Border-radius токены

```
--radius-premium-lg: 22px   → rounded-premium-lg  (карточки игр в меню)
--radius-premium-md: 16px   → rounded-premium-md  (кнопки)
--radius-premium-sm: 12px   → rounded-premium-sm  (теги, маленькие элементы)
```

## Шрифты

```
--font-sans:    "Inter"          → стандартный текст
--font-display: "Unbounded"      → .font-display, крупные заголовки/кнопки
--font-mono:    "JetBrains Mono" → редко
```

Заголовки: `font-black italic uppercase tracking-tighter leading-[0.75]`
Теги/метки: `text-[10px] font-black uppercase tracking-[0.2em]` или `tracking-[0.5em]`

## glass-card (index.css)

```css
.glass-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%);
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

**Важно:** `backdrop-filter: blur(20px)` дорого на скроллинге. Не добавлять `backdrop-blur-*` на враппер поверх glass-card элементов — вложенные blur убивают производительность. [[performance-rules]]

## Карточки игр в MainMenu

```tsx
className="w-full p-6 glass-card rounded-premium-lg flex items-center gap-6 border-white/10"
```

Иконка игры: `w-20 h-20 rounded-3xl bg-premium-{color}` с `bg-gradient-to-tr from-black/40 to-transparent` внутри.

## Кнопки

Все primary кнопки через `<PrimaryButton>` из UI.tsx. Варианты: `white`, `premium`, `red`, `blue`, `emerald`, `purple`, `outline`.
Базовый класс: `w-full h-16 rounded-premium-md font-black italic text-xl`.

## Анимированный логотип (MainMenu)

Спиннер: `animate-[spin_1.5s_linear_infinite]` на `border-premium-red rounded-full border-t-transparent`.
8 точек расположены через `rotate(${r * 45}deg) translateY(-10px)`.

## themeConfigs (MainMenu)

```ts
const themeConfigs = {
  'premium-red': { iconBg, iconShadow, hoverBorder, accentBg, accentText },
  // ...для каждого premium-цвета
}
```

`getThemeConfig(theme)` маппит `'red'` → `'premium-red'`.
