# Веб: две новые игры — «Две правды и одна ложь» и «Кто из нас»

Статус: реализовано в вебе (2026-10-18), **в RN не перенесено**. Этот файл — список того, что нужно повторить в `mobile-app/` при переносе.

## Что добавлено в вебе

| Игра | GameKey | Папка | Игроки | Тема |
|---|---|---|---|---|
| Две правды и одна ложь | `two_truths` | `src/games/TwoTruthsGame/` | 3+ | `teal` |
| Кто из нас | `who_among_us` | `src/games/WhoAmongUsGame/` | 3+ | `pink` |

Обе без сложности (`hasDifficulty: false`) и без декларативных настроек (`settings`). Режимов нет.

### Файлы веба

- `TwoTruthsGame/`: `types.ts` (фазы const-объектом), `constants.ts`, `helpers.ts` (чистая логика: `isStatementsReady`, `scoreTwoTruthsRound`, `addScores`), `TwoTruthsGame.tsx` (все фазы inline).
- `WhoAmongUsGame/`: `types.ts`, `constants.ts`, `helpers.ts` (`tallyVotes`, `getTopPlayers`, `scoreWhoAmongUsRound`, `addScores`), `content.ts` (40 вопросов `WHO_AMONG_US_QUESTIONS`), `model/whoAmongUsContent.ts` (`getWhoAmongUsQuestion` через `drawFromPool`), `WhoAmongUsGame.tsx`.
- Регистрация: `entities/game/types.ts` (GameKey), `entities/game/registry.tsx` (структура, иконки `Ghost` / `Vote`), `entities/game/instructions.ts` (ru + en), `pages/game/GamePlayRoute.tsx` (lazy + маппинг), `shared/i18n/keys.ts` (NS), `shared/i18n/types.ts`, `shared/i18n/ru.ts`, `shared/i18n/en.ts`.

## Игровая логика (переносить 1:1)

### Две правды и одна ложь

- Фазы: `Pass → Writing → Voting → Reveal → (Pass | Finish)`. Значения фаз — строки `pass`, `writing`, `voting`, `reveal`, `finish` (нельзя менять — ломается восстановление сессии).
- Рассказчик — `usePlayerCycle`; голосуют все, кроме него (`voters = players.filter(p => p !== storyteller)`).
- Раундов = число игроков; игра заканчивается, когда каждый рассказал по разу.
- Очки (`helpers.ts`): угадавший ложь +1 (`POINTS_FOR_CORRECT_GUESS`), рассказчик +1 за каждого, кто выбрал правду (`POINTS_FOR_FOOLED`). Очки начисляются один раз — в момент перехода в `Reveal`.
- Валидация «Показать всем»: все 3 утверждения непустые и отмечена ложь (`isStatementsReady`).
- Длина утверждения ограничена `STATEMENT_MAX_LENGTH = 120`.
- Сохраняемые поля сессии: `storytellerIdx`, `phase`, `roundsPlayed`, `statements`, `lieIndex`, `guesses`, `voterIdx`, `scores`. Не сохраняется: `voterReady` (экран «передай телефон» показывается заново после F5).

### Кто из нас

- Фазы: `Question → Voting → Result → (Question | Finish)`. Строки `question`, `voting`, `result`, `finish`.
- Раундов: `ROUNDS_COUNT = 5`.
- Голосуют все игроки; за себя голосовать нельзя (список кандидатов = игроки минус голосующий).
- Подсчёт (`tallyVotes`): сколько раз каждого выбрали. Лидеры (`getTopPlayers`) получают `POINTS_FOR_TOP = 1` каждый; при нулевых голосах лидеров нет.
- Вопрос раунда сохраняется в сессии (`question`), чтобы F5 не менял его; новый берётся при переходе к следующему раунду.
- Сохраняемые поля: `phase`, `roundNo`, `question`, `votes`, `voterIdx`, `scores`. `voterReady` — не сохраняется.

## UI-правила (важно для RN)

