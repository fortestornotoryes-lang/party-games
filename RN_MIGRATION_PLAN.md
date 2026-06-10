# React Native Migration Plan — Party Hub

---

## 1. FSD Layer Map

The project does not use FSD directory names (`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`). Below is the actual source mapped to the closest FSD concept.

### `app` (currently `src/` root + `src/registry/`)

| Slice / File | What it does |
|---|---|
| `App.tsx` | Root state machine + phase router (switch on GameStatus) |
| `main.tsx` | React entry point, renders `<App>` |
| `index.css` | Tailwind v4 global tokens, `glass-card`, `safe-*`, CSS custom properties |
| `registry/GameRegistry.tsx` | `GAMES_REGISTRY` object + all 17 lazy-loaded game exports |
| `vite-env.d.ts` | Vite build-tool ambient types |

---

### `shared/model` (currently `src/types.ts` + `src/types/games.ts`)

| Slice / File | What it does |
|---|---|
| `types.ts` | `Player`, `GameStatus` enum, `Difficulty`, `GameMode`, `GameTheme`, `GameModeOption` |
| `types/games.ts` | `GameKey` enum, `GameMetadata`, `GameMode` (interface), `InstructionItem`, `GamesRegistryMap` |

---

### `shared/config` (currently `src/theme/`)

| Slice / File | What it does |
|---|---|
| `theme/colors.ts` | `PREMIUM_RGB`, `THEME_TOKENS`, `getTheme()`, `ROLE_TOKENS` — single source of truth for all color computations |

---

### `shared/lib` (currently `src/hooks/`, `src/utils/`, `src/i18n/`)

| Slice / File | What it does |
|---|---|
| `hooks/useTimer.ts` | Countdown timer with `onTimeUp` callback, start/pause/reset |
| `hooks/usePlayerCycle.ts` | Cyclic player iteration `{ current, idx, isLast, next, reset }` |
| `hooks/useCountdown.ts` | Lighter timeout-based countdown (used only by Telestrations) |
| `utils/random.ts` | `shuffle<T>()` (Fisher-Yates), `pickRandom<T>()`, `randomInt()` |
| `utils/gameLogic.ts` | `initSpyHunt()`, `initFakeArtist()`, `initResistance()` — role assignment |
| `i18n/index.ts` | `LanguageProvider`, `useLanguage()`, `useTranslation()` |
| `i18n/keys.ts` | Namespace constants (`NS.ALIAS`, etc.) |
| `i18n/en.ts`, `i18n/ru.ts` | Translation dictionaries |
| `i18n/types.ts` | `Lang`, `Translations` interfaces |

---

### `shared/api` (currently `src/services/`)

| Slice / File | What it does |
|---|---|
| `services/storageService.ts` | CRUD over `localStorage`: players, used/custom words, settings, per-game configs |
| `services/feedbackService.ts` | Web Audio API sounds + `navigator.vibrate` + `VIBRATE` constants |
| `services/contentService.ts` | Word/content selection for all 12 word-based games, used-word deduplication |

---

### `shared/ui` (currently `src/components/` — flat, mixed)

| Component | What it does |
|---|---|
| `Typography.tsx` | 7-variant text system: Display, Title, Heading, Body, Label, Caption, Score |
| `PrimaryButton.tsx` | Full-width CTA button, 6 color variants + feedback |
| `GameHeader.tsx` | Sticky in-game header with blur, icon, back button |
| `PassPhoneCard.tsx` | "Pass the phone" animated card with cyberpunk glitch layers |
| `DrawingCanvas.tsx` | HTML5 canvas drawing board (DPR, ResizeObserver, undo, color picker) |
| `DistributionFlow.tsx` | Abstract role-distribution flow (ProgressDots + lock→reveal) |
| `TimerBar.tsx` | Thin horizontal timer progress bar |
| `ProgressDots.tsx` | Step indicator dots with motion animation |
| `PlayingHeader.tsx` | "Player explains" + countdown display |
| `TabooPassPhase.tsx` | Pass phase wrapper for Taboo/TabooReverse games |
| `LeaderboardList.tsx` | Ranked game-over results list |
| `PlayerScoreList.tsx` | Auto-sorted player scores during pass phase |
| `StopGameButton.tsx` | "Stop game" button |
| `InstructionsModal.tsx` | Rules modal with theme colors |
| `Badge.tsx` | Colored pill/tag component |
| `IconButton.tsx` | Icon-only pressable button |
| `PageWrapper.tsx` | Padded scrollable page container |
| `Pagination.tsx` | Page navigation controls |
| `PlayerRow.tsx` | `Reorder.Item`-wrapped player name input row |
| `SectionLabel.tsx` | Small uppercase section header |
| `TabButton.tsx` | Segmented control tab |
| `TextInput.tsx` | Styled HTML text input |
| `GameCard.tsx` | Generic card container |
| `GameMenuCard.tsx` | Game selection row card with icon + theme stripe |

---

### `features` (currently `src/contexts/` + part of `src/components/`)

| Slice / File | What it does |
|---|---|
| `contexts/GameSettingsContext.tsx` | difficulty, mode, rounds, timerSeconds, countHiddenTraits — persisted per game to storage |
| `components/UniversalGameSettings.tsx` | Setting row UI for difficulty/mode/rounds/timer, reads from contentService for display labels |

