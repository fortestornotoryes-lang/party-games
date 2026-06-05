# Project Memory Bank

At the start of every session, read the memory bank located in `.claude/memory/`:

1. Read `.claude/memory/MEMORY.md` — this is the index of all memory files
2. Read each file listed in the index that is relevant to the current task

When saving new memories, write them to `.claude/memory/` (not to `~/.claude/projects/...`).

The memory bank contains:

- `project_overview.md` — stack, startup, folder structure, architecture, GameRegistry
- `games_flow.md` — all 10 games, GameStatus chains, themes, player initialization
- `design_system.md` — premium colors, glass-card, typography, border-radius, themeConfigs
- `animation_rules.md` — motion/react, AnimatePresence, spring, flip, stagger
- `types_data.md` — Player, GameStatus, GameState, GameSettingsContext, content constants
- `mobile_fixes.md` — canvas ResizeObserver+DPR, touch-action none, flex-1 min-h-0
- `performance_rules.md` — nested backdrop-filter kills scrolling, what is safe
- `components_ui.md` — PrimaryButton, GameCard, GameHeader, DrawingCanvas reference
- `storage_wordlogic.md` — storageService gameId keys, contentService usage, difficulty bug fixes
