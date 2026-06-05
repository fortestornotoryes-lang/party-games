---
name: components-ui
description: "Справочник UI-компонентов: Setup, GameHeader, PassPhoneCard, DrawingCanvas, UI.tsx, атомарные переиспользуемые компоненты"
metadata: 
  node_type: memory
  type: project
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## UI.tsx — все экспорты

### PrimaryButton
```tsx
<PrimaryButton
  onClick={fn}
  variant="white"|"premium"|"red"|"blue"|"emerald"|"purple"|"outline"
  icon={LucideIcon}
  disabled={bool}
  type="button"|"submit"
>
  Текст кнопки
</PrimaryButton>
```
Внутри вызывает `feedbackService.playSound('click')` и `vibrate(VIBRATE.tap)`.

### GameCard
```tsx
<GameCard title="Заголовок" className="..." onClick={fn}>
  children
</GameCard>
```
Базово: `glass-card rounded-premium-lg p-7`. `p-0` в className НЕ переопределит `p-7` из-за порядка в CSS — передавать `className` только для доп. стилей.

### SectionLabel
```tsx
<SectionLabel>Метка секции</SectionLabel>
```
`text-label font-black uppercase tracking-[0.5em] text-white/80 italic`

### Badge
```tsx
<Badge variant="default"|"outline">Текст</Badge>
```

### IconButton
```tsx
<IconButton onClick={fn} icon={LucideIcon} variant="ghost"|"filled"|"danger" />
```

### TextInput
```tsx
<TextInput placeholder="..." value={v} onChange={fn} />
```
`h-14 glass-card rounded-premium-md px-6`

### Typography (src/components/Typography.tsx, re-exported from UI.tsx)

7 компонентов, все принимают `color?: TypoColor`, `align?: TypoAlign`, `as?: AsElement`, `className?`.

**TypoColor:** `white` | `body`(white/80) | `muted`(white/50) | `faint`(white/25) | `dimmer`(white/15) | `red` | `blue` | `green` | `sky` | `orange` | `yellow` | `purple`

**TypoAlign:** `left` | `center` | `right`

```tsx
// Hero-текст: имена, роли, победители. font-black italic uppercase
<Typography.Display size="sm|md|lg|xl|2xl" color="white" glow align="center">ПОБЕДА!</Typography.Display>
// sm=36px, md=48px, lg=60px, xl=70px, 2xl=88px | glow — textShadow цветом

// Заголовок экрана (h1). font-black uppercase italic
<Typography.Title size="sm|md|lg|xl" color="white">ЗАГОЛОВОК</Typography.Title>
// sm=20px, md=28px(default), lg=30px, xl=36px

// Подзаголовок/блок (h2). font-black italic uppercase
<Typography.Heading size="xs|sm|md|lg" color="white">Подзаголовок</Typography.Heading>
// xs=16px, sm=18px, md=24px(default), lg=30px

// Мелкий uppercase-тег: роли, метки. font-black uppercase
<Typography.Label size="xs|sm|md" color="muted">ЛИДЕР МИССИИ</Typography.Label>
// xs=10px/tracking-0.4em(default), sm=11px/0.3em, md=12px/0.2em

// Читаемый текст: инструкции, описания. font-medium leading-relaxed
<Typography.Body size="xs|sm|base" color="body">Текст правил...</Typography.Body>
// xs, sm(default), base

// Минимальный хинт: подсказки, вторичные метки. font-black uppercase
<Typography.Caption size="xs|sm" color="faint">подсказка</Typography.Caption>
// xs=8px, sm=9px(default) | для цветных меток: color="red" className="opacity-50"

// Числа: очки, счёт, таймер. font-black italic tabular-nums
<Typography.Score size="sm|md|lg|xl" color="white" glow>{score}</Typography.Score>
// sm=36px, md=48px(default), lg=60px, xl=72px
```

**Импорт:** `import { Typography } from '@/components/UI'` или `import { Typography } from '@/components/Typography'`

### PageWrapper
```tsx
<PageWrapper className="...">children</PageWrapper>
```
`min-h-screen text-white overflow-x-hidden` + внутренний `max-w-md mx-auto p-6 pb-32`

