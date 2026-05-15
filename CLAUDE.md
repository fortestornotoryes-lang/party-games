# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at localhost:3000 (all interfaces)
npm run build     # production build
npm run lint      # TypeScript type check only (tsc --noEmit, no ESLint)
npm run preview   # preview production build
```

No test suite exists.

## Architecture

Single-page party game hub built with React 19 + TypeScript + Vite. UI language is Russian.

**State machine in `App.tsx`** — the entire app is one big switch on `AppState = 'menu' | GameStatus`. All game state (`players`, `gameState`) lives here and is passed down as props. There is no routing library and no context/store.

**`GameStatus` in `src/types.ts`** defines every possible state. Each game follows a `{game}_setup → {game}_distributing → {game}_playing → {game}_result` chain (not all games have every step).

**7 games and their flows:**
| Game | Menu ID | States |
|------|---------|--------|
| Spy Hunt | `spy` | `setup → distributing → playing → result` |
| Fake Artist | `fake_artist` | `fake_artist_setup → fake_artist_distributing → fake_artist_playing → fake_artist_result` |
| The Resistance | `resistance` | `resistance_setup → resistance_distributing → resistance_playing → resistance_result` |
| Alias Rapid | `alias` | `alias_setup → alias` |
| Wavelength | `wavelength` | `wavelength_playing` (no setup) |
| Telestrations | `telestrations` | `telestrations_setup → telestrations_playing` |
| Just One | `just_one` | `just_one_setup → just_one_playing` |

**Shared `Setup` component** (`src/components/Setup.tsx`) — reused for all games that need player name entry. Accepts a `themeColor` prop (`'red' | 'emerald' | 'sky' | 'orange' | 'purple'`) that drives all color variants via a `colorConfig` lookup object.

**Game content** lives in `src/constants/` (locations, words, roles, instructions). There are duplicate files at `src/*.ts` root — those are stale; the canonical versions are in `src/constants/`.

## Key dependencies

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js`, configured entirely through the Vite plugin and CSS directives.
- **Motion** — imported as `motion/react` (not `framer-motion`). Always use `import { motion, AnimatePresence } from 'motion/react'`.
- **Lucide React** for icons.
- Base path is `/party-games/` (set in `vite.config.ts`).
- Path alias `@` → `src/`.

## Design conventions

- Dark background: `bg-[#0a0502]` or `bg-black`
- Text: `text-[#e5e7eb]`
- Cards/surfaces: `bg-white/5 border border-white/10`
- Border radius: `rounded-2xl` (inputs, buttons) or `rounded-[2.5rem]` (cards/modals)
- All buttons use `whileHover` / `whileTap` scale animations from Motion
- Typography: `font-black uppercase italic tracking-tighter` for headings; `text-[10px] uppercase tracking-widest font-bold` for labels