---

### `widgets` (currently mixed into `src/components/`)

| Slice / File | What it does |
|---|---|
| `components/MainMenu.tsx` | Full home screen: game list, word-count badges, description bottom sheet, Bunker debug button |
| `components/Setup.tsx` | Player name entry, drag reorder, instructions modal, children slot for game settings |
| `components/Settings.tsx` | App settings (sound/vibration/language) + custom word CRUD per game + pagination + search |

---

### `games` (currently `src/games/`)

17 game feature slices. Each contains a root component, phases or sub-components, `types.ts` with phase enum, and sometimes helpers/constants.

| Game | Root | Phases/Sub-components |
|---|---|---|
| AliasGame | `AliasGame.tsx` | `phases/` Start, Playing, RoundEnd, GameOver |
| BunkerGame | `BunkerGame.tsx` | `phases/` Briefing, DictatorReveal, Discussion, FullReveal, Reveal, Survival, Tribunal, Voting; `components/` ResourceContribRow; `contents/` 8 content files; `constants.ts`, `helpers.ts` |
| CodenamesGame | `CodenamesGame.tsx` | `phases/` Captain, GameOver, Setup, Team |
| ConnectFourGame | `ConnectFourGame.tsx` | (single file, no segmentation) |
| CorridorGame | `CorridorGame.tsx` | `types.ts` only (single file, SVG board) |
| DecryptoGame | `DecryptoGame.tsx` | `components/` CaptainClues, CodeInput, EnemyIntercept, PassScreen, ScoreRow, TeamGuess, WordGrid; `helpers.ts` |
| FakeArtistGame | `FakeArtistGame.tsx` | `components/` FakeArtistDistribution, FakeArtistVoting |
| JustOneGame | `JustOneGame.tsx` | `phases/` Guessing, Hinting, Pass, Result |
| MafiaGame | `MafiaGame.tsx` | (single file, no segmentation) |
| MillionaireGame | `MillionaireGame.tsx` | `phases/` Between, GameOver, Pass, Question, Win |
| ResistanceGame | `ResistanceGame.tsx` | `components/` ResistanceDistribution, ResistanceResult |
| SpyHuntGame | `SpyHuntGame.tsx` | `components/` RoleDistribution; `phases/` Playing, Reveal |
| TabooGame | `TabooGame.tsx` | `phases/` GameOver, Pass, Playing, Verdict |
| TabooReverseGame | `TabooReverseGame.tsx` | `phases/` BlitzVerdict, GameOver, Pass, Playing, Verdict |
| TelestrationsGame | `TelestrationsGame.tsx` | `components/` Gallery, Guess, Setup, Start |
| TruthOrDareGame | `TruthOrDareGame.tsx` | `phases/` Action, Choice, Pass |
| WavelengthGame | `WavelengthGame.tsx` | `phases/` Clue, Guessing, Pass, Reveal |

---

### `content` (currently `src/constants/`)

15 pure-data modules: `aliasContent`, `codenamesContent`, `connectFourContent`, `decryptoContent`, `fakeArtistContent`, `instructions`, `justOneContent`, `millionaireContent`, `resistanceContent`, `spyHuntContent`, `tabooContent`, `tabooReverseContent`, `telestrationsContent`, `truthOrDareContent`, `wavelengthContent`

---

### `debug` (non-FSD, `src/debug/`)

| File | What it does |
|---|---|
| `debug/bunkerBalance.ts` | Monte Carlo simulation for Bunker game balance |
| `debug/BunkerBalanceView.tsx` | Debug overlay UI wired into MainMenu |

---

## 2. FSD Violations Report

| File | Violation type | Current | Should be |
|---|---|---|---|
| `src/components/MainMenu.tsx` | Wrong layer placement | `shared/ui` (components/) | `widgets/main-menu/` |
| `src/components/Setup.tsx` | Wrong layer placement | `shared/ui` (components/) | `widgets/setup/` |
| `src/components/Settings.tsx` | Wrong layer placement + God component | `shared/ui` (components/) | `widgets/settings/` — split into GeneralSettings + WordsSettings |
| `src/components/UniversalGameSettings.tsx` | Wrong layer placement | `shared/ui` (components/) | `features/game-settings/ui/` |
| `src/components/TabooPassPhase.tsx` | Wrong layer placement (game-specific in shared) | `shared/ui` (components/) | `games/taboo/ui/` or `games/taboo-reverse/ui/` |
| `src/registry/GameRegistry.tsx` | Wrong layer placement | `registry/` (non-standard) | `app/registry/` |
| `src/debug/BunkerBalanceView.tsx` | Wrong layer placement (non-FSD layer) | `debug/` | `app/debug/` or dev-only feature |
| `src/debug/bunkerBalance.ts` | Wrong layer placement | `debug/` | `app/debug/` |
| `src/components/MainMenu.tsx` → `src/debug/BunkerBalanceView.tsx` | Upward import | `components/` (shared-like) imports from `debug/` | MainMenu should not know about debug tooling |
| `src/services/contentService.ts` | God component (service level) | Single service knowing all 12 games' content logic inline | Split: each game slice owns its content-query hook (`useAliasWords`, `useSpyHuntLocation`, etc.) |
| `src/games/ConnectFourGame/ConnectFourGame.tsx` | God component + Missing segmentation | All board logic, win detection, Pop Out mechanics, animation in single 350+ line file | Split into phases + model (board logic) + ui segments |
| `src/games/CorridorGame/CorridorGame.tsx` | God component + Missing segmentation | SVG board rendering, BFS pathfinding, wall logic, all phases in one file | Split: `model/` (BFS + wall logic), `ui/` (SVG board), phases |
| `src/games/MafiaGame/MafiaGame.tsx` | Missing segmentation | Single file, no phases/ folder | Add `phases/` subfolder matching other games' pattern |
| `src/components/` | Missing segmentation | Flat folder, mixes atoms with widgets | Split into `shared/ui/` (atoms), `shared/ui/compound/`, `widgets/` |
| `src/types.ts` | Incorrect segment usage | `GameState` interface defined but no longer used in App.tsx (dead code); `GameMode` type defined here AND as interface in `types/games.ts` — two conflicting definitions | Remove `GameState`; consolidate `GameMode` to one definition |
| `src/games/BunkerGame/contents/` | Cross-architecture inconsistency | BunkerGame stores content inside its game folder | All other games store content in `src/constants/`; BunkerGame should too |

