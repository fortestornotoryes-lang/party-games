---
name: i18n-game
description: Добавляет i18n (RU/EN) к одной игре Party Hub. Аргумент — GameKey игры (alias, taboo, taboo_reverse, spy_hunt, fake_artist, resistance, telestrations, wavelength, codenames, decrypto, just_one, truth_or_dare, connect_four). При первом вызове автоматически создаёт всю i18n-инфраструктуру.
---

Ты добавляешь поддержку двух языков (RU / EN) к одной игре Party Hub. Выполни все шаги по порядку, не пропускай ни один.

## Аргумент скила

Аргумент — `GameKey` игры в snake_case, например `alias` или `truth_or_dare`.  
Если аргумент не передан — спроси у пользователя.

---

## Шаг 0 — Прочитай память проекта

Прочитай `.claude/memory/MEMORY.md` и оттуда — `project_overview.md`, `design_system.md`, `components_ui.md`. Они нужны для понимания архитектуры.

---

## Шаг 1 — Проверь, существует ли инфраструктура i18n

Проверь наличие файла `src/i18n/index.ts`.

- **Если НЕ существует** → выполни Шаг 2 (создание инфраструктуры), затем перейди к Шагу 3.
- **Если существует** → пропусти Шаг 2, сразу к Шагу 3.

---

## Шаг 2 — Создай инфраструктуру i18n (только один раз)

### 2.1 `src/i18n/types.ts`

```ts
export type Lang = 'ru' | 'en';

/** Базовые переводы — common-строки, используемые везде */
export interface CommonTranslations {
  back: string;
  done: string;
  next: string;
  start: string;
  correct: string;
  skip: string;
  rematch: string;
  stopGame: string;
  round: string;            // "Раунд"
  roundN: string;           // "Раунд {{n}}"
  score: string;
  winner: string;
  draw: string;
  player: string;
  players: string;
  team: string;
  teams: string;
  passPhone: string;        // "Передай телефон"
  yourTurn: string;
  gameOver: string;
  win: string;
  wins: string;             // "{{n}} побед"
  vs: string;
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
}

/**
 * Корневой тип переводов.
 * При добавлении новой игры — добавь её namespace сюда.
 */
export interface Translations {
  common: CommonTranslations;
  // Игры добавляются инкрементально:
  // alias?: AliasTranslations;
  // taboo?: TabooTranslations;
  // ...
  [gameKey: string]: Record<string, unknown> | CommonTranslations;
}
```

### 2.2 `src/i18n/ru.ts`

```ts
import type { Translations } from './types';

export const ru: Translations = {
  common: {
    back: 'Назад',
    done: 'Готово',
    next: 'Далее',
    start: 'Старт',
    correct: 'Правильно',
    skip: 'Пропустить',
    rematch: 'Реванш',
    stopGame: 'Завершить игру',
    round: 'Раунд',
    roundN: 'Раунд {{n}}',
    score: 'Очки',
    winner: 'Победитель',
    draw: 'Ничья',
    player: 'Игрок',
    players: 'Игроки',
    team: 'Команда',
    teams: 'Команды',
    passPhone: 'Передай телефон',
    yourTurn: 'Твой ход',
    gameOver: 'Игра окончена',
    win: 'Победа',
    wins: '{{n}} побед',
    vs: 'vs',
    difficulty: {
      easy: 'Легко',
      medium: 'Нормально',
      hard: 'Сложно',
    },
  },
};
```

### 2.3 `src/i18n/en.ts`

```ts
import type { Translations } from './types';

export const en: Translations = {
  common: {
    back: 'Back',
    done: 'Done',
    next: 'Next',
    start: 'Start',
    correct: 'Correct',
    skip: 'Skip',
    rematch: 'Rematch',
    stopGame: 'End Game',
    round: 'Round',
    roundN: 'Round {{n}}',
    score: 'Score',
    winner: 'Winner',
    draw: 'Draw',
    player: 'Player',
    players: 'Players',
    team: 'Team',
    teams: 'Teams',
    passPhone: 'Pass the phone',
    yourTurn: 'Your turn',
    gameOver: 'Game Over',
    win: 'Win',
    wins: '{{n}} wins',
    vs: 'vs',
    difficulty: {
      easy: 'Easy',
      medium: 'Normal',
      hard: 'Hard',
    },
  },
};
```

