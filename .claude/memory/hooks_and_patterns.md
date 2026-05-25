---
name: hooks-and-patterns
description: "Хуки, утилиты и паттерны для переиспользования — что использовать вместо inline-кода"
metadata:
  type: project
---

## usePlayerCycle — src/hooks/usePlayerCycle.ts

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

## useTimer — src/hooks/useTimer.ts

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

## VIBRATE — src/services/feedbackService.ts

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

## shuffle / pickRandom — src/utils/random.ts

**Всегда использовать** вместо inline `.sort(() => Math.random() - 0.5)`.

```ts
import { shuffle, pickRandom } from '@/utils/random';

const shuffled = shuffle(array);         // новый перемешанный массив (не мутирует)
const item     = pickRandom(array);      // случайный элемент
```

---

## DistributionFlow — раздача ролей

Любой экран "передай телефон → каждый видит свою роль" строится через `DistributionFlow`.

Компонент берёт на себя: state (`currentIndex`, `isRevealed`), ProgressDots, двойной AnimatePresence, PassPhoneCard.
Ты передаёшь только: `getCardStyle` (border/shadow по игроку) и `renderCard` (содержимое раскрытой карточки).

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
