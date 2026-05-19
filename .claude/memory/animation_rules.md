---
name: animation-rules
description: "Правила Framer Motion / motion/react: импорт, AnimatePresence, spring, flip, drag"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## Импорт

```ts
import { motion, AnimatePresence } from 'motion/react';
// Пакет называется 'motion', НЕ 'framer-motion'
```

## Правило 1: AnimatePresence при exit

Если есть `exit` prop и меняется `key` — ОБЯЗАТЕЛЬНО `<AnimatePresence>`.

```tsx
// ПРАВИЛЬНО
<AnimatePresence mode="wait">
  <motion.div key={phase} exit={{ opacity: 0 }}>...</motion.div>
</AnimatePresence>
```

**Why:** Без AnimatePresence exit-анимация не запустится — элемент просто исчезнет.

## Правило 2: Spring damping ≥ 20

`damping: 10` вызывает заметный bounce в UI. Для большинства элементов:
```tsx
transition={{ type: "spring", damping: 25, stiffness: 200 }}
```

## Правило 3: Flip-анимация карточек

```tsx
<div className="relative [perspective:2000px]">
  <AnimatePresence mode="wait">
    {!revealed ? (
      <motion.div key="back"
        initial={{ rotateY: -180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
      />
    ) : (
      <motion.div key="front"
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
      />
    )}
  </AnimatePresence>
</div>
```

`bounce: 0.4` даёт раскачку — нужен `bounce: 0.1`.

## Правило 4: Не ставить layout на drag/touch элементы

`layout` анимирует изменения позиции → лаг при перетаскивании. Убран в WavelengthGame.

## Правило 5: delay на layout-элементах → рывки

`transition={{ delay: index * 0.05 }}` применяется ко всем анимациям включая exit. При удалении элемента из списка оставшиеся двигаются с задержкой.

```tsx
// ПРАВИЛЬНО
<motion.div layout transition={{ duration: 0.2 }}>
```

## Stagger в MainMenu

```ts
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } } };
```

## Модальное окно (overlay + inner)

```tsx
<AnimatePresence>
  {show && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }}>
        ...
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## CSS spin — не тормозит

`animate-[spin_1.5s_linear_infinite]` на `border-radius` элементе — аппаратно ускорен через transform, не влияет на скроллинг.
