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

## Mobile (React Native, `mobile-app/`)

- **3D-флип (`rotateY`) на Android**: без явного `perspective` в трансформе анимация не даёт настоящего 3D-эффекта и `backfaceVisibility: 'hidden'` работает некорректно — карточка «флипается», но обратная грань не проявляется. На iOS перспектива подставляется по умолчанию, поэтому баг воспроизводится только на реальном Android-устройстве. Для `MotiView` перспективу передавать через `animate={{ rotateY, perspective: 1000 }}`, а не через отдельный `style={{ transform: [...] }}` — Moti кладёт анимируемый `transform` последним в массив стилей и полностью перезаписывает ключ `transform` из переданного `style` (см. `src/games/MemoRiskGame/components/MemoCardView.tsx`).
- **`TextInput` обрезает текст по горизонтали на Android**: нативный `EditText` добавляет свой внутренний padding поверх Tailwind `px-*`, сжимая видимую область текста внутри фиксированной высоты. Фикс — на Android явно `padding: 0` + `textAlignVertical: 'center'` в `style` (см. `src/shared/components/TextInput.tsx`).
- **Вложенные `AnimatePresence` (Moti) + синхронная смена двух state-переменных**: если один хендлер одновременно меняет state, от которого зависит внешний `AnimatePresence` (напр. `currentIndex`), и state, от которого зависит вложенный внутри него `AnimatePresence` (напр. `isRevealed`), то у ещё не размонтированного (анимирующегося на выход) элемента переменная внутреннего state тоже меняется — из-за этого внешняя и внутренняя exit-анимации запускаются одновременно на одном элементе, получается длинная неестественная анимация. Фикс — схлопнуть в один `AnimatePresence` с составным ключом (`${currentIndex}-${state}`) вместо вложенности (см. `src/features/role-distribution/components/DistributionFlow.tsx`).
- **`AnimatePresence exitBeforeEnter` + `MotiView` без явного `transition.type`**: Moti по умолчанию анимирует `withSpring` (mass=1, damping=10, stiffness=100 — сильно недодемпфированная, "звенящая" пружина), если у `MotiView` есть `transition`, но без поля `type`, ИЛИ `transition` вообще отсутствует. Если у такого `MotiView` есть `exit={{...}}` и он в дереве под `<AnimatePresence exitBeforeEnter>` (в т.ч. косвенно — `exit` на корневом `MotiView` внутри дочернего кастомного компонента-фазы, а не только у прямого JSX-child самого `AnimatePresence`), то `AnimatePresence` ждёт, пока exit-анимация численно пересечёт reanimated-пороги покоя, прежде чем смонтировать следующую фазу — визуально движение заканчивается за ~300мс, а реальное ожидание может занимать 1-3с → пустой экран между фазами игр. Фикс — на каждом таком `MotiView` явно ставить `transition={{ type: 'timing', duration: 200 }}` (или величина, консистентная с соседними `timing`-анимациями в файле). Баг был системным — обнаружен и исправлен почти во всех играх (`games/*/`) в одном заходе; при добавлении новой анимированной фазы под `exitBeforeEnter` — сразу проверять `transition.type` на MotiView с `exit`.

## Lint (ошибки, не предупреждения)

- `react-hooks/immutability`: функцию, которую вызывает `useEffect`, объявлять **до** эффекта (паттерн `initGame`/`initBoard` в играх).
- `react-hooks/set-state-in-effect`: не делать `setState` синхронно в эффекте ради производного значения — вместо `useState`+`useEffect` использовать `useMemo`.
- React 19: `React.FormEvent`/`FormEventHandler` deprecated — для submit-хендлеров типизировать `React.SyntheticEvent<HTMLFormElement>`.
- `Array(n).fill(x)` даёт `any[]` (no-unsafe-assignment) — писать `Array<T>(n).fill(x)`; вместо `[...Array(n)].map` — `Array.from({ length: n }).map`.
- `react/prop-types` не резолвит `React.InputHTMLAttributes` как тип пропсов — используемые в компоненте пропсы (напр. `className`) объявлять явно в локальном интерфейсе (см. `shared/components/TextInput.tsx`).

_Ревизия: 2026-08-11_