### TabButton
```tsx
<TabButton active={bool} onClick={fn}>Вкладка</TabButton>
```

### ParallaxBackground
Определён в UI.tsx, отслеживает движение мыши. Использовать осторожно — постоянный mousemove listener. Сейчас импортируется в MainMenu но не рендерится.

---

## PassPhoneCard (src/components/PassPhoneCard.tsx)

```tsx
<PassPhoneCard
  playerName="Алекс"
  badge="Шпион"
  badgeColor="red"          // 'orange'|'sky'|'red'|'green'|'default'
  instruction="Нажми чтобы продолжить"
  icon={Fingerprint}        // любой LucideIcon
  accentColor="red"         // 'green'|'sky'|'red'|'orange'|'default'
  onClick={fn}
/>
```
Карточка формата `aspect-3/4` для pass-phone фаз. Пульсирующая иконка, угловые скобки, badge, имя игрока 42px italic. Внутри использует `motion/react`.

---

## DistributionFlow (src/components/DistributionFlow.tsx)

Абстрактная основа для экранов раздачи ролей. Управляет `currentIndex`, `isRevealed`, ProgressDots, двойным AnimatePresence (переключение игрока + lock→reveal).

```tsx
<DistributionFlow
  players={players}           // Player[]
  onFinish={fn}
  activeColor="bg-premium-red"  // Tailwind-класс для ProgressDots
  passAccentColor="red"         // AccentColor для PassPhoneCard
  passIcon={EyeOff}             // опционально
  passInstruction="Нажми чтобы увидеть роль"
  getCardStyle={(player) => ({
    className: 'min-h-[28rem]',
    style: { border: '...', boxShadow: '...' },
  })}
  renderCard={(player, isLast, onNext) => (
    <>
      {/* inner content of the revealed card */}
    </>
  )}
/>
```

Используется в: SpyHuntGame/RoleDistribution, FakeArtistGame/FakeArtistDistribution, ResistanceGame/ResistanceDistribution.

---

## TabooPassPhase (src/components/TabooPassPhase.tsx)

Общая pass-фаза для семейства Taboo-игр: PassPhoneCard + PlayerScoreList.

```tsx
<TabooPassPhase
  playerNames={playerNames}
  scores={scores}
  currentExplainer={currentExplainer}
  teams={isTeam ? teams : undefined}   // опционально — показывает team badges
  accentColor="red"                    // 'red' | 'orange'
  icon={Ban}                           // LucideIcon
  instruction="Только ты должен видеть..."
  onStart={handleStart}
/>
```

Используется в: TabooGame/PassPhase (red, Ban), TabooReverseGame/PassPhase (orange, ListChecks).

---

## TimerBar (src/components/TimerBar.tsx)

```tsx
<TimerBar pct={timeLeft / total * 100} color="#ef4444" className="mb-4" />
```
Тонкая полоска прогресса. Используется в обоих Taboo PlayingPhase.

---

## ProgressDots (src/components/ProgressDots.tsx)

```tsx
<ProgressDots
  count={players.length}
  current={currentIndex}
  activeColor="bg-premium-red"   // Tailwind-класс активной точки
  className="mb-8"
/>
```
Анимированные индикаторы шага. Используется в DistributionFlow и SpyHunt/FakeArtist раздачах.

---

## PlayingHeader (src/components/PlayingHeader.tsx)

```tsx
<PlayingHeader
  explainer="Алекс"
  timeLeft={45}
  timerColor="#ef4444"           // hex — динамический цвет таймера
  extra={<BlitzCounter ... />}   // опционально
/>
```
Строка "Алекс объясняет" + таймер. Используется в Taboo/PlayingPhase и TabooReverse/PlayingPhase.

---

## PlayerScoreList (src/components/PlayerScoreList.tsx)

Список игроков с очками для pass-экранов. Автосортировка по очкам.