**Severity: Minor issues.** The architecture has well-understood layer concepts and clean separation of concerns. Violations are structural naming issues rather than functional breakage. The most impactful violations are `contentService` as a god service and the three widgets incorrectly placed in `components/`.

**Recommendation: Fix in parallel with migration, not before.** Every component will be rewritten for React Native anyway. Cleaning source code first adds time with zero net benefit. Design the target FSD structure correctly from scratch and do not carry over the violations.

---

## 3. Migration Map

### `app` layer

| File | Classification | Notes |
|---|---|---|
| `src/App.tsx` | REWRITE | `switch(status)` → React Navigation v7 Stack; `Suspense` preserved; `window.scrollTo` → ScrollView ref |
| `src/main.tsx` | REWRITE | `ReactDOM.createRoot` → Expo entry point (`registerRootComponent`) |
| `src/index.css` | MANUAL | CSS custom properties → NativeWind theme config; `glass-card` class → StyleSheet helper; body gradients → ImageBackground; `safe-top/bottom` → `SafeAreaProvider` |
| `src/vite-env.d.ts` | REPLACE | Not needed in Expo/Metro; remove |
| `src/registry/GameRegistry.tsx` | REWRITE | `React.lazy()` + `Suspense` → `React.lazy()` still works; image imports → require(); remove browser-specific patterns |

---

### `shared/model`

| File | Classification | Notes |
|---|---|---|
| `src/types.ts` | PORTABLE | Remove unused `GameState` interface; consolidate `GameMode` |
| `src/types/games.ts` | PORTABLE | Copy as-is; adjust import paths |

---

### `shared/config`

| File | Classification | Notes |
|---|---|---|
| `src/theme/colors.ts` | PORTABLE | Pure TypeScript color objects; no browser APIs |

---

### `shared/lib`

| File | Classification | Notes |
|---|---|---|
| `src/hooks/useTimer.ts` | PORTABLE | `setInterval` works in RN |
| `src/hooks/usePlayerCycle.ts` | PORTABLE | Pure React hook |
| `src/hooks/useCountdown.ts` | PORTABLE | `setTimeout` works in RN |
| `src/utils/random.ts` | PORTABLE | Pure JS |
| `src/utils/gameLogic.ts` | PORTABLE | Pure JS; depends on contentService (which changes implementation) |
| `src/i18n/index.ts` | PORTABLE | React Context works in RN; `storageService` call → async pattern |
| `src/i18n/keys.ts` | PORTABLE | Pure constants |
| `src/i18n/en.ts` | PORTABLE | Pure data |
| `src/i18n/ru.ts` | PORTABLE | Pure data |
| `src/i18n/types.ts` | PORTABLE | Pure types |

---

### `shared/api`

| File | Classification | Notes |
|---|---|---|
| `src/services/storageService.ts` | REPLACE | `localStorage` → `@react-native-async-storage/async-storage` or MMKV; entire API must become `async`; all call-sites need `await` |
| `src/services/feedbackService.ts` | REPLACE | `AudioContext`/Web Audio → `expo-av`; `navigator.vibrate` → `expo-haptics`; `VIBRATE` constants copy as-is |
| `src/services/contentService.ts` | PORTABLE | Pure selection logic; depends on new async `storageService` — add `async/await` throughout |

---

### `content` layer

All 15 files: **PORTABLE** — pure TypeScript data arrays, no browser APIs.

