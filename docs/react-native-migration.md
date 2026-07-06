# План переноса Party Games на React Native

> Статус: план утверждён, работа не начата.
> Решения зафиксированы с владельцем проекта: **Expo** (managed workflow), **отдельный RN-проект** (веб-версия не является источником общего кода, код копируется и адаптируется), платформы **iOS + Android**, стилизация — **NativeWind**.

---

## 1. Что переносим

Текущее приложение: SPA/PWA, 18 pass-the-phone игр, ~40 000 строк TS/TSX, всё состояние в localStorage, бэкенда нет. Это идеальный кандидат на RN: нет сети, нет серверной части, нет платформозависимых фич кроме вибрации/звука/canvas.

## 2. Целевой стек и соответствия

| Сейчас (web) | Станет (RN) | Комментарий |
|---|---|---|
| Vite 6 + PWA | **Expo SDK 53+** (RN 0.79+, New Architecture) | `npx create-expo-app` |
| react-router 7 (data router) | **expo-router** (file-based) | Маршруты 1:1: `/`, `/settings`, `/game/[gameKey]/setup`, `/game/[gameKey]/play` |
| Tailwind CSS 4 (`@theme` в CSS) | **NativeWind v4** + tailwind.config.js | ⚠️ NativeWind работает на конфиге Tailwind 3 — токены из `src/app/styles/index.css` переносятся в `tailwind.config.js` вручную |
| motion v12 (`motion/react`) | **react-native-reanimated** + **moti** | Moti даёт близкий к motion API (`AnimatePresence`, `from/animate/exit`) поверх Reanimated |
| lucide-react | **lucide-react-native** | Тот же набор иконок, требует `react-native-svg` |
| canvas-confetti | **react-native-confetti-cannon** (или свой на Reanimated) | |
| localStorage + storageService | **react-native-mmkv** | ⚠️ Ключевое решение: MMKV **синхронный**, как localStorage — `storageService`, `sessionService` и `usePersistedState` переносятся без перевода на async. AsyncStorage не подходит: сломал бы синхронные чтения при инициализации state |
| `<canvas>` / DrawingCanvas | **@shopify/react-native-skia** | Рисование пальцем: Skia `Path` + `react-native-gesture-handler`. DPR/ResizeObserver-грабли из веба исчезают — Skia сам работает в физических пикселях |
| `navigator.vibrate` (feedbackService) | **expo-haptics** | Паттерны `VIBRATE` маппятся на `impactAsync`/`notificationAsync` |
| Web Audio API (feedbackService) | **expo-audio** | Синтез тонов заменить на короткие бандленные сэмплы (проще и надёжнее) |
| `backdrop-filter` (.glass-card) | **expo-blur** (`BlurView`) | ⚠️ На Android дорого; для слабых устройств fallback — полупрозрачный фон без blur |
| CSS-градиенты | **expo-linear-gradient** | |
| safe-top/safe-bottom (CSS env) | **react-native-safe-area-context** | Входит в Expo |
| Модалки (InstructionsModal) | RN `Modal` / expo-router modal-роуты | |

Стор-зависимости (dev): EAS Build (облачная сборка iOS без Mac), eslint + prettier + typescript — конфиги переносятся почти как есть (typescript-eslint, запрет enum и т.д.).

## 3. Что переносится почти без изменений (~50–60% кода)

Вся «логика без DOM» копируется с минимальными правками импортов:

- `shared/types`, `entities/game/types.ts`, `GameKey`, все const-объекты и фазы
- `entities/game/registry.tsx` — метаданные игр (иконки заменить на lucide-react-native), `instructions.ts`
- `shared/helpers/contentPool.ts` и весь контент игр (`content.ts` / `contents/`) — это самая большая часть кодовой базы
- `shared/i18n` — словари ru/en, интерполяция; контекст работает в RN как есть
- `shared/hooks` — `useTimer`, `useCountdown`, `usePlayerCycle`, `usePersistedState` (после переноса storage на MMKV)
- `shared/services` — `storageService` (заменить `localStorage.getItem/setItem` на MMKV, `safeParseJson` остаётся), `sessionService` без изменений
- `entities/game/model/GameSettingsContext.tsx` — контекст и персистенция конфигов
- Все `helpers.ts`, `constants.ts` внутри игр, логика раздачи ролей, балансировка (`debug/bunkerBalance`)

## 4. Что переписывается

- **Весь JSX-слой**: `div` → `View`, текст только внутри `Text`, `button` → `Pressable`, `input` → `TextInput`, скролл — явный `ScrollView`/`FlatList`. Классы NativeWind переносятся из существующей вёрстки процентов на 70, остальное — правки под RN-flexbox (по умолчанию `flex-direction: column`, нет `gap`-багов, нет `position: fixed`).
- **`shared/theme`**: `PREMIUM_RGB` остаётся источником цветов; `ThemeTokens` (наборы классов) переносится, но классы проверяются на совместимость с NativeWind. Двойной источник (`@theme` CSS ↔ colors.ts) схлопывается в один: `colors.ts` → генерирует `tailwind.config.js` (плюс от переезда).
- **DrawingCanvas** → компонент на Skia (жесты через Gesture Handler; аналог `touch-action: none` — `Gesture.Pan()` с блокировкой скролла).
- **feedbackService** → expo-haptics + expo-audio, сигнатуры функций сохранить, чтобы callsites в играх не менялись.
- **Анимации**: `motion/react` → moti. `AnimatePresence` с ключом фазы → `AnimatePresence` из moti (API совпадает концептуально). Stagger через `delay: index * N` работает так же.

