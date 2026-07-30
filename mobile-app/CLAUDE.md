# mobile-app — React Native порт Party Games

Expo-приложение (SDK 57, expo-router, NativeWind, MMKV). Порт веб-версии из корня репозитория; план и статус переноса — `../docs/react-native-migration.md`, банк памяти проекта — `../.claude/memory/`.

## Конвенции (те же, что в вебе)

- Комментарии в коде — на русском; TS `enum` запрещён — const-объект + производный тип
- FSD-структура `src/` повторяет веб: `shared/`, `entities/`, `games/`; роуты expo-router — тонкие обёртки в `src/app/`
- Цвета: `src/shared/theme/colors.ts` (PREMIUM_RGB) — единственный источник; `npm run theme:gen` генерирует `tailwind.colors.json` (руками не править)
- Хранилище: только через `storageService`/`sessionService` (внутри — MMKV-адаптер `kvStorage`); эффекты — только через `feedbackService`
- Файлы с чистой логикой/контентом копируются из веба 1:1 — при правке контента дублировать изменение в оба проекта

## Команды

- `npm start` — Metro (сначала прогоняет theme:gen)
- `npm run typecheck` — tsc --noEmit
- ВАЖНО: MMKV не работает в Expo Go — только dev build (`expo-dev-client`, сборка через EAS)
