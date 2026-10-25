# Gotchas

> Сюда добавлять новые грабли по мере обнаружения (симптом → причина → решение). Устаревшие — удалять.

## Canvas / рисование

- Не писать raw-canvas: DPR-масштабирование, ресайз (`ResizeObserver`) и маппинг координат живут в хуке `shared/hooks/useCanvasSurface.ts` — на нём построены `DrawingCanvas` и канвас FakeArtist. Без этого рисунок мылится/смещается на мобильных.
- На элементах с жестами рисования/перетаскивания нужен `touch-action: none`, иначе браузер перехватывает скролл.
- История рисунка — **векторы** (массив штрихов в CSS-пикселях), undo/ресайз = перерисовка. Не снимать `getImageData` всего битмапа на каждый штрих (синхронное чтение с GPU, ~6 МБ на снимок при DPR 3). Текущий штрих держать в `ref` и дорисовывать сегментом в `pointermove` (+ `coalescedPoints` из `useCanvasSurface`), не в React-state: setState на каждое движение пальца перерендеривал всю игру. Экспорт рисунка в состояние — `exportCanvasImage` (WebP/JPEG ≤1080px; PNG при DPR 3 — сотни КБ в localStorage).
- События рисования — только **Pointer Events** (`onPointerDown/Move/Up/Cancel` + `setPointerCapture`), не пара `onMouse*` + `onTouch*`: после тапа браузер шлёт ещё и эмулированные mouse-события, штрих стартует дважды (двойной снимок в undo). Штрих из одной точки (случайный тап) не засчитывать как линию (FakeArtist: `MIN_STROKE_POINTS`).

## Производительность (лаги/фризы на телефонах — разобрано 2026-10-25)

- **`backdrop-filter` не использовать** (ни на карточках, ни на sticky-шапках, ни на оверлеях): пересчитывается на каждом кадре скролла и анимации предков. Вместо него — почти непрозрачный фон (`rgba(11,9,21,0.94)`, `bg-black/90`).
- Полноэкранные слои с `mix-blend-mode` (шум `body::after`) — заставляют перекомпоновывать всё под ними. Шум — плиткой без blend-mode.
- Не анимировать `filter: blur(...)`, `box-shadow`, `left/width` в циклах и при перетаскивании — перерисовка каждый кадр. Свечение = отдельный слой с готовой тенью, анимируется его `opacity` (см. `SwipeWordCard`, `LifelineButton` в Millionaire).
- Не анимировать `scale` у целого экрана фазы — перерастеризация всего текста (`PHASE_VARIANTS` без scale).
- **localStorage**: `storageService` кэширует распарсенные значения (`readJson`/`writeJson`) — новые ключи читать/писать через них, а не `JSON.parse(localStorage...)`. `sessionService` держит сессии в памяти и пишет пачкой через 400 мс + сразу на `pagehide`/скрытие вкладки — поэтому в тестах содержимое `party_app_session_*` появляется с задержкой.
- Фильтрация used-слов — через `Set`, не `includes` (пулы и used-списки на тысячи строк → O(n·m) на каждом свайпе).
- **Секунды таймера не класть в state корня игры** — каждый тик перерисовывал всю игру. `useTimer`/`useCountdown` (`shared/hooks/useTimer.ts`) возвращают стабильный объект-стор: корень и фазы передают *объект* таймера, секунды читает только отображение — `<TimerValue timer>{(t) => …}</TimerValue>`, `useTimeLeft(timer)`, `useTimerSelect(timer, t => t <= 10)` (перерисовка только при смене производного значения). Побочка на тиках (звук, автоотправка рисунка) — `timer.subscribe`. F5 — `usePersistedTimer(gameKey, field, timer, resumeRunning)`.
- Прогресс-полоски — `transform: scaleX` + `origin-left`, не `width` (см. `TimerBar`).
- **`React.memo`** стоит на «широких» компонентах, которые перерисовывал родитель: `GameHeader`, `GameMenuCard`, `PlayerRow`, `SwipeWordCard`. Работает только со стабильными пропсами: колбэки — `useCallback` (или ref + стабильная обёртка, см. `handleSwipe` в Alias PlayingPhase), в список — один обработчик с id (`onSelect(id)`), а не замыкание на элемент. `GamePlayRoute` отдаёт игре стабильные `onBack`/`playerNames`. Форма для линтера: `React.memo(function X({...}: XProps) {…})` — с дженериком `React.memo<XProps>` правило `react/prop-types` не видит типы.
- `GameSettingsContext`: value в `useMemo`, сеттеры стабильные (последний конфиг в ref). Новые поля настроек — через общий `update(patch)`, иначе сломается стабильность и персист.
- Тяжёлое в рендере (счётчики пулов) — не считать на каждый рендер: Setup перерисовывается на каждую букву имени. Счётчики — хук `useWordStats` (`features/word-stats`), словари грузятся `import()` после отрисовки экрана; статически импортировать контент игр вне `games/` нельзя — он попадает в стартовый бандл.

## Анимации (motion, веб)