## 5. Структура нового проекта

Отдельная папка/репозиторий `party-games-native`, FSD-структура сохраняется:

```
party-games-native/
  app/                      — expo-router: _layout.tsx, index.tsx, settings.tsx,
                              game/[gameKey]/setup.tsx, game/[gameKey]/play.tsx
  src/
    pages/                  — контент экранов (роуты в app/ — тонкие обёртки)
    widget/  features/  entities/  games/  shared/   — как в вебе
  assets/                   — иконки приложения, splash, звуки
  tailwind.config.js  app.json  eas.json
```

## 6. Этапы

### Этап −1 — подготовительный рефакторинг в веб-версии

Цель: сузить «платформенную поверхность» до shared-слоя, чтобы при копировании кода в RN менялись только сервисы/компоненты, а не игры. По убыванию ценности:

1. **Обернуть canvas-confetti в feedbackService.** Сейчас `import confetti from 'canvas-confetti'` в 13 файлах игр, опции (`particleCount/spread/origin/colors`) дублируются в каждом callsite. Сделать `feedbackService.celebrate(preset, colors?)` с 3–4 пресетами (win, roundWin, sideCannons как в Resistance) — тогда в RN конфетти меняется в одном файле, а не в тринадцати.
2. **FakeArtistGame перевести на shared DrawingCanvas.** `FakeArtistGame.tsx` держит собственную raw-canvas реализацию (свой DPR/ResizeObserver/drawAll, ~100 строк — дубль логики DrawingCanvas и нарушение правила из gotchas.md). После рефакторинга Skia-порт нужен ровно одному компоненту.
3. **Убрать raw `setInterval`-таймеры из игр.** FakeArtistGame и ResistanceGame крутят собственные интервалы вместо `useTimer`/`useCountdown`. Перевести на shared-хуки — при порте таймеры вообще не трогаются.
4. **Унифицировать пропсы игр.** Bunker (`onRestart`) и Telestrations (`initialDifficulty`) рендерятся отдельными ветками в GamePlayRoute. Сделать оба пропса опциональной частью общего `GameProps` и убрать исключения — RN-роут `play` станет тривиальным маппингом.
5. **Схлопнуть двойной источник цветов.** Генерировать значения `@theme` из `PREMIUM_RGB` (`colors.ts` — единственный источник) ещё в вебе; в RN тогда копируется один файл, и tailwind.config.js генерируется из него же.

Мелочь: scroll-lock через `document.body.style.overflow` встречается не только в InstructionsModal, но и inline в `FakeArtistVoting.tsx` — заменить на переиспользуемый хук/модалку, чтобы прямых обращений к `document` вне shared не осталось.

**Не рефакторить ради переноса:** JSX-вёрстку и Tailwind-классы (переписываются при порте в любом случае), `motion/react` (moti маппится 1:1), роутинг (expo-router всё равно другой), i18n-выжимку оставшихся захардкоженных строк (покрытие уже 83/90 файлов — добирать попутно).

### Этап 0 — Bootstrap (фундамент)
- `create-expo-app` (TypeScript template), expo-router, NativeWind v4, Reanimated, Gesture Handler, safe-area-context, MMKV, lucide-react-native + react-native-svg
- eslint/prettier/tsconfig перенести из веб-проекта (paths-алиасы `@/...`)
- Прогнать пустое приложение на реальном Android-устройстве и iOS (Expo Go / dev build; MMKV и Skia требуют **dev build**, не Expo Go — сразу настроить `expo-dev-client` + EAS)

**Готово, когда:** dev build ставится на оба телефона, hot reload работает, NativeWind красит тестовый экран.

### Этап 1 — Ядро shared (без UI)
- Скопировать: types, contentPool, i18n, hooks, sessionService, GameSettingsContext, helpers
- storageService: адаптер на MMKV, API не менять
- tailwind.config.js: перенести токены тем из `src/app/styles/index.css` + `PREMIUM_RGB`
- feedbackService: expo-haptics/expo-audio с прежними сигнатурами

**Готово, когда:** `tsc --noEmit` чистый, юнит-логика (contentPool, helpers) работает в тестовом экране.

### Этап 2 — UI-кит
Перенести `shared/components` на RN-примитивы (порядок — по частоте использования): Typography, PageWrapper, PrimaryButton, IconButton, TabButton, GameHeader, PlayingHeader, TimerBar, Badge, SectionLabel, ProgressDots, Pagination, TextInput, GameCard, PassPhoneCard, StopGameButton, InstructionsModal. `glass-card` → компонент `GlassCard` на BlurView (+ fallback без blur). Плюс `entities/player/components`.

