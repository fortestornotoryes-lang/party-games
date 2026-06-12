---
name: add-content
description: Add new content (words, locations, prompts, opposites, etc.) to any game's constants file. Knows the exact data structure of every game in Party Hub.
---

You are adding content to Party Hub. You know the exact TypeScript structure of every game's constants file. Follow the steps below precisely.

## Step 1 — Ask the user

Ask:
1. **Which game?** (Alias / SpyHunt / FakeArtist / TruthOrDare / Wavelength / Codenames / Decrypto / JustOne / Telestrations / Resistance / Taboo / TabooReverse / Millionaire / Bunker)
2. **What to add?** (words, locations+roles, category+words, truths, dares, opposites, etc.)
3. **Difficulty / category** — if the target structure is split by difficulty (`easy` / `medium` / `hard`) ask which one(s); if by category ask the category name
4. **The items themselves** — user provides a list, OR say "generate N" and you generate them in Russian matching the existing tone

Then proceed without further prompts.

---

## Step 2 — File map

| Game | File | Structure |
|------|------|-----------|
| **Alias** | `src/games/AliasGame/content.ts` | `ALIAS_CATEGORIES: WordCategory[]` — each entry has `{ id, name, description, difficulty: 'easy'\|'medium'\|'hard', words: string[] }`. Append to `words` of the matching difficulty entry. |
| **Codenames** | `src/games/CodenamesGame/content.ts` | `WORDS_BY_DIFFICULTY: { easy: string[], medium: string[], hard: string[] }`. Append to the matching array. |
| **SpyHunt** | `src/games/SpyHuntGame/content.ts` | `LOCATIONS_DATA: readonly LocationInfo[]` — each entry is `{ difficulty: 'easy'\|'medium'\|'hard', name: string, roles: string[] }`. Add new objects to the array, grouped by difficulty. |
| **FakeArtist** | `src/games/FakeArtistGame/content.ts` | `FAKE_ARTIST_DATA_BY_DIFFICULTY: Record<FakeArtistDifficulty, FakeArtistCategory[]>` — each item is `{ category: string, word: string }`. Append to the correct difficulty array. |
| **TruthOrDare** | `src/games/TruthOrDareGame/content.ts` | `TRUTHS_BY_DIFFICULTY: Record<Difficulty, string[]>` and `DARES_BY_DIFFICULTY: Record<Difficulty, string[]>`. Append strings to the correct difficulty array. |
| **Wavelength** | `src/games/WavelengthGame/content.ts` | `WAVELENGTH_DATA_BY_DIFFICULTY: { easy: string[][], medium: string[][], hard: string[][] }` — each item is a 2-element array `["Полюс А", "Полюс Б"]`. Append to the correct difficulty array. |
| **Decrypto** | `src/games/DecryptoGame/content.ts` | Read the file first to confirm structure, then append accordingly. |
| **JustOne** | `src/games/JustOneGame/content.ts` | Read the file first to confirm structure, then append accordingly. |
| **Telestrations** | `src/games/TelestrationsGame/content.ts` | Read the file first to confirm structure, then append accordingly. |
| **Resistance** | `src/games/ResistanceGame/constants.ts` | Only `RESISTANCE_ROLE_IDS` and `MISSION_SIZES` (no word content). Read the file first to confirm structure, then append accordingly. |
| **Taboo** | `src/games/TabooGame/content.ts` | `TABOO_CLASSIC_CARDS: readonly TabooClassicCard[]` — each entry is `{ id, difficulty, word, forbidden: string[] }`. Read the file first to confirm, keep ids unique and grouped by difficulty. |
| **TabooReverse** | `src/games/TabooReverseGame/content.ts` | `TABOO_REVERSE_CARDS: readonly TabooCard[]` — each entry is `{ id, difficulty, word, required: string[] }`. Keep ids unique and grouped by difficulty. |
| **Millionaire** | `src/games/MillionaireGame/content.ts` | `EASY_QUESTIONS` / `MEDIUM_QUESTIONS` / `HARD_QUESTIONS: MillionaireQuestion[]`. Read the file first to confirm structure. |
| **Bunker** | `src/games/BunkerGame/contents/` | One file per constant (PROFESSIONS, HOBBIES, TRAITS, …) + index.ts. Append to the matching array in its file. |

---

## Step 3 — Read before writing

Always **Read** the target file before editing to:
- Confirm the exact structure matches the table above (it may have been updated)
- Find the right insertion point (end of the target array/object)
- Check for duplicates — do NOT add words/items already present

---

## Step 4 — Add the content

- Match the formatting style exactly (indentation, quote style, trailing commas)
- For SpyHunt locations: always provide at least 6 `roles`
- For FakeArtist: group new items by their `category` comment if the category already exists
- For TruthOrDare: questions end with `?`, dares are imperative sentences — match the existing tone (conversational Russian, slightly humorous)
- For Wavelength: both poles must be single adjectives or short noun phrases in Russian, opposite in meaning
- Do NOT add duplicates

---

## Step 5 — Verify

Run `npm run lint` (runs `tsc --noEmit`). Fix any type errors.

---

## Step 6 — Report

Output a summary:
```
✅ Added to src/games/<Game>/<file>.ts
   Game: <Name>
   Difficulty/Category: <value>
   Items added: <N>
   New total: ~<N> items in that array
```