- **Свой `animate={{...}}` у элемента отключает наследование вариантов от родителя.** Если на элементе одновременно `variants={STAGGER_ITEM}` и `animate={{ borderColor }}`, он унаследует `initial` (opacity 0), но не `animate` — и останется невидимым. Каскад и собственную анимацию разносить на два вложенных `motion.div` (см. `TwoTruthsGame/phases/WritingPhase.tsx`).
- Spring поддерживает только 2 кейфрейма: для `x: SHAKE_X` вместе с пружинным `scale` задавать раздельные transition — `transition={{ scale: SPRING.pop, x: { duration: 0.45 } }}`.
- На элементах, которыми управляет motion (`whileTap`, `drag`, layout, `animate` с x/scale), не ставить `transition-all` — CSS-transition сглаживает покадровые transform и даёт лаг; оставлять `transition-colors` (или явный список `transition-[color,background-color,...]`). На кнопках с большими цветными тенями (`PrimaryButton`) `transition-all` ещё и анимирует тень при `active:scale`.
- Не ставить `scroll-behavior: smooth` на `html`: ScrollRestoration при смене экрана превращается в анимированную прокрутку поверх анимации входа.
- 3D-флип (`FlipCard`): внутри граней не использовать `backdrop-filter` — ломает `preserve-3d` (у `.glass-card` его больше нет, она безопасна).
- `layout`-анимация корректирует border-radius только из `style`, не из класса: у карточек с `layout` дублировать радиус в `style={{ borderRadius }}`.
- В фоновой вкладке rAF троттлится — проверки анимаций через JS видят результат с запозданием (drag/exit «не сработали», а на деле сработали позже).

## Prettier

- Не запускать `prettier --write` по `src` или папке игры целиком (и `npm run lint:fix`): часть файлов (`CrocodileGame/constants.ts` с 4 пробелами, большие `content.ts`) не отформатирована, и дифф заливается чужими правками. Форматировать только изменённые файлы.

## Layout на мобильных

- Скроллируемая область внутри flex-колонки: ребёнку нужны `flex-1 min-h-0`, иначе он растягивает родителя вместо скролла.
- Высота экрана — `h-dvh`/`min-h-dvh`, не `h-screen` (`100vh` длиннее видимой области в мобильных браузерах: нижние кнопки уходят под панель адреса).
- Нижние `fixed`-панели: отступ `pb-[calc(1.5rem+env(safe-area-inset-bottom))]` — `.safe-bottom` корня их не затрагивает.
- Цели нажатия ≥ ~44 px (`h-11`); для мелких иконок расширять зону (`-m-3 p-3` или `before:` с отрицательным inset), не меняя вид.
- Утилиты Tailwind одного свойства конфликтуют по порядку в CSS, а не в `className`: у `GameCard` зашит `p-7`, своё `p-3` его не перебьёт — писать `p-3!`.

## Длинные слова и имена (самая частая проблема на узких экранах)

- Имена игроков, слова игр, названия команд — **пользовательский контент любой длины**: проверять экран с `Достопримечательность` / `Wolfeschlegelsteinhausen` на 360 px.
- `wrap-break-word` **не спасает**: в flex-колонке с `items-center` блок растёт до длины слова (min-content) и режется с двух сторон. Крупный текст (≥ `text-3xl`) с динамическим содержимым — через `shared/components/FitText.tsx` (подгоняет `font-size` по ширине; `Typography.Display` и строковые `Title`/`Heading` уже на нём).
- Текст в flex-строке рядом с иконками/кнопками/инпутами: `min-w-0` у текста + `wrap-anywhere`, `shrink-0` у соседей. Без `min-w-0` длинное имя выталкивает кнопки за экран.
- `truncate` — только для второстепенных строк; для имён игроков в узких плитках и для игровых значений (черты Бункера и т.п.) — перенос (`wrap-anywhere leading-tight`) или `FitText`. Не подбирать размер по `word.length` — ширина зависит от букв, не от их числа.
- Список найденных и исправленных проблем с рекомендациями для RN: `docs/web-ux-fixes.md`.

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
- `react-hooks/exhaustive-deps` (предупреждение): сеттеры из `usePersistedState` и `useGameSettings()` стабильны, объект таймера из `useTimer` тоже → смело добавлять в deps.
- `react-hooks/refs`: не передавать ref в функцию внутри рендера (в т.ч. в ленивый инициализатор `useState`) — линтер считает это чтением. Свежие колбэки в долгоживущий объект — через его сеттер в `useLayoutEffect` (см. `setOptions` в `useTimer.ts`).
- `no-unnecessary-condition` (предупреждение) врёт на `record[key] ?? fallback` и `arr[i]?.x`: `noUncheckedIndexedAccess` выключен, TS считает доступ по индексу всегда успешным. **Не удалять** такие проверки — данные часто из localStorage/битых настроек. Честный фикс — `Partial<Record<…>>` (см. `GameDictionary` в `storageService.ts`). Флаг, выставляемый внутри `forEach`-колбэка, TS тоже не видит → `for…of`.
- `react/jsx-no-leaked-render` выключено в `eslint.config.js` (не видит типов, конфликтовало с `no-unnecessary-type-conversion`, которое запрещает `!!` на boolean). Писать `{flag && …}` без `!!`; число слева от `&&` (рендерит `0`) — ловить на ревью, использовать `n > 0 &&`.

_Ревизия: 2026-10-25_