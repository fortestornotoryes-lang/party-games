---
name: bunker-architecture
description: "Архитектура BunkerGame — constants.ts, helpers.ts, types.ts, фазы, SurvivalPhase карточка катастрофы"
metadata:
  type: project
---

## Структура файлов

```
src/games/BunkerGame/
  constants.ts        — игровые константы (не контент)
  helpers.ts          — вычислительные функции игры
  types.ts            — только типы и enum BunkerPhase
  BunkerGame.tsx      — оркестратор фаз
  phases/
    BriefingPhase.tsx
    DictatorRevealPhase.tsx
    RevealPhase.tsx
    DiscussionPhase.tsx
    VotingPhase.tsx
    TribunalPhase.tsx
    FullRevealPhase.tsx
    SurvivalPhase.tsx  — финальная симуляция
  components/
    ResourceContribRow.tsx
```

Контент (катастрофы, профессии, хобби и пр.) — в `src/games/BunkerGame/contents/` (по файлу на константу + index.ts).

---

## constants.ts — что здесь

```ts
Step                  // type = 'team' | 'events' | 'resources' | 'results'
STEP_ORDER            // Step[]
CAPACITY_PCT          // Record<string, number> {easy:0.8, medium:0.6, hard:0.4}
OUTCOME_CONFIG        // Record<SurvivalOutcome, {label, color, bgColor, borderColor, shadow, emoji, icon}>
OUTCOME_COLOR_MAP     // Record<SurvivalOutcome, 'green'|'yellow'|'orange'|'red'>
BUNKER_BASE_RESOURCES // BunkerResources {food:35, water:50, medicine:50, energy:65, morale:65}
BUNKER_DIFFICULTY_OFFSET // Record<DifficultyLevel, number> {easy:10, medium:0, hard:-8}
BUNKER_DIFFICULTY_SCALE  // Record<DifficultyLevel, number> {easy:0.65, medium:1.0, hard:1.35}
RESOURCE_KEYS_CALC    // ResourceKey[]
RESOURCE_META         // {key, emoji, label}[] — порядок: food, water, medicine, energy, morale
```

`OUTCOME_CONFIG` содержит поле `label` (рус.) и `icon` (lucide-компонент) — импортируется в SurvivalPhase.

---

## helpers.ts — что здесь

| Функция | Описание |
|---------|----------|
| `barColor(val)` | hex-цвет по %: ≥60→green, ≥35→yellow, ≥15→orange, else→red |
| `atLeast(current, min)` | сравнение Step-шагов через STEP_ORDER |
| `getHiddenTraits(char, totalRounds)` | черты, НЕ раскрытые к концу игры |
| `getRevealedTrait(char, round)` | какая черта раскрывается в данном раунде |
| `randomAge()` | взвешенный случайный возраст 18-80 |
| `generateCharacter(playerName)` | полный BunkerCharacter с random-атрибутами |
| `getAgeBonuses(age)` | ResourceBonus по возрастной группе |
| `calculateSurvival(team, scenario, events, opts?)` | → `{resources, outcome}` |
| `getRevealedResourceContribution(char, upToRound)` | ресурсный вклад по раскрытым чертам |
| `getPlayerResourceContribution(char)` | суммарный ресурсный вклад персонажа |
| `applyBonus(res, bonus)` | прибавляет бонус к ресурсам (мутирует) |
| `applyBonusScaled(res, bonus, scale)` | то же, но с коэффициентом (мутирует) |

**Важно:** `getHiddenTraits` и `getRevealedTrait` перенесены из `types.ts` в `helpers.ts`.  
Импортировать их нужно из `'../helpers'`, НЕ из `'../types'`.

---

## types.ts — что здесь (только типы)

```ts
BunkerPhase enum      // Briefing, DictatorReveal, RevealPass, Discussion, Voting, Tribunal, FullReveal, SurvivalSim
ResourceKey           // 'food' | 'water' | 'medicine' | 'energy' | 'morale'
DifficultyLevel       // 'easy' | 'medium' | 'hard'
AttributeEntry        // {name, emoji, bonus, tier?, isPositive?}
BunkerCharacter       // полный тип персонажа
CatastropheScenario   // {title, emoji, description, resourcePenalty}
SurvivalEvent         // {title, description, emoji, effect, positive}
BunkerResources       // {food, water, medicine, energy, morale}
SurvivalOutcome       // 'full_victory' | 'partial' | 'pyrrhic' | 'defeat'
TRAIT_LABELS          // Record<string, string>
ALL_TRAIT_KEYS        // readonly TraitKey[]
```

---

## SurvivalPhase — карточка катастрофы

Фаза показывает:
1. **Simulation label** — `СИМУЛЯЦИЯ ВЫЖИВАНИЯ` (sky, Cpu icon)
2. **Catastrophe card** (оранжевая рамка):
   - `scenario.emoji` + `scenario.title` (text-sm font-black)
   - `scenario.description` (text-xs text-white/55)
   - `scenario.resourcePenalty` — теги с эмодзи из RESOURCE_META и значением (`🍎 -15`)
3. **Team**, **Events**, **Resources**, **Results** — поэтапно через setTimeout (800/1500/2000/3000 мс)

Ресурсные штрафы отображаются как розово-красные теги с `tabular-nums`.

---

## Импорты в BunkerGame.tsx

```ts
import {CAPACITY_PCT} from './constants';
import {calculateSurvival, generateCharacter} from '@/games/BunkerGame/helpers.ts';
import {CATASTROPHE_SCENARIOS, SURVIVAL_EVENTS} from '@/games/BunkerGame/contents';
```
