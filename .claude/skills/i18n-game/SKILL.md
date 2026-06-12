---
name: i18n-game
description: Добавляет i18n (RU/EN) к одной игре Party Hub. Аргумент — GameKey игры из src/entities/game/types.ts (spy, fake_artist, resistance, alias, just_one, telestrations, wavelength, codenames, decrypto, mafia, truth_or_dare, connect_four, taboo_reverse, taboo, bunker, millionaire, corridor). Инфраструктура i18n уже создана — скилл только переводит конкретную игру.
---

Ты добавляешь поддержку двух языков (RU / EN) к одной игре Party Hub. Выполни все шаги по порядку, не пропускай ни один.

## Аргумент скила

Аргумент — значение `GameKey` из `src/entities/game/types.ts` (enum `GameKey`), например `alias` или `truth_or_dare`.
Если аргумент не передан — спроси у пользователя.

**Маппинг GameKey → папка игры не всегда очевиден** (например, `spy` → `src/games/SpyHuntGame/`). Найди папку через `GAMES_REGISTRY` в `src/entities/game/registry.tsx` или глобом `src/games/*Game`.

---

## Шаг 0 — Прочитай память проекта

Прочитай `.claude/memory/MEMORY.md` и оттуда — `project_overview.md`, `design_system.md`, `components_ui.md`. Они нужны для понимания архитектуры и Typography-компонентов.

---

## Шаг 1 — Инфраструктура i18n (уже существует)

Инфраструктура создана и работает. **Не пересоздавай её.** Убедись, что файлы на месте, и пойми контракт:

| Файл | Что в нём |
|------|-----------|
| `src/shared/i18n/index.ts` | `LanguageProvider`, хуки `useLanguage()` / `useTranslation()`. Файл `.ts`, поэтому провайдер собран через `React.createElement`, НЕ JSX. Сохранение языка — `storageService.saveSettingsAsync()` |
| `src/shared/i18n/types.ts` | `Lang`, `CommonTranslations`, интерфейсы игр, корневой `Translations` |
| `src/shared/i18n/keys.ts` | Объект `NS` — единственное место, где определены строки неймспейсов |
| `src/shared/i18n/ru.ts` / `en.ts` | Все переводы. Отдельных файлов на игру НЕ бывает |

Контракт `t()`:
- `t('common.back')` — резолв по dot-path; если ключа нет, **возвращается сам путь** (ошибки не будет — опечатки ловятся только глазами и проверкой Шага 4)
- Интерполяция: `t('common.roundN', { n: 3 })` подставляет в `Раунд {{n}}`
- `useTranslation()` возвращает `{ t, lang }`; `useLanguage()` — ещё и `setLang`

Уже сделано (не повторять): `language` в `GameSettings`, обёртка `LanguageProvider` в `App.tsx`, переключатель RU/EN в `Settings.tsx`.

Если какой-то файл инфраструктуры отсутствует — это аномалия: восстанови из git-истории, не пиши с нуля.

---

## Шаг 2 — Обработай конкретную игру

### 2.1 Прочитай все файлы игры

- `src/games/<GameName>Game/<GameName>Game.tsx` (основной компонент)
- `src/games/<GameName>Game/phases/*.tsx` и `components/*.tsx`
- **`constants.ts`, `helpers.ts`, хуки** — UI-строки часто живут и там (например, у Bunker сабтайтлы фаз и названия раундов лежали в константах)

Также прочитай `src/shared/i18n/keys.ts` — какие неймспейсы уже зарегистрированы (это же — список уже переведённых игр).

### 2.2 Составь список всех UI-строк

Выпиши **все хардкодированные русские строки**:
- Текст внутри тегов: `<p>Передай телефон</p>`, `<span>Раунд {n}</span>`
- Атрибуты: `placeholder="Игрок 1"`, `aria-label="Назад"`
- Шаблонные строки: `` `Раунд ${roundNum}` ``
- UI-строки в `constants.ts` / `helpers.ts` (лейблы фаз, подписи кнопок)

**НЕ трогай:**
- Игровой контент (слова Alias, карточки Taboo, вопросы Truth or Dare — данные из `contentService` или контент-константы)
- Имена игроков (динамические данные)
- `title`/`subtitle`/`description`/`modes` в `GAMES_REGISTRY`
- CSS-классы, числа, символы

### 2.3 Сопоставь с `common`

Если строка уже покрыта `common.*` в `ru.ts` — используй `t(\`${NS.COMMON}.back\`)` и НЕ дублируй её в неймспейсе игры. Остальное — в новый namespace.

### 2.4 Создай namespace игры в `src/shared/i18n/types.ts`

Имя неймспейса = значение `GameKey` (например `alias`, `truth_or_dare`). Историческое исключение: игра `spy` уже использует неймспейс `spy_hunt` — не трогай его, но новые делай строго по GameKey.

Добавь интерфейс с комментариями-оригиналами и подключи его в `Translations` **в двух местах** — как optional-поле И в union индекс-сигнатуры:

