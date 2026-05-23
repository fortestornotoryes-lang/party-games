---
name: new-game
description: Scaffolds a complete new party game for Party Hub following the exact project architecture — GameStatus enum, GameKey, GameRegistry, App.tsx routing, phase enum pattern, and file structure.
---

You are scaffolding a new party game for Party Hub. Follow these steps exactly. Do not skip any step.

## Before You Start

Ask the user for:
1. **Game name** (English, PascalCase, e.g. `TruthOrDare`) — used for file/component names
2. **Game ID** (snake_case, e.g. `truth_or_dare`) — used for `GameKey` and `GameStatus` values
3. **Theme color** — one of: `red`, `blue`, `green`, `purple`, `orange`, `yellow`, `sky`
4. **Minimum players** (number)
5. **Brief description** (1 sentence, shown in the game card)
6. **Game phases** (list them, e.g. "start, playing, result") — will become the phase enum

Then proceed through all steps below without further prompting.

---

## Step 1 — Add GameStatus entries (`src/types.ts`)

Add entries to the `GameStatus` enum. Pattern: `<GameName>Setup`, `<GameName>Playing`, and any additional phases. Use the game ID as the string value:

```ts
// Example for truth_or_dare:
TruthOrDareSetup = 'truth_or_dare_setup',
TruthOrDarePlaying = 'truth_or_dare_playing',
TruthOrDareResult = 'truth_or_dare_result',
```

Add after the last existing game's entries, before the closing `}`.

---

## Step 2 — Add GameKey entry (`src/types/games.ts`)

Add to the `GameKey` enum:
```ts
TruthOrDare = 'truth_or_dare',
```

---

## Step 3 — Create the game folder and files

Create these files:

### `src/games/<GameName>Game/types.ts`
```ts
// Phase enum — NEVER use string literals for phases
export enum <GameName>Phase {
  Start = 'start',
  // ... one entry per phase the user listed
}
```

### `src/games/<GameName>Game/<GameName>Game.tsx`
```tsx
import { motion, AnimatePresence } from 'motion/react';
import { GameHeader } from '../../components/GameHeader';
import { Player } from '../../types';
import { <GameName>Phase } from './types';

interface <GameName>GameProps {
  players: Player[];
  onBack: () => void;
}

export function <GameName>Game({ players, onBack }: <GameName>GameProps) {
  const [phase, setPhase] = useState<<GameName>Phase>(<GameName>Phase.Start);

  return (
    <div className="flex flex-col h-full safe-top safe-bottom">
      <GameHeader
        title="<Game Title>"
        theme="<theme-color>"
        onBack={onBack}
      />
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {phase === <GameName>Phase.Start && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Start phase content */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

Key rules:
- Import from `'motion/react'` (NOT `framer-motion`)
- Every `<motion.*>` that can exit MUST have an `exit` prop
- `AnimatePresence` children MUST have a `key` prop
- Scrollable areas use `flex-1 min-h-0 overflow-y-auto`
- Canvas elements (if any) follow the ResizeObserver + `ctx.setTransform` pattern from DrawingCanvas.tsx

---

## Step 4 — Register in GameRegistry (`src/registry/GameRegistry.tsx`)

Add a lazy import at the top:
```ts
const <GameName>Game = lazy(() =>
  import('../games/<GameName>Game/<GameName>Game').then(m => ({ default: m.<GameName>Game }))
);
```

Add an entry to `GAMES_REGISTRY`:
```ts
[GameKey.<GameName>]: {
  id: GameKey.<GameName>,
  title: '<Display Title>',
  subtitle: '<Subtitle>',
  icon: <LucideIcon>,
  theme: '<theme-color>',
  placeholder: 'Введи имя',
  description: '<brief description>',
  instructions: GAME_INSTRUCTIONS[GameKey.<GameName>],
  minPlayers: <N>,
  setupStatus: GameStatus.<GameName>Setup,
}
```

---

## Step 5 — Add instructions (`src/constants/instructions.ts`)

Add to `GAME_INSTRUCTIONS`:
```ts
[GameKey.<GameName>]: [
  { title: 'Цель игры', content: '...' },
  { title: 'Как играть', content: '...' },
],
```

---

## Step 6 — Add routing in App.tsx

Add a lazy import near the other game imports:
```ts
const <GameName>Game = lazy(() =>
  import('./games/<GameName>Game/<GameName>Game').then(m => ({ default: m.<GameName>Game }))
);
```

Add a case in `renderGame()`:
```ts
case GameStatus.<GameName>Playing:
  return <GameName>Game players={players} onBack={() => setStatus(GameStatus.Menu)} />;
```

⚠️ Note: App.tsx switch cases currently mix string literals and enum values. Use `GameStatus.<GameName>Playing` (the enum), not the string. If TypeScript complains about the switch, add the enum value — do NOT use a string literal.

---

## Step 7 — Verify

Run `npm run lint` (which runs `tsc --noEmit`) and fix any type errors before finishing. List all created/modified files as a summary.