### 2.4 `src/i18n/index.ts`

```ts
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Lang, Translations } from './types';
import { ru } from './ru';
import { en } from './en';
import { storageService } from '../services/storageService';

const TRANSLATIONS: Record<Lang, Translations> = { ru, en };

// ── Dot-notation path resolver ───────────────────────────────────────────────

function resolve(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : path;
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

// ── Context ───────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (storageService.getSettings().language as Lang) ?? 'ru';
  });

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storageService.saveSettings({ language: next });
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const translations = TRANSLATIONS[lang] as unknown as Record<string, unknown>;
      const str = resolve(translations, path);
      return interpolate(str, vars);
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Используй в компонентах для доступа к t(), lang и setLang */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

/** Алиас — возвращает только t() для компонентов, которым не нужен lang */
export function useTranslation() {
  const { t, lang } = useLanguage();
  return { t, lang };
}
```

### 2.5 Добавь `language` в `storageService.ts`

В интерфейс `GameSettings` добавь поле:
```ts
language?: string;
```

### 2.6 Оберни `AppContent` в `LanguageProvider` (`src/App.tsx`)

```tsx
// импорт
import { LanguageProvider } from './i18n';

// обёртка
export default function App() {
  return (
    <GameSettingsProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </GameSettingsProvider>
  );
}
```

### 2.7 Добавь переключатель языка в `Settings.tsx`

Прочитай файл. Найди блок с переключателями (vibration, sounds, visualEffects). Добавь аналогичный переключатель для языка рядом с ними:

```tsx
import { useLanguage } from '../i18n';

// внутри компонента:
const { lang, setLang } = useLanguage();

// UI — добавь блок переключения RU / EN рядом с другими настройками:
<div className="flex items-center justify-between py-4 border-b border-white/5">
  <div>
    <p className="font-semibold text-white text-sm">Язык / Language</p>
  </div>
  <div className="flex gap-2">
    {(['ru', 'en'] as const).map(l => (
      <button
        key={l}
        onClick={() => setLang(l)}
        className={`px-4 py-2 rounded-premium-sm text-xs font-black uppercase tracking-wider transition-all ${
          lang === l
            ? 'bg-white/15 text-white border border-white/25'
            : 'bg-white/5 text-white/30 border border-white/5'
        }`}
      >
        {l === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
      </button>
    ))}
  </div>
</div>
```

---

## Шаг 3 — Обработай конкретную игру

### 3.1 Прочитай все файлы игры

Найди и прочитай:
- `src/games/<GameName>Game/<GameName>Game.tsx` (основной компонент)
- `src/games/<GameName>Game/phases/*.tsx` (все фазы)
- `src/games/<GameName>Game/components/*.tsx` (компоненты, если есть)

### 3.2 Составь список всех UI-строк

Пройди по каждому файлу и выпиши **все хардкодированные русские строки** в JSX:
- Текст внутри тегов: `<p>Передай телефон</p>`, `<span>Раунд {n}</span>`
- Атрибуты: `placeholder="Игрок 1"`, `aria-label="Назад"`
- Шаблонные строки: `` `Раунд ${roundNum}` ``

**НЕ трогай:**
- Игровой контент (слова Alias, карточки Taboo, вопросы Truth or Dare — это strings из `contentService`)
- Имена игроков (динамические данные)
- CSS-классы и технические строки
- Числа и символы

### 3.3 Определи, какие строки уже есть в `common`

Сопоставь найденные строки с ключами `common.*` в `ru.ts`. Если строка уже покрыта `common` — используй `t('common.back')` и т.д. Для строк, специфичных для игры — создай новый namespace.

### 3.4 Создай namespace игры в `src/i18n/types.ts`

Добавь интерфейс и его в `Translations`. Пример для `alias`:

