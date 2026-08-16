# mobile-app — React Native порт Party Games

Expo-приложение (SDK 57, expo-router, NativeWind, MMKV). Порт веб-версии из корня репозитория; план и статус переноса — `../docs/react-native-migration.md`, банк памяти проекта — `.claude/memory/` (свой, независимый от корневого — см. правило о выделении в отдельный репозиторий в `MEMORY.md`).

## Банк памяти

В начале каждой сессии читать `mobile-app/.claude/memory/MEMORY.md` и файлы из его индекса, релевантные задаче (см. корневой `CLAUDE.md`, раздел «Project Memory Bank» — правила поддержки банка те же).

## Конвенции (те же, что в вебе)

- Комментарии в коде — на русском; TS `enum` запрещён — const-объект + производный тип
- FSD-структура `src/` повторяет веб: `shared/`, `entities/`, `features/`, `widgets/`, `games/`; роуты expo-router — тонкие обёртки в `src/app/`, реальный экран рендерит соответствующий компонент из `widgets/`
- Цвета: `src/shared/theme/colors.ts` (PREMIUM_RGB) — единственный источник; `npm run theme:gen` генерирует `tailwind.colors.json` (руками не править)
- Хранилище: только через `storageService`/`sessionService` (внутри — MMKV-адаптер `kvStorage`); эффекты — только через `feedbackService`
- Файлы с чистой логикой/контентом копируются из веба 1:1 — при правке контента дублировать изменение в оба проекта
- UI-кит: `src/shared/components` (порты веб-компонентов, API сохранён), витрина — роут `/showcase`. Перед созданием нового UI — проверить готовые компоненты
- NativeWind: `className` на сторонних компонентах (MotiView и т.п.) работает только после регистрации в `src/shared/nativewindInterop.ts` (cssInterop)
- RN не знает em: letterSpacing задавать в px (пересчёт от fontSize), см. Typography
- Blur (GlassCard) — только iOS; Android получает градиент-fallback. Не вкладывать GlassCard друг в друга

## Команды

- `npm start` — Metro (сначала прогоняет theme:gen)
- `npm run typecheck` — tsc --noEmit
- ВАЖНО: MMKV не работает в Expo Go — только dev build (`expo-dev-client`, сборка через EAS)
