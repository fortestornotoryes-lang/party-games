# Gotchas

> Сюда добавлять новые грабли по мере обнаружения (симптом → причина → решение). Устаревшие — удалять.

## Canvas / рисование

- Не писать raw-canvas: DPR-масштабирование, ресайз (`ResizeObserver`) и маппинг координат живут в хуке `shared/hooks/useCanvasSurface.ts` — на нём построены `DrawingCanvas` и канвас FakeArtist. Без этого рисунок мылится/смещается на мобильных.
- На элементах с жестами рисования/перетаскивания нужен `touch-action: none`, иначе браузер перехватывает скролл.

## Производительность

- `backdrop-filter` дорогой на мобильных: не вкладывать blur-элементы друг в друга (вложенный backdrop-filter ломает плавность скролла). Использовать готовый `.glass-card` один слоем.

## Layout на мобильных

- Скроллируемая область внутри flex-колонки: ребёнку нужны `flex-1 min-h-0`, иначе он растягивает родителя вместо скролла.

## Storage

- Все чтения localStorage идут через `safeParseJson` в storageService — при добавлении новых ключей не парсить JSON напрямую.

## Lint (ошибки, не предупреждения)

- `react-hooks/immutability`: функцию, которую вызывает `useEffect`, объявлять **до** эффекта (паттерн `initGame`/`initBoard` в играх).
- `react-hooks/set-state-in-effect`: не делать `setState` синхронно в эффекте ради производного значения — вместо `useState`+`useEffect` использовать `useMemo`.
- React 19: `React.FormEvent`/`FormEventHandler` deprecated — для submit-хендлеров типизировать `React.SyntheticEvent<HTMLFormElement>`.
- `Array(n).fill(x)` даёт `any[]` (no-unsafe-assignment) — писать `Array<T>(n).fill(x)`; вместо `[...Array(n)].map` — `Array.from({ length: n }).map`.
- `react/prop-types` не резолвит `React.InputHTMLAttributes` как тип пропсов — используемые в компоненте пропсы (напр. `className`) объявлять явно в локальном интерфейсе (см. `shared/components/TextInput.tsx`).

_Ревизия: 2026-07-06_