| File | Classification |
|---|---|
| `src/constants/aliasContent.ts` | PORTABLE |
| `src/constants/codenamesContent.ts` | PORTABLE |
| `src/constants/connectFourContent.ts` | PORTABLE |
| `src/constants/decryptoContent.ts` | PORTABLE |
| `src/constants/fakeArtistContent.ts` | PORTABLE |
| `src/constants/instructions.ts` | PORTABLE |
| `src/constants/justOneContent.ts` | PORTABLE |
| `src/constants/millionaireContent.ts` | PORTABLE |
| `src/constants/resistanceContent.ts` | PORTABLE |
| `src/constants/spyHuntContent.ts` | PORTABLE |
| `src/constants/tabooContent.ts` | PORTABLE |
| `src/constants/tabooReverseContent.ts` | PORTABLE |
| `src/constants/telestrationsContent.ts` | PORTABLE |
| `src/constants/truthOrDareContent.ts` | PORTABLE |
| `src/constants/wavelengthContent.ts` | PORTABLE |

---

### `shared/ui` — components

| File | Classification | RN equivalent / notes |
|---|---|---|
| `src/components/Typography.tsx` | NATIVEWIND | `div/p/h1/span` → `Text`; custom size tokens (`text-pico`, `text-micro`, etc.) need NativeWind theme config; `glow` textShadow works in RN |
| `src/components/PrimaryButton.tsx` | REWRITE | `button` → `Pressable`; `hover:` → `pressed` state; gradient overlay → `expo-linear-gradient`; feedback calls preserved |
| `src/components/GameHeader.tsx` | MANUAL | `sticky top-0` → React Navigation header or absolute View; `backdropFilter: blur()` → `@react-native-community/blur` or remove; layout maps with View + Text |
| `src/components/PassPhoneCard.tsx` | MANUAL | `motion.div` → reanimated; CSS glitch `animate-cyber-hard-1/2` → reanimated keyframes; `boxShadow` → `style.shadowColor` etc.; `aspect-3/4` → `aspectRatio: 3/4`; `position: absolute` overlays work in RN |
| `src/components/DrawingCanvas.tsx` | REPLACE | HTML5 Canvas + ResizeObserver → `@shopify/react-native-skia`; `onLayout` replaces ResizeObserver; `input[type="color"]` → custom color picker wheel; DPR handling built into Skia |
| `src/components/DistributionFlow.tsx` | REWRITE | `motion.div` + `AnimatePresence` → `moti` or `react-native-reanimated`; `div` → `View`; layout is straightforward |
| `src/components/TimerBar.tsx` | NATIVEWIND | `div` with `style.width` → `View`; NativeWind `h-1.5 bg-white/10` maps 1:1; `transition-all duration-1000 ease-linear` → Animated.timing |
| `src/components/ProgressDots.tsx` | REWRITE | `motion.div` → reanimated; `div` → `View`; dots pattern is simple |
| `src/components/PlayingHeader.tsx` | NATIVEWIND | `div` + `p` → `View` + `Text`; all Tailwind classes map; no complex effects |
| `src/components/TabooPassPhase.tsx` | REWRITE | Uses PassPhoneCard + PlayerScoreList; `div` → `View`; motion animations |
| `src/components/LeaderboardList.tsx` | NATIVEWIND | `div`/`p` → `View`/`Text`; sorted list; no complex styles |
| `src/components/PlayerScoreList.tsx` | NATIVEWIND | `div`/`p` → `View`/`Text`; simple list |
| `src/components/StopGameButton.tsx` | REWRITE | `button` → `Pressable` |
| `src/components/InstructionsModal.tsx` | REWRITE | `position: fixed` overlay → RN `Modal`; `motion.div` slide → reanimated |
| `src/components/GameMenuCard.tsx` | REWRITE | `div` → `View`; `motion` → reanimated stagger; image → `Image` |
| `src/components/GameCard.tsx` | NATIVEWIND | Simple card layout |
| `src/components/Badge.tsx` | NATIVEWIND | `div`/`span` → `View`/`Text` |
| `src/components/IconButton.tsx` | REWRITE | `button` → `Pressable` |
| `src/components/PageWrapper.tsx` | NATIVEWIND | `div` → `ScrollView` or `View` with padding |
| `src/components/Pagination.tsx` | REWRITE | `button` → `Pressable` |
| `src/components/PlayerRow.tsx` | REWRITE | `Reorder.Item` (motion) → `react-native-draggable-flatlist` item; `input` → `TextInput` |
| `src/components/SectionLabel.tsx` | NATIVEWIND | `p` → `Text` |
| `src/components/TabButton.tsx` | REWRITE | `button` → `Pressable` |
| `src/components/TextInput.tsx` | REWRITE | HTML `<input>` → RN `<TextInput>`; `glass-input` → StyleSheet |

---

### `features` / `widgets`

| File | Classification | Notes |
|---|---|---|
| `src/contexts/GameSettingsContext.tsx` | PORTABLE | React Context works; storageService calls need `await` at initialization |
| `src/components/UniversalGameSettings.tsx` | REWRITE | `motion.div` → reanimated; `button` → `Pressable`; layout preserved |
| `src/components/MainMenu.tsx` | REWRITE + MANUAL | Bottom sheet → `@gorhom/bottom-sheet`; `position: fixed` overlay → `Modal`; `motion` → reanimated; `AnimatePresence` → conditional renders with animation |
| `src/components/Setup.tsx` | REWRITE + MANUAL | `Reorder.Group` → `react-native-draggable-flatlist`; `fixed bottom-0` footer → `KeyboardAvoidingView` pinned buttons; `min-h-screen` → `flex: 1` |
| `src/components/Settings.tsx` | REWRITE | Tabs → custom tab bar; `confirm()` → `Alert.alert`; `input` → `TextInput`; animations → reanimated; overall structure preserved |