```tsx
<PlayerScoreList
  players={playerNames}
  scores={scores}
  activePlayer={currentExplainer}   // подсвечивается accentColor
  activeLabel="объясняет"           // бейдж рядом с активным (default: "объясняет")
  accentColor="orange"              // 'red'|'orange'|'sky'|'green'|'purple'|'yellow'
  teams={teams}                     // опционально — team badges для не-активных
/>
```

Используется через TabooPassPhase (TabooGame, TabooReverseGame).

---

## LeaderboardList (src/components/LeaderboardList.tsx)

Ранжированный список победителей для GameOver-экранов.

```tsx
<LeaderboardList players={playerNames} scores={scores} />
```

Сортирует по убыванию, подсвечивает #1 жёлтым (с трофеем), если победитель единственный. Используется в TabooGame/GameOverPhase и TabooReverseGame/GameOverPhase.

---

## StopGameButton (src/components/StopGameButton.tsx)

```tsx
<StopGameButton onClick={onStopGame} />
```

Кнопка "Завершить игру" со StopCircle иконкой. Используется в VerdictPhase обоих Taboo-игр.

---

## Setup (src/components/Setup.tsx) — экран ДО игры

**Назначение:** полноэкранный экран настройки перед стартом. Используется для ВСЕХ игр через `case 'setup'` в App.tsx.

**Что делает:**
- Список игроков с добавлением, удалением, переименованием, перетаскиванием (Reorder)
- Загружает/сохраняет имена через `storageService.getPlayers()` / `savePlayers()`
- `children` — слот для `<UniversalGameSettings>` (difficulty, mode, rounds, timer)
- Кнопка `HelpCircle` → открывает `InstructionsModal` с правилами (управляется внутри Setup)
- Кнопка СТАРТ → вызывает `onStart(playerNames)`

**ВАЖНО:** инструкции (InstructionsModal) живут ТОЛЬКО здесь. Никакому игровому компоненту не нужно рендерить InstructionsModal самостоятельно — Setup уже показал их до старта.

```tsx
<Setup
  onStart={startGame}
  onBack={reset}
  title="FAKE ARTIST"
  subtitle="Найдите фейкового автора"
  icon={Palette}
  themeColor="green"               // GameTheme: 'red'|'green'|'sky'|'orange'|'purple'|'yellow'|'blue'
  playerPlaceholder="Игрок"
  addPlayerLabel="Добавить"
  instructions={GAME_INSTRUCTIONS[GameKey.FakeArtist]}
  description="Описание игры"
  minPlayers={4}
>
  <UniversalGameSettings ... />
</Setup>
```

`themeColor` здесь — это `GameTheme` ('green', 'red' и т.д.), НЕ Tailwind-строка. Setup использует `colorConfig` для полного набора стилей (button, shadow, gradient, focus и т.д.).

---

## GameHeader (src/components/GameHeader.tsx) — хедер ВО ВРЕМЯ игры

**Назначение:** компактный sticky-хедер, отображается пока игра идёт (после Setup).

**Что делает:** показывает иконку + название игры + динамический subtitle (счёт, раунд, имя игрока и т.д.) + кнопка Home. Слот `extraActions` для дополнительных кнопок (таймер, счёт и пр.).

**НЕ делает:** не показывает инструкции, не управляет игроками — это зона Setup.

```tsx
<GameHeader
  title="FAKE ARTIST"
  subtitle="Ход 1 / 6"
  icon={Palette}
  themeColor="border-premium-green/30 text-premium-green"  // raw Tailwind-строка, НЕ GameTheme
  onBack={fn}
  extraActions={<button>...</button>}   // опционально
/>
```

`themeColor` здесь — raw Tailwind-строка (`"border-premium-orange/30 text-premium-orange"`), НЕ GameTheme enum. Применяется напрямую как className к иконке-квадрату.

---

## DrawingCanvas (src/components/DrawingCanvas.tsx)

Полноценный канвас-компонент с ResizeObserver, DPR, историей, undo, цветами кисти.

```tsx
<DrawingCanvas
  word="Кот"
  timeLeft={60}
  playerCount={4}
  currentRound={1}
  onFinish={(dataUrl: string) => void}
/>
```

Используется в TelestrationsGame. FakeArtistGame имеет собственный inline канвас.
