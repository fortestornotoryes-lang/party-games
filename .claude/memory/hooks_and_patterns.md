---
name: hooks-and-patterns
description: "Хуки, утилиты и паттерны для переиспользования — что использовать вместо inline-кода"
metadata:
  type: project
---

> ⚠️ Пути обновлены после FSD-миграции: хуки — `@/shared/hooks/*`, утилиты — `@/shared/helpers/*`, сервисы — `@/shared/services/*`, фичи — `@/features/*`.

## usePlayerCycle — @/shared/hooks/usePlayerCycle

Циклический перебор игроков. Заменяет паттерн `idx → (idx+1) % n`.

```ts
const { current, idx, isLast, next, reset } = usePlayerCycle(playerNames);
```

| | |
|---|---|
| `current` | текущий элемент (`items[idx]`) |
| `idx` | числовой индекс (используй в `useEffect([idx])`) |
| `isLast` | `idx === items.length - 1` |
| `next()` | переходит к следующему (с wrap) |
| `reset()` | возвращает в 0 |

Используется в: WavelengthGame, TruthOrDareGame, JustOneGame.

---

## useTimer — @/shared/hooks/useTimer

Таймер с обратным отсчётом и `onTimeUp` колбэком.

```ts
const { timeLeft, start, reset } = useTimer({
  initialTime: cardTimer,
  onTimeUp: handleTimeUp,
});

// Запуск:
resetTimer(cardTimer);
startTimer();
```

**Важно:** если `onTimeUp` зависит от меняющегося state (напр. `isBlitz`), оберни его в `useCallback([isBlitz])` перед передачей в `useTimer`.

Используется в: AliasGame, TabooGame, TabooReverseGame.

---

## VIBRATE — @/shared/services/feedbackService

Стандартизированные паттерны вибрации. **Всегда использовать эти константы** вместо числовых литералов.

```ts
import { feedbackService, VIBRATE } from '@/services/feedbackService';

feedbackService.vibrate(VIBRATE.correct);   // [50, 30, 50] — правильный ответ
feedbackService.vibrate(VIBRATE.error);     // 100 — ошибка
feedbackService.vibrate(VIBRATE.win);       // [100, 50, 100] — победа
feedbackService.vibrate(VIBRATE.timeout);   // [80, 40, 80] — время вышло
feedbackService.vibrate(VIBRATE.tap);       // 10 — обычный тап
feedbackService.vibrate(VIBRATE.celebrate); // [50, 30, 50, 30, 50] — праздник
```

---

## shuffle / pickRandom / randomInt — @/shared/helpers/random

**Всегда использовать** вместо inline `.sort(() => Math.random() - 0.5)`.

```ts
import { shuffle, pickRandom } from '@/shared/helpers/random';

const shuffled = shuffle(array);         // новый перемешанный массив (не мутирует)
const item     = pickRandom(array);      // случайный элемент
```

---

## contentPool — @/shared/helpers/contentPool

Пул контента с авто-сбросом при исчерпании (фильтр used → reset → пометить). Заменяет дословный паттерн в model-файлах игр. Используется в Alias, JustOne, Telestrations, TruthOrDare, Wavelength, FakeArtist, Codenames, Decrypto.

```ts
availableFromPool(gameId, pool, { keyOf?, minRemaining=1 })   // фильтр+reset, без пометки (Alias)
drawFromPool(gameId, pool, { keyOf? })                        // +pickRandom+mark (single draw)
drawBatchFromPool(gameId, pool, count, { keyOf?, minRemaining=count }) // +shuffle+slice+mark all (Codenames 25, Decrypto count)
```
`keyOf` — ключ для used-хранилища (default `String`); для объектов/пар: `{ keyOf: x => x.word }`, `{ keyOf: wavelengthPairKey }`.

---

## splitInHalf — @/shared/helpers/teams