---

### `debug`

| File | Classification | Notes |
|---|---|---|
| `src/debug/bunkerBalance.ts` | PORTABLE | Pure simulation, no browser APIs |
| `src/debug/BunkerBalanceView.tsx` | REWRITE | `motion` → reanimated; `div` → `View`; can be omitted from RN build |

---

### `assets`

| File | Classification | Notes |
|---|---|---|
| All 27 image files (`*.png`, `*.jpg`, `*.jpeg`) | PORTABLE | Copy to `assets/`; use `require()` in RN; may need WebP conversion for performance |

---

### `games`

All game `types.ts` files (17): **PORTABLE** — pure enums and interfaces.

All game `helpers.ts` files (BunkerGame): **PORTABLE** — pure logic.

All game content files (`BunkerGame/contents/`, `BunkerGame/constants.ts`): **PORTABLE**

| Game file | Classification | Notes |
|---|---|---|
| `AliasGame/AliasGame.tsx` | REWRITE | `canvas-confetti` → REPLACE (`react-native-confetti-cannon`); `AnimatePresence` → reanimated; phase dispatch preserved |
| `AliasGame/phases/*.tsx` (4 files) | REWRITE | `motion.div` → reanimated; `div`/`button` → `View`/`Pressable` |
| `BunkerGame/BunkerGame.tsx` | REWRITE | 8-phase dispatch, complex state; no browser APIs in game logic |
| `BunkerGame/phases/*.tsx` (8 files) | REWRITE | All motion/div/button elements; complex layouts |
| `BunkerGame/components/ResourceContribRow.tsx` | NATIVEWIND | Simple row component |
| `CodenamesGame/CodenamesGame.tsx` | REWRITE | Grid word layout, team color logic |
| `CodenamesGame/phases/*.tsx` (4 files) | REWRITE | Standard phase rewrites |
| `ConnectFourGame/ConnectFourGame.tsx` | REWRITE + MANUAL | No HTML Canvas (board is DOM grid); `canvas-confetti` → REPLACE; `hover:` → `onPressIn`; `grid-cols-7/9` → custom `flexWrap` or `FlatList` grid; `motion.div` → reanimated |
| `CorridorGame/CorridorGame.tsx` | REWRITE + MANUAL | Inline SVG board → `react-native-svg`; BFS logic is PORTABLE (move to model file); `motion.div` → reanimated; complex touch target math |
| `DecryptoGame/DecryptoGame.tsx` | REWRITE | Multi-team, many components |
| `DecryptoGame/components/*.tsx` (7 files) | REWRITE | Standard element rewrites; `CodeInput` needs RN TextInput + focus handling |
| `FakeArtistGame/FakeArtistGame.tsx` | REWRITE | Uses DistributionFlow (rewritten); canvas drawing shared component |
| `FakeArtistGame/components/*.tsx` (2 files) | REWRITE | DistributionFlow-based; motion animations |
| `JustOneGame/JustOneGame.tsx` | REWRITE | Standard game shell |
| `JustOneGame/phases/*.tsx` (4 files) | REWRITE | Standard |
| `MafiaGame/MafiaGame.tsx` | REWRITE + MANUAL | Single large file; no segmentation to carry over; role distribution, timers, motion all need RN equivalents |
| `MillionaireGame/MillionaireGame.tsx` | REWRITE | Quiz mechanics; pass phase |
| `MillionaireGame/phases/*.tsx` (5 files) | REWRITE | Standard phase rewrites |
| `ResistanceGame/ResistanceGame.tsx` | REWRITE | Team voting, uses DistributionFlow |
| `ResistanceGame/components/*.tsx` (2 files) | REWRITE | Standard |
| `SpyHuntGame/SpyHuntGame.tsx` | REWRITE | `canvas-confetti` → REPLACE; `initSpyHunt` preserved |
| `SpyHuntGame/components/RoleDistribution.tsx` | REWRITE | DistributionFlow-based |
| `SpyHuntGame/phases/*.tsx` (2 files) | REWRITE | Standard |
| `TabooGame/TabooGame.tsx` | REWRITE | `useTimer` preserved; `canvas-confetti` not used here |
| `TabooGame/phases/*.tsx` (4 files) | REWRITE | Standard |
| `TabooReverseGame/TabooReverseGame.tsx` | REWRITE | Same as TabooGame |
| `TabooReverseGame/phases/*.tsx` (5 files) | REWRITE | Standard |
| `TelestrationsGame/TelestrationsGame.tsx` | REWRITE | Uses DrawingCanvas (REPLACE); `useCountdown` preserved |
| `TelestrationsGame/components/*.tsx` (4 files) | REWRITE | TelestrationsGallery renders `<img>` tags → `Image`; TelestrationsGuess needs RN TextInput |
| `TruthOrDareGame/TruthOrDareGame.tsx` | REWRITE | Standard; `usePlayerCycle` preserved |
| `TruthOrDareGame/phases/*.tsx` (3 files) | REWRITE | Standard |
| `WavelengthGame/WavelengthGame.tsx` | REWRITE | Dial/slider mechanic; complex gesture (PanResponder or gesture-handler) |
| `WavelengthGame/phases/*.tsx` (4 files) | REWRITE | Standard; dial in GuessingPhase is the hardest element |

