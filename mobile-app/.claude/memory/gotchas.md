# Gotchas

> Сюда добавлять новые грабли по мере обнаружения (симптом → причина → решение). Устаревшие — удалять.

## Android-специфика

- **3D-флип (`rotateY`) на Android**: без явного `perspective` в трансформе анимация не даёт настоящего 3D-эффекта и `backfaceVisibility: 'hidden'` работает некорректно — карточка «флипается», но обратная грань не проявляется. На iOS перспектива подставляется по умолчанию, поэтому баг воспроизводится только на реальном Android-устройстве. Для `MotiView` перспективу передавать через `animate={{ rotateY, perspective: 1000 }}`, а не через отдельный `style={{ transform: [...] }}` — Moti кладёт анимируемый `transform` последним в массив стилей и полностью перезаписывает ключ `transform` из переданного `style` (см. `src/games/MemoRiskGame/components/MemoCardView.tsx`).
- **`TextInput` обрезает текст по горизонтали на Android**: нативный `EditText` добавляет свой внутренний padding поверх Tailwind `px-*`, сжимая видимую область текста внутри фиксированной высоты. Фикс — на Android явно `padding: 0` + `textAlignVertical: 'center'` в `style` (см. `src/shared/components/TextInput.tsx`).

## AnimatePresence / MotiView

- **Вложенные `AnimatePresence` (Moti) + синхронная смена двух state-переменных**: если один хендлер одновременно меняет state, от которого зависит внешний `AnimatePresence` (напр. `currentIndex`), и state, от которого зависит вложенный внутри него `AnimatePresence` (напр. `isRevealed`), то у ещё не размонтированного (анимирующегося на выход) элемента переменная внутреннего state тоже меняется — из-за этого внешняя и внутренняя exit-анимации запускаются одновременно на одном элементе, получается длинная неестественная анимация. Фикс — схлопнуть в один `AnimatePresence` с составным ключом (`${currentIndex}-${state}`) вместо вложенности (см. `src/features/role-distribution/components/DistributionFlow.tsx`).
- **`AnimatePresence exitBeforeEnter` + `MotiView` без явного `transition.type`**: Moti по умолчанию анимирует `withSpring` (mass=1, damping=10, stiffness=100 — сильно недодемпфированная, "звенящая" пружина), если у `MotiView` есть `transition`, но без поля `type`, ИЛИ `transition` вообще отсутствует. Если у такого `MotiView` есть `exit={{...}}` и он в дереве под `<AnimatePresence exitBeforeEnter>` (в т.ч. косвенно — `exit` на корневом `MotiView` внутри дочернего кастомного компонента-фазы, а не только у прямого JSX-child самого `AnimatePresence`), то `AnimatePresence` ждёт, пока exit-анимация численно пересечёт reanimated-пороги покоя, прежде чем смонтировать следующую фазу — визуально движение заканчивается за ~300мс, а реальное ожидание может занимать 1-3с → пустой экран между фазами игр. Фикс — на каждом таком `MotiView` явно ставить `transition={{ type: 'timing', duration: 200 }}` (или величина, консистентная с соседними `timing`-анимациями в файле). Баг был системным — исправлен почти во всех играх (`games/*/`) в одном заходе; при добавлении новой анимированной фазы под `exitBeforeEnter` — сразу проверять `transition.type` на MotiView с `exit`.

## Незавершённая реализация

- **`feedbackService.celebrate`/`fireworks`/`playSound` — пустые заглушки** (`src/shared/services/feedbackService.ts`), помечены `TODO(этап 2/7)` (конфетти) и `TODO(этап 7)` (звук, план — короткие сэмплы через `expo-audio`, уже в зависимостях, но не подключён). Callsites во всех играх (`feedbackService.celebrate(...)`/`playSound(...)`) вызываются как обычно и молча ничего не делают — визуальный/звуковой фидбек победы/ошибки сейчас отсутствует в приложении. Единственный реально реализованный эффект — `vibrate` (`expo-haptics`). При работе с любой игрой не полагаться на то, что celebrate/playSound дают видимый эффект на устройстве — только на вибрацию.

## Контент-хелперы игр остаются синхронными (не переводить в async)

