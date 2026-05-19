---
name: mobile-fixes
description: "Паттерны мобильной адаптации: canvas, touch-events, safe-area, flex-layout"
metadata: 
  node_type: memory
  type: project
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## Canvas на мобилке — правильный паттерн

Используется в `DrawingCanvas.tsx` и теперь в `FakeArtistGame.tsx`.

**Проблема:** `useEffect` с `getBoundingClientRect()` запускается до завершения flex-layout → `rect.height === 0` → canvas 0×0.

**Проблема 2:** `ctx.scale(2, 2)` вызывается при каждом ресайзе и накапливается (4x, 8x...).

**Решение:**
```ts
useEffect(() => {
  const canvas = canvasRef.current;
  const container = containerRef.current;
  if (!canvas || !container) return;

  const initCanvas = () => {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;  // ждём реального размера
    const dpr = window.devicePixelRatio || 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);  // НЕ ctx.scale — не накапливается
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const ro = new ResizeObserver(initCanvas);
  ro.observe(container);
  initCanvas();
  return () => ro.disconnect();
}, []);
```

Координаты из `getPos` остаются в CSS-пикселях — `ctx.setTransform(dpr,...)` масштабирует сам.

## Touch-события на мобилке — pull-to-refresh

**Проблема:** `e.preventDefault()` в React-хендлерах (`onTouchMove`, `onTouchStart`) не работает — React навешивает их с `passive: true` на корень документа.

**Решение — CSS `touch-action: none`:**
```tsx
<div style={{ touchAction: 'none' }} onTouchStart={...} onTouchMove={...}>
```
CSS-уровень, браузер всегда уважает. Убирает pull-to-refresh и scroll во время рисования.

**Не работает:** добавление `e.preventDefault()` в React synthetic event handlers для touch.

## flex-1 + h-full — ловушка

`h-full` не наследуется через `overflow-y-auto` контейнер.

**Паттерн:**
```tsx
<div className="flex-1 relative min-h-0">      {/* min-h-0 обязателен! */}
  <div className="absolute inset-0 flex flex-col">
    <canvas className="flex-1 min-h-0 w-full" />
  </div>
</div>
```

`min-h-0` на flex-детях с `flex-1` — без него flex-элемент не сожмётся ниже контентного размера.

## Safe area

В `index.css`:
```css
.safe-top  { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

На корневом div App: `safe-top safe-bottom`.
