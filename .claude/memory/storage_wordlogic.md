---
name: storage-wordlogic
description: "storageService gameId-ключи, паттерн дублирования логики слов в играх, исправленные difficulty-баги"
metadata: 
  node_type: memory
  type: project
  originSessionId: d8d0259b-432b-4531-b05b-0589b8f60792
---

## storageService — gameId-ключи

Используемые строки-ключи (должны совпадать везде):
`'spy'`, `'alias'`, `'just_one'`, `'fake_artist'`, `'wavelength'`, `'telestrations'`, `'codenames'`, `'decrypto'`

Хранилища: `PLAYERS`, `USED_WORDS`, `CUSTOM_WORDS`, `SETTINGS`, `SETTINGS_{gameId}` (game config).

## Паттерн: все игры используют contentService

Все игры делегируют выбор слов/контента в `contentService`. Inline-логика выбора слов в игровых компонентах — антипаттерн, миграция завершена.

| Игра | Метод contentService |
|------|---------------------|
| AliasGame | `getAliasWords(difficulty)` → возвращает filtered array, маркировка через `markWordAsUsed` вручную в игре |
| JustOneGame | `getJustOneWord(difficulty)` → одно слово, авто-маркировка |
| WavelengthGame | `getWavelengthPair(difficulty)` → пара строк, авто-маркировка |
| FakeArtistDistribution | `getFakeArtistWord(difficulty)` → `{word, category}`, авто-маркировка |
| TelestrationsGame | `getTelestrationsWord(difficulty)` → одно слово, авто-маркировка |
| CodenamesGame | `getCodenamesWords(difficulty)` → 25 слов, авто-маркировка всех 25 |
| DecryptoGame | `getDecryptoWords(difficulty, count)` → N слов, авто-маркировка |
| SpyHuntGame | `getSpyHuntLocation(difficulty)` → `LocationInfo {name, roles}`, авто-маркировка |

**How to apply:** при изменении логики слов для любой игры — редактировать метод в `contentService.ts`. Не добавлять inline-логику в компоненты.

## Отображение оставшихся слов в UniversalGameSettings (2026-05-16)

`UniversalGameSettings` показывает кол-во свободных слов прямо в кнопках сложности (sublabel):

- **spy**: `"10 мин · 8"` — таймер + кол-во незыгранных локаций в пуле этой сложности
- **fake_artist**: `"100 сл"` — кол-во незыгранных слов в пуле этой сложности

Расчёт происходит инлайн в `UniversalGameSettings.tsx` через `getRemainingWords(d: Difficulty)`:
```ts
// spy
const used = storageService.getUsedWords('spy');
return LOCATIONS_BY_DIFFICULTY[d].filter(l => !used.includes(l.name)).length;

// fake_artist
const used = storageService.getUsedWords('fake_artist');
return FAKE_ARTIST_DATA_BY_DIFFICULTY[d].filter(w => !used.includes(w.word)).length;
```

Кастомные слова (getCustomWords) в этот счёт **не включены** — только пресет-пул.
Счётчик обновляется при каждом открытии настроек (нет useState/useEffect — чистый расчёт при рендере).

## Исправленные баги (2026-05-16)

AliasGame, JustOneGame, WavelengthGame игнорировали `difficulty` при выборе слов — брали все сложности вместе. Исправлено: каждая игра теперь фильтрует по `useGameSettings().difficulty`.

`contentService.getRemainingWordsCount` для `'spy'` использовал `LOCATIONS.length` (все сложности) вместо `LOCATIONS_BY_DIFFICULTY[difficulty].length`. Исправлено.