---

## 4. Proposed `shared/ui` Component List

Components that belong in `shared/ui` in the target RN project, with interfaces only.

---

### `Typography`

```typescript
type TypoColor = 'white' | 'body' | 'muted' | 'faint' | 'dimmer'
               | 'red' | 'blue' | 'green' | 'sky' | 'orange' | 'yellow' | 'purple';
type TypoAlign = 'left' | 'center' | 'right';

interface TypoBaseProps {
  color?: TypoColor;
  align?: TypoAlign;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  glow?: boolean;
}
// Variants: Typography.Display / Title / Heading / Body / Label / Caption / Score
// Each adds: size?: string
```
Replaces: `src/components/Typography.tsx`

---

### `PrimaryButton`

```typescript
type ButtonVariant = 'white' | 'premium' | 'red' | 'blue' | 'emerald' | 'purple' | 'outline';

interface PrimaryButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  iconElement?: React.ReactNode;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/PrimaryButton.tsx`

---

### `GameHeader`

```typescript
interface GameHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  theme: GameTheme;
  onBack: () => void;
  extraActions?: React.ReactNode;
}
```
Replaces: `src/components/GameHeader.tsx`

---

### `PassPhoneCard`

```typescript
type AccentColor = 'green' | 'sky' | 'red' | 'orange' | 'blue' | 'purple' | 'yellow' | 'default';
type BadgeColor = AccentColor;

interface PassPhoneCardProps {
  playerName: string;
  playerLabel?: string;
  badge?: string;
  badgeColor?: BadgeColor;
  instruction?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  accentColor?: AccentColor;
  onPress: () => void;
}
```
Replaces: `src/components/PassPhoneCard.tsx`

---

### `TimerBar`

```typescript
interface TimerBarProps {
  pct: number;        // 0–100
  color: string;      // hex or rgba
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/TimerBar.tsx`

---

### `ProgressDots`

```typescript
interface ProgressDotsProps {
  count: number;
  current: number;
  activeColor?: string;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/ProgressDots.tsx`

---

### `DistributionFlow`

```typescript
interface CardStyleResult {
  style?: StyleProp<ViewStyle>;
}

interface DistributionFlowProps {
  players: Player[];
  onFinish: () => void;
  renderCard: (player: Player, isLast: boolean, onNext: () => void) => React.ReactNode;
  getCardStyle?: (player: Player) => CardStyleResult;
  passInstruction?: string;
  passIcon?: React.ComponentType;
  passAccentColor?: AccentColor;
  activeColor?: string;
}
```
Replaces: `src/components/DistributionFlow.tsx`

---

### `PlayingHeader`

```typescript
interface PlayingHeaderProps {
  explainer: string;
  timeLeft: number;
  timerColor?: string;
  teamName?: string;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/PlayingHeader.tsx`

---

### `TabooPassPhase`

```typescript
interface TabooPassPhaseProps {
  accentColor: 'red' | 'orange';
  icon: React.ComponentType;
  instruction: string;
  playerNames: string[];
  scores: Record<string, number>;
  currentExplainer: string;
  teams?: Array<{ name: string; players: string[]; score: number }>;
  onStart: () => void;
}
```
Replaces: `src/components/TabooPassPhase.tsx`

---

### `LeaderboardList`

```typescript
interface LeaderboardListProps {
  players: Array<{ name: string; score: number }>;
  theme?: GameTheme;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/LeaderboardList.tsx`

---

### `PlayerScoreList`

```typescript
interface PlayerScoreListProps {
  players: string[];
  scores: Record<string, number>;
  currentExplainer?: string;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/PlayerScoreList.tsx`

---

### `StopGameButton`

```typescript
interface StopGameButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/StopGameButton.tsx`

---

### `Badge`

```typescript
type BadgeVariant = AccentColor;

interface BadgeProps {
  label: string;
  color?: BadgeVariant;
  size?: 'sm' | 'md';
}
```
Replaces: `src/components/Badge.tsx`

---

### `IconButton`

```typescript
interface IconButtonProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/IconButton.tsx`

---

### `PageWrapper`

```typescript
interface PageWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/PageWrapper.tsx`

---

### `Pagination`

```typescript
interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}
```
Replaces: `src/components/Pagination.tsx`

---

### `AppTextInput`

