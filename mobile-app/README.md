# Party Games — mobile (React Native)

React Native порт веб-приложения Party Games (18 оффлайн pass-the-phone игр). Веб-версия живёт в корне репозитория и продолжает работать; план переноса и текущий статус — [`../docs/react-native-migration.md`](../docs/react-native-migration.md).

## Стек

- **Expo SDK 57** (RN 0.86, New Architecture), **expo-router** (file-based роутинг)
- **NativeWind v4** (Tailwind 3-конфиг; цвета генерируются из `src/shared/theme/colors.ts` — `npm run theme:gen`)
- **react-native-mmkv** — синхронное хранилище вместо localStorage (API сервисов не менялся)
- **moti / reanimated** — анимации, **lucide-react-native** — иконки, **expo-haptics** — вибрация
- **react-native-gesture-handler** — жесты (слайдеры, драг), **react-native-svg** — интерактивные доски, **@shopify/react-native-skia** — рисование (Telestrations, FakeArtist)

## Запуск

```bash
npm install
npm start          # Metro; сначала автоматически прогоняется theme:gen
npm run typecheck  # tsc --noEmit
```

> **Важно:** MMKV и Skia не работают в Expo Go — нужен dev build:
> `npx expo run:android` на устройстве/эмуляторе, либо облачная сборка EAS
> (`npx eas build --profile development`). Для iOS без Mac — только EAS.
> После установки `@shopify/react-native-skia` нужна нативная пересборка dev build.

## Структура

FSD-структура повторяет веб-версию: `src/shared` (types, helpers, hooks, i18n, services, theme), `src/entities/game` (реестр, инструкции, настройки), `src/games/<Game>/` (логика и контент игр), `src/app/` — тонкие экраны expo-router.

Статус: **все 18 игр перенесены** (этапы 0–6 выполнены). Этап 7 (полировка) в работе: брендинг (иконка/сплэш из веб-лого «Party Hub») и `expo-keep-awake` сделаны; анимации-переходы до паритета с вебом и профилирование производительности — ещё нет. Этап 8 (сборка и публикация в сторы) не начат.

## Рецепт переноса игры (выработан на этапе 4)

Порядок действий при порте игры из веба (`../src/games/<Game>/`) в `src/games/<Game>/`:

1. **Логика копируется 1:1**: `content.ts`, `model/*.ts`, `constants.ts`, `helpers.ts` — чистый TS, импорты `@/…` совпадают. Исключение — `types.ts`: веб-`enum` фаз конвертируется в const-объект + производный тип, **строковые значения сохранить как в вебе** (иначе сломается восстановление персистентной сессии).
2. **Корневой компонент** — логика (usePersistedState/usePersistedTimer/useTimer/feedbackService — API совпадают) копируется как есть. Оболочка: `div h-screen/safe-*` → `View className="flex-1"` + `useSafeAreaInsets` (paddingTop/Bottom), `overflow-y-auto` → явный `ScrollView` c `contentContainerStyle={{ flexGrow: 1 }}`.
3. **Фазы**: `motion/react` → `moti`. `AnimatePresence` импортируется из `moti`; вместо `mode="wait"` — `exitBeforeEnter` (внутри framer-motion 6). Каждой фазе — стабильный `key`. `initial/animate` → `from/animate`, `y` → `translateY`, duration в мс, `delay` — поле transition. `motion.button whileTap` → `Pressable` + `style={({pressed}) => pressed && {transform:[{scale:0.95}]}}`.
4. **Иконки**: `lucide-react` → `lucide-react-native`; размер/цвет только пропсами `size`/`color` (className не работает), цвета — через `rgba()` из `@/shared/theme/colors`.
5. **Стили**: rem-шрифты → числовые `fontSize` (+ `lineHeight`, `letterSpacing` в px — `tracking-*em` умножить на fontSize); `grid grid-cols-2` → `flex-row` + `flex-1`; CSS-градиенты → `expo-linear-gradient` (absolute-fill внутри `overflow-hidden`); `box-shadow` → `shadowColor/Radius/Opacity` + `elevation`; невоспроизводимое (blur-подложки, grid-текстуры, mix-blend, radial-градиенты) — упростить с комментарием. Текст только внутри `<Text>`; `space-y-*` → `gap-*`.
6. **className на сторонних компонентах** (MotiView и т.п.) работает только после регистрации в `src/shared/nativewindInterop.ts`; Svg-компоненты в cssInterop не регистрировать — только пропсы.
7. **Регистрация**: добавить запись в `GAME_COMPONENTS` (`src/app/game/[gameKey]/play.tsx`); если контент расходуемый — добавить пул в `WORD_POOLS` (`src/features/word-stats/model/contentService.ts`).
8. **Проверка**: `npm run typecheck`; смоук полного цикла на dev build (не Expo Go!): все фазы, таймер/вибрация/конфетти, «Стоп» и реванш, kill-and-relaunch посреди раунда — фаза и остаток таймера должны восстановиться. Контент-правки дублировать в веб-версию, пока она жива.
9. **Доски/сетки/рисование** (если у игры есть): сетка без CSS grid → `flex-row flex-wrap` + `width: '<100/n>%'` на ячейке; SVG-доска → `react-native-svg` (клики — `onPress` на `<Rect>`/`<Circle>`, анимация позиции — `useSharedValue`+`useAnimatedProps`); слайдер/драг → `react-native-gesture-handler` (`Gesture.Pan`+`GestureDetector`, `runOnJS` для апдейта состояния); канвас рисования → см. `shared/components/DrawingCanvas.tsx` (Skia `<Path>` по массиву точек, `makeImageSnapshot().encodeToBase64()` для экспорта кадра). Hover-состояния веба (наведение курсора) не переносятся — на тач-устройствах нет аналога, просто опустить.
