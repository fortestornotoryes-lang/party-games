# Party Games — mobile (React Native)

React Native порт веб-приложения Party Games (18 оффлайн pass-the-phone игр). Веб-версия живёт в корне репозитория и продолжает работать; план переноса и текущий статус — [`../docs/react-native-migration.md`](../docs/react-native-migration.md).

## Стек

- **Expo SDK 57** (RN 0.86, New Architecture), **expo-router** (file-based роутинг)
- **NativeWind v4** (Tailwind 3-конфиг; цвета генерируются из `src/shared/theme/colors.ts` — `npm run theme:gen`)
- **react-native-mmkv** — синхронное хранилище вместо localStorage (API сервисов не менялся)
- **moti / reanimated** — анимации, **lucide-react-native** — иконки, **expo-haptics** — вибрация

## Запуск

```bash
npm install
npm start          # Metro; сначала автоматически прогоняется theme:gen
npm run typecheck  # tsc --noEmit
```

> **Важно:** MMKV (и позже Skia) не работают в Expo Go — нужен dev build:
> `npx expo run:android` на устройстве/эмуляторе, либо облачная сборка EAS
> (`npx eas build --profile development`). Для iOS без Mac — только EAS.

## Структура

FSD-структура повторяет веб-версию: `src/shared` (types, helpers, hooks, i18n, services, theme), `src/entities/game` (реестр, инструкции, настройки), `src/games/<Game>/` (логика и контент игр), `src/app/` — тонкие экраны expo-router.

Статус: перенесено ядро без UI (этапы 0–1 плана); экран `index` — временный смоук-список игр из реестра.