```ts
export interface AliasTranslations {
  teams: {
    red: string;   // "Красные"
    blue: string;  // "Синие"
  };
  explainFaster: string;    // "Объясни слово быстрее всех"
  roundScore: string;       // "За раунд: {{n}}"
  teamScore: string;        // "Счёт команды"
  winScore: string;         // "До {{n}} очков"
  correct: string;          // "✓ УГАДАНО" (если отличается от common)
  // ...все остальные строки
}

// В Translations:
alias?: AliasTranslations;
```

Важно: делай namespace `optional` (`alias?`) — пока остальные игры не обработаны, их ключей нет.

### 3.5 Добавь переводы в `ru.ts` и `en.ts`

Добавь весь namespace в конец объекта в обоих файлах:

```ts
// ru.ts
alias: {
  teams: { red: 'Красные', blue: 'Синие' },
  explainFaster: 'Объясни слово быстрее всех',
  roundScore: 'За раунд: {{n}}',
  // ...
},

// en.ts
alias: {
  teams: { red: 'Red Team', blue: 'Blue Team' },
  explainFaster: 'Explain the word faster than anyone',
  roundScore: 'This round: {{n}}',
  // ...
},
```

**Правила переводов:**
- EN переводы должны быть **реальными**, не транслитерацией
- Сохраняй тон: UPPERCASE-заголовки → тоже UPPERCASE в EN
- Строки с переменными: `Раунд {{n}}`, `Ход: {{player}}`
- Если строка уже есть в `common` — НЕ дублируй в namespace игры

### 3.6 Замени строки в компонентах игры

В каждом файле игры:

1. Добавь импорт хука:
```ts
import { useTranslation } from '@/i18n';
```

2. Деструктурируй в компоненте:
```ts
const { t } = useTranslation();
```

3. Замени хардкодированные строки:
```tsx
// Было:
<p>Передай телефон</p>
<span>Раунд {roundNum}</span>
<button>Назад</button>

// Стало:
<p>{t('common.passPhone')}</p>
<span>{t('common.roundN', { n: roundNum })}</span>
<button>{t('common.back')}</button>
```

4. Шаблонные строки в JSX-атрибутах:
```tsx
// Было:
subtitle={`Раунд ${roundNum}`}

// Стало:
subtitle={t('common.roundN', { n: roundNum })}
```

### 3.7 Замени сырой текст на Typography-компоненты (попутно)

Если в компонентах игры есть сырые `<p>`, `<h2>`, `<span>` с текстом — замени на `<Typography.X>` согласно дизайн-системе:

| Было | Стало |
|------|-------|
| `<h2 className="text-2xl font-black ...">` | `<Typography.Heading>` |
| `<p className="text-sm text-white/50">` | `<Typography.Body color="faint">` |
| `<span className="text-[10px] font-black uppercase tracking-...">` | `<Typography.Label>` |
| `<p className="text-4xl font-black italic uppercase">` | `<Typography.Display>` |

Делай это только там, где Typography подходит по семантике. Не трогай кнопки, badge-элементы, элементы с уникальной стилизацией.

---

## Шаг 4 — Проверка

1. Запусти `npx tsc --noEmit` — нет ошибок.
2. Убедись, что в `ru.ts` и `en.ts` количество ключей в namespace игры совпадает.
3. Убедись, что ни одна строка-ключ не дублирует `common.*`.

---

## Шаг 5 — Итог

Напиши краткий отчёт:
- Какие файлы изменены / созданы
- Сколько строк заменено на `t()`
- Новые ключи в namespace (список)
- Ключи `common.*`, которые использовала эта игра
- Что пропущено намеренно (игровой контент, имена игроков)

---

## Правила которые НЕЛЬЗЯ нарушать

- `import { useTranslation } from '@/i18n'` — всегда такой путь
- Не трогать `contentService` — это игровой контент, не UI
- Не переводить имена игр в `GAMES_REGISTRY` (только игровые экраны)
- Не создавать отдельные файлы типа `aliasTranslations.ts` — всё в `ru.ts` / `en.ts`
- Namespace игры в `types.ts` всегда `optional` (`alias?`)
- Переменные в строках — только через `{{varName}}`, не через конкатенацию
- При добавлении `useTranslation()` в компонент — один `const { t } = useTranslation()` в теле, не внутри JSX