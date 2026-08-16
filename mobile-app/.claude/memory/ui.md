# UI & Design System

## Темы и цвета

- 12 тем `GameTheme` (`shared/types/index.ts`); у каждой игры тема задана в реестре
- **Единственный источник цветов — `PREMIUM_RGB`** (`src/shared/theme/colors.ts`). `mobile-app/scripts/generateTailwindColors.mjs` генерирует `tailwind.colors.json` из него (`npm run theme:gen`, вшит в `prestart`) — аналог веб-`theme:gen`. Сгенерированный файл руками не править.
- `rgba(color, alpha)` из colors.ts — для inline style (boxShadow и т.п.), не для className
- Градиенты веба (`ThemeTokens`) на RN переиспользованы через `gradientColors`/`glowColor` вместо tailwind-градиентных классов (см. `features/role-distribution`)

## NativeWind / className

- `className` на сторонних компонентах (`MotiView` и т.п.) работает **только** после регистрации в `src/shared/nativewindInterop.ts` (`cssInterop`). Svg-компоненты в cssInterop не регистрировать — только пропсы.
- RN не знает `em`: `letterSpacing` задавать в px (пересчёт от fontSize) — см. `Typography`. `tracking-*em` веба конвертируется умножением на fontSize при переносе.
- rem-шрифты веба → числовые `fontSize` (+ `lineHeight`); `space-y-*` → `gap-*`; `grid grid-cols-*` → `flex-row` + `flex-1`/`width: '<100/n>%'` на ячейке (сетки без CSS grid — Codenames, Decrypto, MemoRisk, ConnectFour).

## Blur / GlassCard

- Blur (`GlassCard`) работает **только на iOS**; Android получает градиент-fallback. Не вкладывать `GlassCard` друг в друга.

## Общие компоненты (`src/shared/components/`)

Перед созданием нового UI — проверить готовые RN-порты веб-компонентов (API сохранён): PrimaryButton,
IconButton, TabButton, GameCard, GameHeader, PlayingHeader, TimerBar, PassPhoneCard (передача телефона),
DrawingCanvas (Skia-рисование), InstructionsModal, PageWrapper, Typography, Badge, SectionLabel,
ProgressDots, Pagination, TextInput, StopGameButton, GlassCard. Витрина всех компонентов — роут `/showcase`.
Игрокоспецифичные списки — `entities/player/components/`.

## Анимации

- `moti`/`reanimated`. Смена фаз/экранов — `AnimatePresence` из `moti` с `exitBeforeEnter` (не `mode="wait"` — framer-motion 6 внутри moti), у каждой фазы стабильный `key`.
- `initial/animate` (веб `motion/react`) → `from/animate` (moti), `y` → `translateY`, duration в мс, `delay` — поле `transition`. `motion.button whileTap` → `Pressable` + `style={({pressed}) => pressed && {transform:[{scale:0.95}]}}`.
- Прогрессивное появление списков — stagger через `delay: index * ...`
- Доски/раздача ролей — `react-native-svg` (клики — `onPress` на `<Rect>`/`<Circle>`, анимация позиции — `useSharedValue`+`useAnimatedProps`, напр. пешки Corridor); слайдер/драг — `react-native-gesture-handler` (`Gesture.Pan`+`GestureDetector`, `runOnJS` для апдейта state, напр. Wavelength). `GestureHandlerRootView` уже стоит в `app/_layout.tsx`.
- Рисование (FakeArtist, Telestrations) — `@shopify/react-native-skia`: штрихи как массив точек, каждый — `<Path>`; undo = pop последнего; экспорт кадра — `canvasRef.makeImageSnapshot().encodeToBase64()` → тот же формат dataURL, что и веб `canvas.toDataURL()`.
- Hover-эффекты веба (призрак колонки, подсветка слота при наведении) на RN опущены — на тач-устройствах нет аналога.

_Ревизия: 2026-08-16_
