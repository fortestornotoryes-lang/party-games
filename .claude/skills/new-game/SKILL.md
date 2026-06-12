---
name: new-game
description: Scaffolds a complete new party game for Party Hub following the exact project architecture — GameKey, GameRegistry, react-router (GamePlayRoute), const-object phase pattern, session persistence, i18n (RU/EN), and file structure.
---

You are scaffolding a new party game for Party Hub. Follow these steps exactly. Do not skip any step.

> Architecture truth source: `.claude/memory/` (project_overview, phase_enum_pattern, code_style, session_persistence, hooks_and_patterns, performance_rules, mobile_fixes). If this skill ever contradicts the memory bank or the actual code, the code wins — and update this skill.

## Before You Start

Determine (ask the user only if not derivable from their request):
1. **Game name** (English, PascalCase, e.g. `TruthOrDare`) — used for file/component names
2. **Game ID** (snake_case, e.g. `truth_or_dare`) — used for the `GameKey` value, i18n namespace, storage keys
3. **Theme color** — one of `GameTheme` in `src/shared/types`: `red | green | sky | yellow | orange | purple | blue | pink | cyan | lime | teal | indigo`
4. **Minimum players** (number) and the `players` display string (e.g. `'2+'`, `'4-8'`)
5. **Brief description** (1–2 sentences, shown on the game card)
6. **Game phases** (e.g. "pass, playing, round_end, game_over") — become the phase const-object
7. **Does it use difficulty?** (easy/medium/hard from `GameSettingsContext`) **Does it have modes?** (`modes` in registry + `mode` from context)

Then proceed through all steps below without further prompting.

---

## Step 1 — Add GameKey entry (`src/entities/game/types.ts`)

Add to `GameKey`:
```ts
TruthOrDare = 'truth_or_dare',
```

> ⚠️ Project convention (see `.claude/memory/code_style.md`): TS `enum` is banned; the canonical pattern is a const-object + derived type. `GameKey` may still be a legacy enum — if you touch the file and the rewrite is feasible, convert it to the const-object pattern with identical member names/values (call sites stay compatible), then run `npm run lint`. Never add a NEW enum.

---

## Step 2 — Create the game folder

```
src/games/<GameName>Game/
  <GameName>Game.tsx       # main component — orchestrates phases
  types.ts                 # phase const-object + interfaces + per-game const-objects
  constants.ts             # game config: difficulty configs, modes, scoring, content
  helpers.ts               # pure logic functions (testable, no React)
  components/              # phase components (PassPhase.tsx, PlayingPhase.tsx, ...)
```

### `types.ts` — phases are a const-object, NOT an enum, NOT string literals

```ts
export const <GameName>Phase = {
    Pass: 'pass',
    Playing: 'playing',
    GameOver: 'game_over',
} as const;

export type <GameName>Phase = (typeof <GameName>Phase)[keyof typeof <GameName>Phase];
```

Same pattern for any other variant set (action modes, card states, ...). No magic string literals in logic — every variant lives in a named const-object; defaults live in named constants in `constants.ts`.

### `<GameName>Game.tsx` — component contract

The router renders every game with exactly these props (see `GamePlayRoute.tsx`):

```tsx
interface Props {
    playerNames: string[];
    onBack: () => void;
}

export const <GameName>Game: React.FC<Props> = ({playerNames, onBack}) => { ... }
```

(Named export — the lazy import in GamePlayRoute maps it to default.)

Skeleton:

```tsx
import {SomeIcon} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React from 'react';

import {<GameName>Phase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {usePersistedState} from '@/shared/hooks/usePersistedState';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import {GameKey} from '@/entities/game/types';

export const <GameName>Game: React.FC<Props> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const K = GameKey.<GameName>;
    const [phase, setPhase] = usePersistedState<<GameName>Phase>(K, 'phase', <GameName>Phase.Pass);

    return (
        <div className="flex flex-col" style={{minHeight: '100dvh'}}>
            <GameHeader
                title={t(`${NS.<GAME_ID>}.title`)}
                subtitle={t(`${NS.<GAME_ID>}.subtitle`)}
                icon={SomeIcon}
                theme="<theme-color>"
                onBack={onBack}
            />
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                    {phase === <GameName>Phase.Pass && (
                        <motion.div
                            key="pass"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                        >
                            {/* ... */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
```

### Key rules

- **Animation:** import from `'motion/react'` (NOT `framer-motion`). Every `<motion.*>` inside `AnimatePresence` MUST have `key` and `exit`.
- **Layout:** scrollable areas use `flex-1 min-h-0 overflow-y-auto`. Root uses `minHeight: '100dvh'`. No nested `backdrop-filter` (kills scroll perf — see performance_rules.md); `glass-card` only on non-nested surfaces.
- **Canvas (if any):** ResizeObserver + DPR `ctx.setTransform` pattern from `DrawingCanvas.tsx`; `touch-action: none` on the canvas.
- **Session persistence (mandatory, see session_persistence.md):** every meaningful game state in the main component uses `usePersistedState(gameKey, field, initial, codec?)` instead of `useState` (phase, scores, board, current player index...). `usePersistedTimer` for timers. Init-effects (shuffle, deal, role assignment) MUST have a restore-guard (`if (cards.length > 0) return;`) so they don't clobber restored state. Transient state (hover, input drafts, pressed) stays in `useState`.
- **Reuse, don't re-implement (see hooks_and_patterns.md):** `usePlayerCycle` for turn rotation, `useTimer` for countdowns, `shuffle`/`pickRandom` from `@/shared/helpers/random`, `feedbackService.vibrate(VIBRATE.*)`, `TimerBar`, `ProgressDots`, `PlayingHeader`, `PassPhoneCard`, `PlayerScoreList`, `LeaderboardList`, `StopGameButton`, `DistributionFlow`, `canvas-confetti` for win celebrations.
- **Settings:** read `difficulty` / `mode` / `timerSeconds` from `useGameSettings()` (`@/entities/game/model/GameSettingsContext`). Per-difficulty/per-mode numbers live in `constants.ts` as `Record<Difficulty, ...>` configs — no inline ternaries on difficulty.

