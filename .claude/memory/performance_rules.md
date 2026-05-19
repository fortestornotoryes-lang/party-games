---
name: performance-rules
description: "Что убивает производительность скроллинга: backdrop-filter, вложенные blur, fixed фоны"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## Главное правило: не вкладывать backdrop-filter

`glass-card` имеет `backdrop-filter: blur(20px)`. Если на родительском враппере тоже стоит `backdrop-blur-*` — каждый frame скроллинга браузер пересчитывает ВСЕ вложенные blur-слои.

**Что было:** `backdrop-blur-3xl` (64px) на главном враппере App.tsx + 10+ карточек с `backdrop-filter: blur(20px)` = 11 слоёв на кадр → рывки в MainMenu.

**Fix:** убрать `backdrop-blur-*` с враппера, оставить только на leaf-элементах (glass-card).

```tsx
// НЕПРАВИЛЬНО
<div className="bg-black/20 backdrop-blur-3xl">
  <div className="glass-card">...</div>  {/* glass-card тоже blur! */}
</div>

// ПРАВИЛЬНО
<div className="bg-black/20">
  <div className="glass-card">...</div>
</div>
```

## position: fixed + backdrop-filter = дорого

`body::before` и `body::after` — `position: fixed` со сложными градиентами. Каждый `glass-card` вынужден "просвечивать" через них. Это нормально пока blur только на leaf-элементах.

**Why:** fixed фоны не кешируются в composited layer при наличии backdrop-filter детей.

## Что БЕЗОПАСНО (не тормозит скроллинг)

- CSS `transform` анимации (spin, scale, translate) — GPU, не влияют
- `box-shadow`, `border`, `opacity` — не вызывают layout
- Один уровень `backdrop-filter: blur(20px)` на leaf-элементах
- `motion/react` spring animations на opacity/transform

## Что ОПАСНО

- `backdrop-blur-*` на контейнере с дочерними `glass-card`
- `blur-2xl` / `blur-*` на абсолютно позиционированных декоративных div внутри каждой карточки (× кол-во карточек)
- `drop-shadow-[...]` CSS filter на тексте или элементах в списке
- `mix-blend-mode` + `backdrop-filter` вместе
- `opacity-0` + `blur-*` — браузер всё равно создаёт compositor layer

## Текущее состояние glass-card (оптимизировано)

```css
.glass-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  /* backdrop-filter УБРАН — был главной причиной лагов скролла */
}
```
