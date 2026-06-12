---
name: storage-wordlogic
description: "storageService gameId-ключи, архитектура пулов слов (get*Pool + contentService.getWordStats), исправленные difficulty-баги"
metadata: 
  node_type: memory
  type: project
  originSessionId: d8d0259b-432b-4531-b05b-0589b8f60792
---

## storageService — gameId-ключи

Ключи = значения `GameKey` (`'spy'`, `'alias'`, `'just_one'`, `'fake_artist'`, `'wavelength'`, `'telestrations'`, `'codenames'`, `'decrypto'`, `'truth_or_dare'`, `'taboo'`, `'taboo_reverse'`, `'millionaire'`).

Хранилища: `PLAYERS`, `USED_WORDS`, `CUSTOM_WORDS`, `CUSTOM_KEYED`, `SETTINGS`, `SETTINGS_{gameId}` (game config), `HISTORY`.

`storageService.getAllCustomWords(gameId, difficulty)` — общие кастомные слова + слова по ключу `{gameId}_{difficulty}`. Исключение — TruthOrDare: только keyed-слова `tod_{truth|dare}_{difficulty}`.

## Архитектура пулов слов (рефакторинг 2026-06-12)

Выбор контента живёт в хуках игр `src/games/<Game>/model/use*Content.ts` (вызываются из хендлеров/инициализаторов, не настоящие React-хуки). Каждый такой файл экспортирует **чистую пул-функцию** `get*Pool(difficulty)` — полный пул used-ключей (пресет + кастомные слова), единый источник для игры и статистики:

| Игра | Пул-функция | Где |
|------|-------------|-----|
| Alias | `getAliasWordPool` | `model/useAliasContent.ts` |
| JustOne | `getJustOneWordPool` | `model/useJustOneContent.ts` |
| Wavelength | `getWavelengthPairPool` + `wavelengthPairKey` (used-ключ = `pair.join(' - ')`) | `model/useWavelengthContent.ts` |
| FakeArtist | `getFakeArtistPool` (→ `{word, category}[]`) | `model/useFakeArtistContent.ts` |
| Telestrations | `getTelestrationsWordPool` | `model/useTelestrationsContent.ts` |
| Spy | `getSpyHuntLocationPool` (→ локации с ролями) | `model/useSpyHuntContent.ts` |
| Codenames | `getCodenamesWordPool` | `model/useCodenamesContent.ts` |
| Decrypto | `getDecryptoWordPool` | `model/useDecryptoContent.ts` |
| TruthOrDare | `getTruthOrDarePool(type, d)` | `model/useTruthOrDareContent.ts` |
| Taboo | `getTabooClassicWordPool` | `content.ts` (кастомных слов нет) |
| TabooReverse | `getTabooReverseWordPool` | `content.ts` (кастомных слов нет) |
| Millionaire | `getMillionaireQuestionPool` (difficulty игнорируется — внутренние уровни easy/medium/hard) + `getMillionaireQuestions()` с трекингом used по `q.text` | `model/millionaireContent.ts` |

`src/services/contentService.ts` (НЕ в shared — иначе shared зависел бы от games) держит реестр `WORD_POOLS: Partial<Record<GameKey, (d) => readonly string[]>>` и единственный метод `getWordStats(gameId, difficulty)` → `{total, remaining}`. Игры без расходуемого пула (mafia, resistance, corridor, connect_four, bunker, memo_risk) в реестре отсутствуют → `{0, 0}`.

**How to apply:** меняя логику пула игры — править её `get*Pool`; статистика подтянется сама. Новая игра со словами → экспортировать пул-функцию и добавить строку в `WORD_POOLS`. Не дублировать сборку пула в contentService или компонентах.

## Отображение оставшихся слов

- `MainMenu.tsx` — бейдж со статистикой: `contentService.getWordStats(gameId, MEDIUM)`, показывается если `total > 0`.
- `UniversalGameSettings.tsx` — sublabel кнопок сложности через `getWordStats(currentGameId, d)` (инлайн-расчётов больше нет). У Millionaire/Corridor/ConnectFour выбор сложности скрыт (`hideDifficulty`).

## Исправленные баги (2026-05-16)

AliasGame, JustOneGame, WavelengthGame игнорировали `difficulty` при выборе слов — брали все сложности вместе. Исправлено: фильтрация по `useGameSettings().difficulty`.

Spy-статистика использовала `LOCATIONS.length` (все сложности) вместо пула своей сложности. Исправлено.