- **Передача телефона**: и там и там используется `PassPhoneCard` (карточка «передай телефон», нажатие — показать экран игрока). В RN — аналогичный компонент из `mobile-app/`, те же пропсы: `playerName`, `playerLabel`, `instruction`, `icon`, `onClick`.
- **Голосование по одному телефону**: после `PassPhoneCard` — экран выбора, после выбора — следующий голосующий. Никаких hover-эффектов (на тач-устройствах их нет).
- **Переходы фаз** (веб: `AnimatePresence mode="wait"` + `motion.div` с `key`):
  - в RN использовать `AnimatePresence` из moti с `exitBeforeEnter` (см. `docs/react-native-migration.md` и gotchas про `transition.type`);
  - у каждого `MotiView` с `exit` обязательно явный `transition={{ type: 'timing', duration: 200 }}` — иначе пустой экран между фазами;
  - на экране голосования `key` включает `voterIdx` и `voterReady`, чтобы каждая смена голосующего анимировалась.
- **Карточки утверждений и игроков** — `glass-card` (веб) → эквивалент из UI-кита RN. Кнопки голосования — полная ширина (`WhoAmongUs`: сетка 2 колонки → в RN `flex-row flex-wrap` + `width: '50%'`, по паттерну из `docs/react-native-migration.md`).
- **Длинные имена и утверждения** — перенос текста (`break-words` на вебе → `flexShrink: 1` + перенос в RN). Имена игроков и утверждения произвольной длины, проверять на 360 px.
- **Полоски голосов** (`WhoAmongUs`, фаза Result): ширина в процентах от максимума, `max(1, …)` чтобы не делить на ноль.
- **Таблица очков** (финал обеих игр): сортировка по очкам по убыванию.
- Звук: `feedbackService.playSound('success')` при переходе в `Reveal` (`TwoTruths`) и в `Result` (`WhoAmongUs`). Вибрации и конфетти в этих играх нет.

## i18n (ключи, которые нужно перенести в `mobile-app/`)

Имена неймспейсов: `two_truths`, `who_among_us` (в `NS.TWO_TRUTHS`, `NS.WHO_AMONG_US`).

- `registry.games.two_truths` / `registry.games.who_among_us`: `title`, `subtitle`, `placeholder`, `description` (ru + en).
- Неймспейсы игр — полный список ключей в `src/shared/i18n/types.ts` (`TwoTruthsTranslations`, `WhoAmongUsTranslations`), значения — в `ru.ts` / `en.ts`.
- Инструкции — `GAME_INSTRUCTIONS` и `GAME_INSTRUCTIONS_EN` в `src/entities/game/instructions.ts` (по 3 блока на игру).
- Общие ключи, которые используются: `common.roundN`, `common.gameOver`.

## Контент

- Вопросы «Кто из нас» — `src/games/WhoAmongUsGame/content.ts`. Тексты русские, переводить на en не нужно, если в RN не требуется английский контент (по соглашению проекта контент-пулы не переводятся).
- Пул used-слов: ключ игры `who_among_us` (через `storageService`, как у остальных пулов). Перенос — той же функцией `drawFromPool`.
- «Две правды и одна ложь» контента не имеет — утверждения пишут игроки.

## Чек-лист переноса в `mobile-app/`

1. Скопировать `types.ts`, `constants.ts`, `helpers.ts`, `content.ts`, `model/whoAmongUsContent.ts` без изменений (чистая логика, без React).
2. Добавить `GameKey` значения `two_truths` и `who_among_us` в RN-версию `GameKey`.
3. Перенести записи реестра (иконка `Ghost` / `Vote`, тема, `players`, `minPlayers: 3`, `hasDifficulty: false`).
4. Перенести ключи i18n (ru + en) и инструкции.
5. Реализовать экраны на `PassPhoneCard`, `GameHeader`, `PrimaryButton` и moti-переходах по правилам выше.
6. Подключить в маппинг экранов игр RN (`app/game/[gameKey]/play.tsx` → `GAME_COMPONENTS`).
7. Проверить: F5-эквивалент (перезапуск приложения) посреди голосования — состояние восстанавливается; экран 360 px с длинными именами; смена игроков в Setup сбрасывает сессию.
8. Запустить `mobile-app` lint и тесты (`logic-test-writer` для `helpers.ts`).

## Открытые вопросы

- Нужна ли в RN версии английская локализация контента (вопросы «Кто из нас»)? Сейчас ответ — нет, по соглашению проекта.
- Веб-версия не имеет тестов на `helpers.ts` обеих игр — стоит покрыть при переносе.