```ts
export interface AliasTranslations {
    explainFaster: string;    // 'Объясни слово быстрее всех'
    roundScore: string;       // 'За раунд: {{n}}'
    // ...группируй ключи комментариями по файлам-источникам, как в существующих интерфейсах
}

export interface Translations {
    common: CommonTranslations;
    alias?: AliasTranslations;          // ← 1) optional-поле
    [gameKey: string]:
        | Record<string, unknown>
        | CommonTranslations
        | AliasTranslations             // ← 2) добавь в union
        | undefined;
}
```

### 2.5 Зарегистрируй неймспейс в `src/shared/i18n/keys.ts`

```ts
export const NS = {
    COMMON: 'common',
    ALIAS: 'alias',   // ← добавлено
} as const;
```

### 2.6 Добавь переводы в `ru.ts` и `en.ts`

Добавь весь namespace в оба файла, ключи в одинаковом порядке.

**Правила переводов:**
- EN переводы — **реальные**, не транслитерация
- Сохраняй тон: UPPERCASE-заголовки → тоже UPPERCASE в EN
- Переменные: `Раунд {{n}}`, `Ход: {{player}}` — только `{{varName}}`, без конкатенации
- **Плюрализации нет.** Не пиши строк, где русское слово должно согласовываться с числом (`{{n}} побед` ломается на n=1,2). Перефразируй: `Побед: {{n}}`, `Раунд {{n}} из {{total}}`

### 2.7 Замени строки в компонентах игры

В каждом файле:

```ts
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';

// в теле компонента, один раз:
const {t} = useTranslation();
```

Замены — **неймспейс всегда через `NS`**, никогда строкой:

```tsx
// Было:
<p>Передай телефон</p>
subtitle={`Раунд ${roundNum}`}
<p>Объясни слово быстрее всех</p>

// Стало:
<p>{t(`${NS.COMMON}.passPhone`)}</p>
subtitle={t(`${NS.COMMON}.roundN`, {n: roundNum})}
<p>{t(`${NS.ALIAS}.explainFaster`)}</p>
```

Если UI-строка лежала в `constants.ts` — перенеси её в переводы, а в константе храни **ключ** (или перенеси текст в компонент через `t()`), чтобы в константах не осталось русского UI-текста.

### 2.8 Замени сырой текст на Typography-компоненты (попутно)

Если в компонентах игры есть сырые `<p>`, `<h2>`, `<span>` с текстом — замени на `<Typography.X>` согласно дизайн-системе:

| Было | Стало |
|------|-------|
| `<h2 className="text-2xl font-black ...">` | `<Typography.Heading>` |
| `<p className="text-sm text-white/50">` | `<Typography.Body color="faint">` |
| `<span className="text-tag font-black uppercase tracking-...">` | `<Typography.Label>` |
| `<p className="text-4xl font-black italic uppercase">` | `<Typography.Display>` |

Только там, где Typography подходит по семантике. Не трогай кнопки, badge-элементы, уникально стилизованные элементы.

---

## Шаг 3 — Проверка

1. `npx tsc --noEmit` — нет ошибок.
2. **Механический поиск пропущенных строк** — кириллица в файлах игры:
   ```
   rg -n "[А-Яа-яЁё]" src/games/<GameName>Game --glob '!*content*'
   ```
   Каждое совпадение — либо игровой контент / комментарий (ок), либо пропущенная UI-строка (исправь).
3. Количество и порядок ключей в namespace игры в `ru.ts` и `en.ts` совпадают.
4. Ни один ключ неймспейса игры не дублирует `common.*`.
5. В компонентах нет магических строк `t('alias.xxx')` — только `` t(`${NS.ALIAS}.xxx`) ``. Проверь: `rg "t\('" src/games/<GameName>Game`.

---

## Шаг 4 — Итог

Краткий отчёт:
- Изменённые/созданные файлы
- Сколько строк заменено на `t()`
- Новые ключи namespace (список)
- Использованные ключи `common.*`
- Что пропущено намеренно (игровой контент, имена игроков)

---

## Правила которые НЕЛЬЗЯ нарушать

- `import {useTranslation} from '@/shared/i18n'` и `import {NS} from '@/shared/i18n/keys'` — всегда такие пути
- Строка неймспейса определяется **только** в `keys.ts` в объекте `NS` — нигде больше
- В компонентах всегда шаблонная строка: `` t(`${NS.TABOO}.key`) `` — никогда `t('taboo.key')`
- Имя нового неймспейса = значение `GameKey` (исключение `spy_hunt` — историческое, не повторять)
- Не трогать `contentService` и контент-константы — это игровой контент, не UI
- Не переводить `GAMES_REGISTRY` (только игровые экраны)
- Не создавать отдельные файлы типа `aliasTranslations.ts` — всё в `ru.ts` / `en.ts`
- Namespace игры в `types.ts` всегда optional (`alias?`) + добавлен в union индекс-сигнатуры
- Переменные — только `{{varName}}`; строк, требующих русского склонения по числу, не писать
- Один `const {t} = useTranslation()` в теле компонента, не внутри JSX
- Не пересоздавать инфраструктуру `src/shared/i18n/*` — она уже существует