`splitInHalf(items): [T[], T[]]` — делит на две части (`Math.ceil(len/2)`), первая получает лишний элемент. Для разбиения перемешанных игроков на команды. Используется в Alias, Decrypto, Codenames (передаёт `rest` после капитанов). TabooReverse использует свой even/odd-сплит.

---

## cardDeck (Taboo) — @/shared/helpers/cardDeck

Колода карт по id+word+difficulty с авто-сбросом. Общая для TabooGame и TabooReverseGame.

```ts
buildUsedCardIds(gameId, cards, difficulty): Set<number>   // восстановить сыгранные id из used-слов
advanceUsedDeck(gameId, cards, difficulty, used, currentCard): ReadonlySet<number>  // пометить/сбросить, вернуть новый used-set
```
Игры сами вызывают `setUsedCardIds`/`setCard` с результатом.

---

## DistributionFlow — раздача ролей — @/features/role-distribution/components/DistributionFlow

Любой экран "передай телефон → каждый видит свою роль" строится через `DistributionFlow`.

Компонент берёт на себя: state (`currentIndex`, `isRevealed`), ProgressDots, двойной AnimatePresence, PassPhoneCard.
Ты передаёшь только: `getCardStyle` (border/shadow по игроку) и `renderCard` (содержимое раскрытой карточки).

Содержимое `renderCard` строй через каркас `@/features/role-distribution/components/RoleRevealCard`:
- `<RoleRevealCard gradientClassName glowClassName glowColor>` — градиент-подложка + верхнее свечение + контейнер;
- `<RoleRevealPanel>` — анимированная панель одной роли (шапка/тело/кнопка);
- `<RoleRevealButton onClick colorClassName style?>` — кнопка «дальше/начать» с общими стилями.
Используется в FakeArtistDistribution, ResistanceDistribution, RoleDistribution (SpyHunt). Типографику/тело каждая игра задаёт сама.

См. [[components-ui]] для полного API.

---

## TabooPassPhase — Pass-фаза с табло

Для любой игры с таймером и очками, где нужно передать телефон перед ходом:

```tsx
<TabooPassPhase
  accentColor="red"|"orange"
  icon={Ban}
  instruction="..."
  playerNames={...} scores={...} currentExplainer={...}
  teams={...}  // опционально
  onStart={...}
/>
```

---

## Паттерны которых НЕ должно быть

| Антипаттерн | Замена |
|---|---|
| `useState(0)` + `(i+1) % n` | `usePlayerCycle` |
| `setInterval` таймер в компоненте | `useTimer` |
| `.sort(() => Math.random() - 0.5)` | `shuffle()` |
| `arr[Math.floor(Math.random() * arr.length)]` | `pickRandom()` |
| `feedbackService.vibrate(100)` | `feedbackService.vibrate(VIBRATE.error)` |
| Inline полоска прогресса таймера | `<TimerBar pct={...} color={...} />` |
| Inline motion-точки индикаторов | `<ProgressDots count={...} current={...} />` |
| Inline "Игрок объясняет + таймер" | `<PlayingHeader explainer={...} timeLeft={...} timerColor={...} />` |
| Inline sorted score list | `<PlayerScoreList players={...} scores={...} />` |
| Inline ranked leaderboard | `<LeaderboardList players={...} scores={...} />` |
| Inline кнопка "Завершить игру" | `<StopGameButton onClick={...} />` |
| Inline фильтр used + reset пула слов | `availableFromPool`/`drawFromPool`/`drawBatchFromPool` ([[hooks-and-patterns]] contentPool) |
| Inline `Math.ceil(len/2)` + slice на команды | `splitInHalf()` |
| Inline mark/reset колоды карт (Taboo) | `buildUsedCardIds`/`advanceUsedDeck` (cardDeck) |
| Inline gradient+glow+кнопка в renderCard раздачи | `RoleRevealCard`/`RoleRevealPanel`/`RoleRevealButton` |