**Готово, когда:** экран-витрина (storybook-подобный debug-роут) показывает все компоненты во всех 12 темах.

### Этап 3 — Каркас приложения
- Меню (сетка GameCard из реестра), `/settings` (язык, кастомные слова)
- Setup-экран: инструкции + игроки + `UniversalGameSettings` из декларативных настроек реестра
- Play-роут: аналог `GAME_COMPONENTS` (lazy через `React.lazy` или динамический маппинг), передача игроков (в RN вместо navigation state — параметры роута + `storageService.getPlayers()` fallback, redirect при нехватке игроков), `sessionService.syncPlayers`

**Готово, когда:** полный цикл меню → setup → «заглушка игры» → выход работает, players/config персистятся.

### Этап 4 — Пилотные игры (обкатка паттернов)
2–3 простые текстовые игры с таймером: **Taboo, Alias, TruthOrDare**. На них фиксируются паттерны переноса: фазы + AnimatePresence, таймеры, PassPhoneCard, usePersistedState, конфетти/хаптика. Результат — короткий «рецепт переноса игры» в README проекта.

### Этап 5 — Массовый перенос текстовых/ролевых игр
Партиями по 2–3, от простых к сложным:
1. TabooReverse, JustOne, SpyHunt
2. Mafia, Resistance, Bunker (ролевые, много фаз)
3. Millionaire, MemoRisk, TruthOrDare-подобные остатки
4. Codenames, Decrypto (сетки/доски — FlatList/Grid)
5. ConnectFour, Corridor, Wavelength (интерактивные доски: жесты, возможно Skia/SVG — оценить по коду при переносе)

После каждой партии — прогон на обоих устройствах.

### Этап 6 — Игры с рисованием
- `DrawingCanvas` на Skia (Path, undo, цвет/толщина — сохранить API пропсов веб-версии)
- **Telestrations** (с учётом его особого пропса `initialDifficulty`), **FakeArtist** (включая голосование)

### Этап 7 — Полировка
- Анимации переходов между фазами/экранами до уровня веба, stagger-списки
- StatusBar/NavigationBar, keep-awake во время партии (`expo-keep-awake` — в вебе этого не было, а для pass-the-phone критично)
- Иконка, splash screen, название, тёмная тема системных элементов
- Производительность: профилирование blur/анимаций на слабом Android

### Этап 8 — Сборка и публикация
- EAS Build: eas.json (dev/preview/production), подписи
- Android: Google Play (internal testing → production) или прямой APK
- iOS: Apple Developer аккаунт, TestFlight → App Store
- Стор-ассеты: скриншоты, описания ru/en, privacy policy (данные не покидают устройство — декларации простые)

## 7. Риски и известные грабли

| Риск | Митигация |
|---|---|
| NativeWind ≠ Tailwind 4: часть утилит из веба не поддержана (сложные селекторы, `backdrop-filter`, произвольный CSS) | Этап 2 выявляет всё на UI-ките; несовместимое — в inline-стили/компоненты |
| MMKV и Skia не работают в Expo Go | С этапа 0 работать только через dev build (`expo-dev-client`) |
| `usePersistedState` с codec для Set/Map | Логика не меняется — сериализация остаётся JSON-строками в MMKV |
| Вложенный blur тормозит и в RN (та же граблина, что в вебе) | Один слой BlurView, правило зафиксировать в gotchas нового проекта |
| RN flexbox: `flex-1 min-h-0` паттерн из веба не нужен, но скролл внутри flex-колонки требует явного `ScrollView` с `flex-1` | Зафиксировать в «рецепте переноса» на этапе 4 |
| Жесты рисования конфликтуют со скроллом | `Gesture.Pan` + `simultaneousHandlers`/блокировка скролла экрана во время рисования |
| iOS-сборка без Mac | EAS Build в облаке; локальный Mac не требуется |
| Дрейф контента: словари/контент будут обновляться в двух репо | Пока веб жив — правило: контент-правки дублировать; при желании позже вынести контент в общий npm-пакет |

## 8. Порядок работ и вехи

Этапы 0–3 строго последовательны (каждый — фундамент следующего). Этапы 4–6 — конвейер по играм. Этап 7 частично параллелен 5–6.

Вехи:
1. **M1 «Каркас»** — конец этапа 3: приложение с меню и настройками, без игр
2. **M2 «Играбельно»** — конец этапа 4: 3 игры проходятся целиком на устройстве
3. **M3 «Паритет»** — конец этапа 6: все 18 игр
4. **M4 «В сторах»** — конец этапа 8

## 9. Соглашения, которые переезжают как есть

- const-объекты вместо enum (везде, включая фазы)
- Комментарии в коде — на русском
- Пулы контента только через хелперы contentPool
- Настройки per-game через GameSettingsContext, персистенция автоматическая
- FSD-структура, чек-лист добавления новой игры (адаптировать пути под expo-router)
- В новом проекте завести свой memory bank `.claude/memory/` по образцу текущего