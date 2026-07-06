# Project Memory Bank

At the start of every session, read the memory bank located in `.claude/memory/`:

1. Read `.claude/memory/MEMORY.md` — this is the index of all memory files and the maintenance rules
2. Read each file listed in the index that is relevant to the current task

When saving new memories, write them to `.claude/memory/` (not to `~/.claude/projects/...`) and follow the maintenance rules in `MEMORY.md` (update existing files instead of creating new ones; store rules and pointers to code, not copies of it; delete stale facts).

The memory bank contains:

- `project.md` — stack, commands, folder structure, routing, GameRegistry, new-game checklist
- `conventions.md` — const-object instead of enum, game phases, settings persistence, session persistence, content pools, i18n
- `ui.md` — themes/colors (PREMIUM_RGB ↔ @theme), glass-card, shared components, animations
- `gotchas.md` — known pitfalls: canvas/DPR, backdrop-filter, mobile layout, storage