В 10 файлах `games/*/model/*Content.ts` (Alias, Codenames, Decrypto, FakeArtist, JustOne, Millionaire,
SpyHunt, Telestrations, TruthOrDare, Wavelength) раньше стоял одинаковый TODO «перевести на async
storageService.*Async» — удалён при аудите 2026-08-16 как неактуальный: он противоречит зафиксированному
архитектурному решению (`../docs/react-native-migration.md`, таблица замен) — MMKV синхронный, как
localStorage, и `storageService`/`sessionService`/`usePersistedState` **намеренно** не переводятся на
async, чтобы не сломать синхронные чтения при инициализации state. `storageService.*Async`-обёртки
(`shared/services/storageService.ts`) существуют и используются в 3 местах (`GameSettingsContext.tsx`,
`app/game/[gameKey]/setup.tsx`, `shared/i18n/index.ts`) — это осознанный локальный паттерн там, где вызов
асинхронный по другой причине (напр. `void`-fire-and-forget после роутинга), а не общее направление
переноса. Хелперы получения слов/вопросов контента остаются синхронными — не заводить новый TODO на этот
счёт без нового архитектурного решения. Исключение: `getDecryptoWords` (`DecryptoGame/model/decryptoContent.ts`)
вызывается дважды за инициализацию раунда — важен порядок запись/чтение, это тоже причина оставаться
синхронной, а не сигнал к переводу на async.

## Expo Go / нативные модули

- **MMKV и `@shopify/react-native-skia` не работают в Expo Go** — только dev build (`npx expo run:android`/EAS). Смоук-тест новой игры/фичи обязательно на dev build, не в Expo Go — иначе персистенция и рисование молча не работают.
- После установки/обновления `@shopify/react-native-skia` требуется нативная пересборка dev build.

## Lint (ошибки, не предупреждения)

- `react-hooks/immutability`: функцию, которую вызывает `useEffect`, объявлять **до** эффекта (паттерн `initGame`/`initBoard` в играх).
- `react-hooks/set-state-in-effect`: не делать `setState` синхронно в эффекте ради производного значения — вместо `useState`+`useEffect` использовать `useMemo`.
- React 19: `React.FormEvent`/`FormEventHandler` deprecated — для submit-хендлеров типизировать `React.SyntheticEvent<HTMLFormElement>`.
- `Array(n).fill(x)` даёт `any[]` (no-unsafe-assignment) — писать `Array<T>(n).fill(x)`; вместо `[...Array(n)].map` — `Array.from({ length: n }).map`.
- `react/prop-types` не резолвит `React.InputHTMLAttributes` как тип пропсов — используемые в компоненте пропсы (напр. `className`) объявлять явно в локальном интерфейсе (см. `shared/components/TextInput.tsx`).
- `runOnJS` из `react-native-reanimated` — deprecated (`@typescript-eslint/no-deprecated`), использовать `scheduleOnRN` из `react-native-worklets` (уже в зависимостях) вместо него в новых Gesture-хендлерах. Мигрировано везде (2026-08-16): `DrawingCanvas.tsx`, `WavelengthGame/phases/GuessingPhase.tsx`, `FakeArtistGame.tsx` (своя копия drawing-логики, отдельная от `DrawingCanvas.tsx`).
- `react-hooks/refs`: мутировать `ref.current` можно только в эффекте/хендлере, не в теле рендера компонента (даже для «синхронизации» ref со свежим значением стейта на каждый рендер — это тоже эффект, не рендер-логика).
- `react/prop-types` + `React.memo`: паттерн `const X: React.FC<Props> = React.memo((props) => ...)` **не распознаётся** — плагин не резолвит пропсы через обёртку `memo`, даже если `Props` — именованный интерфейс (не только инлайн-тип, как считалось раньше). Даёт `react/prop-types` на каждое поле + `react/display-name`. Рабочий фикс — именованная функция с инлайн-типом параметра: `React.memo(function X({ a, b }: XProps) { ... })` (displayName берётся из имени функции автоматически). Системная проблема — тот же паттерн со старым `React.FC<{...}> = React.memo((props) => ...)` есть ещё в `games/BunkerGame/phases/DiscussionPhase.tsx`, `games/SpyHuntGame/phases/PlayingPhase.tsx`, `games/TabooGame/phases/PlayingPhase.tsx`, `games/AliasGame/phases/PlayingPhase.tsx` — не исправлено, чинить тем же способом при следующей правке этих файлов.

_Ревизия: 2026-08-16_
