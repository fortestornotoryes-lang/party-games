---
name: components-ui
description: "Справочник UI-компонентов из src/components/UI.tsx и GameHeader, DrawingCanvas"
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
Внутри вызывает `feedbackService.playSound('click')` и `vibrate(10)`.

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
`text-[11px] font-black uppercase tracking-[0.5em] text-white/80 italic`

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

### Typography
```tsx
<Typography.Title>ЗАГОЛОВОК</Typography.Title>
<Typography.Heading>Подзаголовок</Typography.Heading>
<Typography.Description>Описание</Typography.Description>
```

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

## GameHeader (src/components/GameHeader.tsx)

```tsx
<GameHeader
  title="FAKE ARTIST"
  subtitle="Ход 1 / 6"
  icon={Palette}
  themeColor="border-emerald-500/50 text-emerald-400"
  onBack={fn}
/>
```
Sticky-хедер с кнопкой назад.

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