```typescript
interface AppTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/TextInput.tsx` (renamed to avoid collision with RN's `TextInput`)

---

### `SectionLabel`

```typescript
interface SectionLabelProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
```
Replaces: `src/components/SectionLabel.tsx`

---

### `TabButton`

```typescript
interface TabButtonProps {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}
```
Replaces: `src/components/TabButton.tsx`

---

### `GameMenuCard`

```typescript
interface GameMenuCardProps {
  game: GameMetadata;
  index: number;
  countDisplay: string | null;
  onSelect: () => void;
  onDescriptionPress: () => void;
}
```
Replaces: `src/components/GameMenuCard.tsx`

---

### `DrawingCanvas`

```typescript
interface DrawingCanvasProps {
  word: string;
  timeLeft: number;
  playerCount: number;
  currentRound: number;
  onFinish: (dataUrl: string) => void;
}
```
Replaces: `src/components/DrawingCanvas.tsx` — full rewrite with `@shopify/react-native-skia`

---

### `InstructionsModal`

```typescript
interface InstructionsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  instructions: Array<{ title: string; content: string }>;
  description?: string;
  theme: GameTheme;
}
```
Replaces: `src/components/InstructionsModal.tsx`

---

## 5. Phased Execution Plan

> Phase 0 for FSD cleanup is **skipped**. All violations will be corrected by design in the target project structure. Fixing the source before migration adds work with no benefit.

---

### Phase 1 — Project scaffold + portable foundation

**Goal:** Create the Expo project, wire all configuration, and port every PORTABLE file. At the end of Phase 1 there is no UI, but all game logic, content, types, hooks, i18n, and theme tokens are available and tested.

**Files touched:**
- New: `package.json`, `app.json`, `tailwind.config.ts`, `metro.config.js`, `tsconfig.json`
- `src/types.ts` → copy + remove dead `GameState`; fix duplicate `GameMode`
- `src/types/games.ts` → copy as-is
- `src/theme/colors.ts` → copy as-is
- All 15 `src/constants/*.ts` → copy as-is
- `src/utils/random.ts`, `src/utils/gameLogic.ts` → copy as-is
- `src/hooks/useTimer.ts`, `usePlayerCycle.ts`, `useCountdown.ts` → copy as-is
- `src/i18n/*.ts` (all 5) → copy, update `storageService` call to async
- `src/services/storageService.ts` → **REPLACE** with AsyncStorage or MMKV; keep identical public API, make all methods `async`
- `src/services/feedbackService.ts` → **REPLACE** with `expo-haptics` + `expo-av`; keep `VIBRATE` constants and public API
- `src/services/contentService.ts` → port with `async/await`
- `src/contexts/GameSettingsContext.tsx` → port with `async` init
- All game `types.ts` (17 files) → copy as-is
- `src/games/BunkerGame/helpers.ts`, `constants.ts`, `contents/*.ts` → copy as-is
- `src/games/DecryptoGame/helpers.ts` → copy as-is
- `src/debug/bunkerBalance.ts` → copy as-is (optional, for feature parity)
- All 27 asset files → copy to `assets/`

**New dependencies:** `expo`, `react-native`, `nativewind`, `@react-native-async-storage/async-storage` (or MMKV), `expo-haptics`, `expo-av`, `lucide-react-native`

**Token cost:** Small

**Confirm before proceeding:**
1. Confirm storage backend choice: AsyncStorage (simpler) vs MMKV (faster, synchronous-like API available)?
2. Confirm sound approach: `expo-av` for tones or drop sounds entirely in RN (vibration is sufficient for mobile)?
3. Confirm Expo managed workflow vs bare workflow (affects `expo-haptics` availability)?

---

### Phase 2 — `shared/ui` component library

**Goal:** Build every reusable UI component from Section 4. At the end of Phase 2, the component library is fully functional and can be rendered in a test screen.

**Files touched (all new RN rewrites of):**

*Atomic — no animation, pure NativeWind:*
`Typography`, `TimerBar`, `SectionLabel`, `Badge`, `TabButton`, `PageWrapper`, `AppTextInput`, `Pagination`

*Compound — Pressable + styling:*
`PrimaryButton`, `IconButton`, `StopGameButton`, `PlayingHeader`, `PlayerScoreList`, `LeaderboardList`

*Animated — reanimated required:*
`ProgressDots`, `DistributionFlow`

*Complex — custom native solutions:*
`GameHeader` (navigation header or absolute View + blur), `PassPhoneCard` (reanimated + custom shadow), `TabooPassPhase`, `InstructionsModal` (RN Modal), `GameMenuCard`

*Special replacement:*
`DrawingCanvas` → full Skia implementation

**New dependencies:** `react-native-reanimated`, `react-native-gesture-handler`, `moti`, `@gorhom/bottom-sheet`, `@shopify/react-native-skia`, `@react-native-community/blur`, `expo-linear-gradient`

**Token cost:** Large

**Confirm before proceeding:**
1. Confirm animation library: `moti` (easiest AnimatePresence port) vs raw `react-native-reanimated` (more control)?
2. Confirm whether `backdropFilter: blur` on GameHeader is a hard requirement or can be removed?
3. Confirm DrawingCanvas approach: Skia (full control) vs `react-native-canvas` (lighter)?

---

### Phase 3 — App shell + navigation + screens

**Goal:** Implement the root navigation (React Navigation v7 Stack), the three main screens (MainMenu, Setup, Settings), UniversalGameSettings, and the game registry wiring. At the end of Phase 3, you can launch the app, browse games, configure settings, and reach the game start point.

**Files touched:**
- New: `App.tsx` (navigation stack replacing switch statement)
- New: `registry/GameRegistry.tsx` (lazy imports adapted for RN)
- `MainMenu` widget — rewrite with `@gorhom/bottom-sheet` for description sheet
- `Setup` widget — rewrite with `react-native-draggable-flatlist` for player reorder
- `Settings` widget — rewrite with `Alert.alert` replacing `confirm()`
- `UniversalGameSettings` — rewrite
- New navigation param types

**New dependencies:** `@react-navigation/native`, `@react-navigation/stack` or `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `react-native-draggable-flatlist`

**Token cost:** Medium

**Confirm before proceeding:**
1. Confirm navigation approach: Stack (matches current push/pop model) vs native-stack (better performance)?
2. Confirm how to handle the "fixed bottom" start button in Setup — `KeyboardAvoidingView` sufficient, or should Setup be a modal sheet?

---

### Phase 4 — Games batch 1: role-distribution games + simple pass-and-play

**Goal:** Port 6 games that share the `DistributionFlow` pattern or have straightforward phase structures. These are the simplest to port and validate the component library.

**Games:**
- `WavelengthGame` — 4 phases; dial mechanic needs PanResponder or gesture-handler
- `TruthOrDareGame` — 3 phases; `usePlayerCycle` preserved
- `JustOneGame` — 4 phases; hint input, word reveal
- `SpyHuntGame` — `DistributionFlow` + 2 phases; `useTimer` preserved; confetti → replace
- `FakeArtistGame` — `DistributionFlow` + 2 components; confetti → replace
- `ResistanceGame` — `DistributionFlow` + 2 components; team voting

**For each game:** copy `types.ts`, rewrite root component and all phases/components

**Token cost:** Medium

**Confirm before proceeding:**
1. Confirm Wavelength dial gesture: PanResponder (built-in) vs `react-native-gesture-handler` pan gesture (already installed)?

---

### Phase 5 — Games batch 2: timer-based + complex word games

**Goal:** Port 6 games with timers, team mechanics, or more complex UI layouts.

**Games:**
- `AliasGame` — `useTimer`; team scoring; confetti
- `TabooGame` — `useTimer`; `TabooPassPhase`; playing + verdict cycle
- `TabooReverseGame` — `useTimer`; Blitz mode; 5 phases
- `CodenamesGame` — 5×5 grid of word cards; two-team mechanics; captain phase
- `DecryptoGame` — multi-component; `CodeInput` needs number-pad; team vs team
- `MafiaGame` — single-file rewrite into segmented phases; role reveal flow

**Token cost:** Large

**Confirm before proceeding:**
1. Confirm Codenames grid rendering: `FlatList` numColumns vs flexWrap absolute layout?
2. Confirm DecryptoGame `CodeInput` pattern: number picker row vs `TextInput` with number keyboard?

---

### Phase 6 — Games batch 3: special mechanics

**Goal:** Port the 5 most technically complex games that each require a unique native capability.

**Games:**
- `TelestrationsGame` — depends on `DrawingCanvas` (Skia, from Phase 2); gallery image chain with `Image` component
- `ConnectFourGame` — grid board; all 4 modes (classic, large, connect-five, pop-out); confetti; hover → `onPressIn`
- `BunkerGame` — 8 phases, survival simulation, character generation; most complex state machine
- `MillionaireGame` — 5 phases, 15-question quiz tree, lifelines, "hot seat" visual
- `CorridorGame` — SVG board → `react-native-svg`; BFS wall validation stays portable; 9×9 grid; wall touch targets

**New dependencies:** `react-native-svg`, `canvas-confetti` → `react-native-confetti-cannon`

**Token cost:** Large

**Confirm before proceeding:**
1. Confirm `react-native-svg` for CorridorGame vs redrawing the board as a `FlatList` grid (simpler but less precise)?
2. Confirm whether BunkerGame's debug balance view should be included in the RN build or dropped?
3. Confirm confetti library: `react-native-confetti-cannon` (simple) vs Skia particles (consistent with DrawingCanvas, more control)?

---

### Dependency registry

| Library | Replaces | Phase |
|---|---|---|
| `@react-native-async-storage/async-storage` (or `react-native-mmkv`) | `localStorage` | 1 |
| `expo-haptics` | `navigator.vibrate` | 1 |
| `expo-av` | `AudioContext` / Web Audio API | 1 |
| `lucide-react-native` | `lucide-react` | 1 |
| `react-native-reanimated` | `motion/react` | 2 |
| `react-native-gesture-handler` | mouse/touch events | 2 |
| `moti` | `AnimatePresence` / `motion.div` | 2 |
| `@shopify/react-native-skia` | HTML5 Canvas | 2 |
| `expo-linear-gradient` | CSS `bg-linear-to-tr` | 2 |
| `@react-native-community/blur` | `backdropFilter: blur()` | 2 |
| `@gorhom/bottom-sheet` | bottom sheet in MainMenu | 3 |
| `react-native-draggable-flatlist` | `Reorder.Group` (motion) | 3 |
| `@react-navigation/native` + stack | React Router / `switch(status)` | 3 |
| `react-native-screens`, `react-native-safe-area-context` | browser safe areas | 3 |
| `react-native-svg` | inline SVG in CorridorGame | 6 |
| `react-native-confetti-cannon` | `canvas-confetti` | 4–6 |