---

## Step 3 — Register in the registry (`src/entities/game/registry.tsx`)

Add an entry to `GAMES_REGISTRY` (shape = `GameMetadata` in `src/entities/game/types.ts` — there is NO `setupStatus` and NO `instructions` field):

```ts
[GameKey.<GameName>]: {
    id: GameKey.<GameName>,
    title: 'НАЗВАНИЕ',
    subtitle: 'Короткий слоган',
    icon: <LucideIcon>,
    theme: '<theme-color>',
    placeholder: 'Игрок',
    players: '2+',
    description: 'Описание для карточки игры.',
    minPlayers: <N>,
    modes: <GAME>_MODES,            // only if the game has modes (GameMode[] from constants.ts)
    backgroundImage: someImage,     // optional, import from @/assets
},
```

---

## Step 4 — Add routing (`src/pages/game/GamePlayRoute.tsx`)

NOT App.tsx — App.tsx is only providers + RouterProvider. Routing is react-router v7: `/game/:gameKey/setup` → `GameSetupRoute`, `/game/:gameKey/play` → `GamePlayRoute`.

1. Add a lazy import next to the others in `GamePlayRoute.tsx`:

```ts
const <GameName>Game = lazy(() =>
    import('@/games/<GameName>Game/<GameName>Game').then((m) => ({default: m.<GameName>Game}))
);
```

2. Add to `GAME_COMPONENTS`:

```ts
[GameKey.<GameName>]: <GameName>Game,
```

Only if the game needs extra props beyond `{playerNames, onBack}` (like Bunker's `onRestart` or Telestrations' `initialDifficulty`): exclude it from the `GAME_COMPONENTS` record type and render it as a special case before the generic render — follow the existing Bunker/Telestrations examples.

No changes to `routes.tsx` are needed — `:gameKey` is dynamic.

---

## Step 5 — Setup screen integration

`GameSetupRoute` renders `Setup` + `UniversalGameSettings` automatically for every registry entry — usually zero work. Touch `src/components/UniversalGameSettings.tsx` only if:

- the game must NOT show the difficulty selector → add its `GameKey` to the `hideDifficulty` condition;
- difficulty buttons need a sublabel (time/cards count) → add a case to `getDiffSublabel`;
- the game needs an extra setting row (rounds, timer...) → add a `currentGameId === GameKey.<GameName>` block using `SettingRow`.

Modes from `registry.modes` get rendered automatically; the chosen id arrives via `useGameSettings().mode`. The classic/default mode id is `CLASSIC_MODE_ID` from `src/entities/game/types.ts`.

---

## Step 6 — Add instructions (`src/entities/game/instructions.ts`)

`GAME_INSTRUCTIONS` is `Record<GameKey, InstructionItem[]>` — TypeScript will error until you add the new key:

```ts
[GameKey.<GameName>]: [
    {title: 'Суть игры', content: '...'},
    {title: 'Как играть', content: '...'},
    {title: 'Финал', content: '...'},
],
```

---

## Step 7 — i18n (RU/EN) — do this immediately, not "later"

All user-visible strings in the game components go through `t()` (`useTranslation` from `@/i18n`). Steps:

1. `src/shared/i18n/keys.ts` — add the namespace: `<GAME_ID_UPPER>: '<game_id>',` to `NS`.
2. `src/shared/i18n/types.ts` — add `export interface <GameName>Translations { ... }` (one field per string, comment with the RU original), add the optional key to `Translations` interface AND to its index-signature union.
3. `src/shared/i18n/ru.ts` / `src/shared/i18n/en.ts` — add the `<game_id>: {...}` blocks with full translations.
4. In components: `t(\`${NS.<GAME_ID_UPPER>}.key\`)`, interpolation via `{{var}}`: `t(\`${NS.X}.score\`, {n: 5})`.

Reuse `common.*` strings (back, next, winner, gameOver, difficulty...) before inventing per-game duplicates.

Registry `title`/`subtitle`/`description` and `instructions.ts` are currently RU-only static strings — keep them RU like the other games (the in-game header uses `t()` instead).

---

## Step 8 — Verify

1. `npm run lint` — runs eslint + `tsc --noEmit`. Fix everything.
2. Walk every phase transition mentally: each `AnimatePresence` child has `key`+`exit`; no dead-end phases; game-over offers restart and/or `onBack`.
3. Check persistence: reload mid-game must restore (no init-effect clobbering).
4. List all created/modified files as a summary.