# Архитектурные улучшения — бэклог

Собрано ревью-агентом 2026-08-16 (промт: «глянь на код, что можно улучшить»). Пункты 1, 2, 5 из
исходного отчёта уже исправлены (см. `.claude/memory/gotchas.md` и git-историю). Здесь — то, что
осталось на потом.

## ~~3. Два несовместимых хука таймера~~ — исправлено 2026-08-16

`useCountdown.ts` удалён; `FakeArtistGame`/`TelestrationsGame` переведены на `useTimer` (start/pause/reset
+ `useEffect`, синхронизирующий `isActive` с производным условием фазы/таймера — см. сами файлы).
Единственный таймер-хук в проекте теперь — `useTimer`.

## ~~4. Составное состояние раунда — россыпь независимых `usePersistedState`~~ — исправлено 2026-08-16

- `DecryptoGame` — `currentCode/clues/interceptGuess/teamGuess` → один `usePersistedState<RoundState>`
  (`roundState`, тип в `types.ts`), сброс на новый раунд — один вызов вместо четырёх.
- `MillionaireGame` — `selectedAnswer/eliminatedOptions/audienceVotes/phoneFriendSuggestion` → один
  `usePersistedState<QuestionState>` (`questionState`), сброс на новый вопрос — один вызов вместо
  четырёх (было в двух местах: `handlePassDone` и `handleContinue`).
- `CodenamesGame` — `redCaptain/blueCaptain/redTeam/blueTeam` → `Roster`, `clueWord/clueCount` → `ClueState`.

`questionIndex`/`usedLifelines`/`currentQuestions` (Millionaire), `redState`/`blueState`/`round`/`activeTeam`/`winner`
(Decrypto), `cards`/`turn`/`phase`/`winner`/`guessesLeft` (Codenames) оставлены отдельными полями —
у каждого своя, отличная от группы жизненная логика (не сбрасываются синхронно с остальными).
`sessionService.saveFields`-батчинг не понадобился — консолидация в один `usePersistedState` уже даёт
один эффект/одну запись на группу.

## ~~6. `GameSettingsContext` — один неразделённый контекст~~ — исправлено 2026-08-16

Разделён на `useCurrentGame()` (навигация) и `useGameConfig()` (сложность/режим), оба значения
мемоизированы. Подробности — `.claude/memory/conventions.md`.

## 7. Небезопасный каст в i18n

`shared/i18n/index.ts:54` — `TRANSLATIONS[lang] as unknown as Record<string, unknown>` — единственный
`as unknown as` во всём mobile-app коде. Выключает проверку типов при резолве ключей перевода —
опечатка в namespace/ключе не ловится компилятором, только в рантайме через фоллбэк.

**Предложение:** либо разобраться, почему обычный `as Record<string, unknown>` не проходит (вложенная
литеральная структура словарей), и оставить точный комментарий-обоснование; либо типизировать
`TRANSLATIONS` так, чтобы каст не требовался вовсе.
