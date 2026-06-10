# План: нормальный роутер для Party Hub (web)

> Статус: план, не реализовано.
> Связан с `RN_MIGRATION_PLAN.md`: в RN навигация всё равно будет переписана на React Navigation v7,
> поэтому web-роутер должен быть тонким слоем поверх существующих компонентов, а не глубокой перестройкой.

---

## 1. Что есть сейчас (проблема)

Роутинга нет — есть state-машина в `src/App.tsx`:

- `useState<GameStatus>(GameStatus.Menu)` + `switch (status)` на ~19 кейсов (`renderGame()`);
- переход в игру: `GAMES_REGISTRY[gameKey].setupStatus` → `setStatus(...)`;
- `players` хранятся в `useState` App и передаются пропсом `playerNames` в каждую игру;
- «назад» — только через кнопку `onBack={reset}`; системная кнопка «назад» браузера/Android выкидывает из приложения (критично для PWA);
- нет URL: нельзя обновить страницу без потери экрана, нельзя дать ссылку на игру;
- скролл-фикс вручную: `useEffect(() => window.scrollTo(...), [status])`;
- enum `GameStatus` замусорен: значения `Distributing`, `Hinting`, `Review`, `Alias`, `FakeArtistVoting` и т.п. нигде не используются (фазы игр давно живут в локальных enum'ах `./types.ts` каждой игры).

## 2. Выбор библиотеки

**Рекомендация: `react-router` v7 (library/declarative mode, `createBrowserRouter`).**

| Вариант | Плюсы | Минусы | Вердикт |
|---|---|---|---|
| **react-router v7** | стандарт де-факто; `route.lazy` заменяет ручной `React.lazy`; `ScrollRestoration`; data-режим не обязателен | ~12 KB gzip | ✅ берем |
| TanStack Router | типобезопасные параметры | тяжёлый setup (codegen/route tree) — избыточно для 4 маршрутов, которые умрут при RN-миграции | ❌ |
| wouter | 2 KB | нет lazy-роутов и scroll restoration из коробки — допишем руками то, что RR даёт бесплатно | ❌ |

## 3. Карта URL

```
/                       MainMenu (+ кнопка Settings)
/settings               Settings
/game/:gameKey/setup    Setup + UniversalGameSettings
/game/:gameKey/play     Сама игра (lazy)
*                       redirect → /
```

- `:gameKey` — значения enum `GameKey` (`spy`, `alias`, `bunker`, …). Невалидный ключ → redirect `/`.
- **Фазы внутри игр в URL НЕ выносим.** Причины: фазы — это `enum` + `AnimatePresence` внутри каждой игры (см. memory `phase_enum_pattern.md`); pass-and-play игры нельзя «откатывать» кнопкой назад в середине раунда (раскрытие ролей, слова); это сломало бы все 17 игр. Кнопка «назад» браузера с `/game/x/play` ведёт на setup (см. §5.4).

## 4. Передача данных между маршрутами

| Данные | Сейчас | Станет |
|---|---|---|
| `currentGameId` | `GameSettingsContext` (ставится в `handleMenuSelect`) | Выводится из URL-параметра `:gameKey`; `setCurrentGameId(gameKey)` вызывается в layout-компоненте маршрута `/game/:gameKey/*` (один `useEffect`). Контекст не трогаем — игры и `UniversalGameSettings` продолжают читать его как раньше |
| `players` | `useState<Player[]>` в App, пропс `playerNames` | `navigate('/game/x/play', {state: {playerNames}})` + **fallback на `storageService.getPlayers()`** при прямом заходе/обновлении страницы (имена уже персистятся в `startGame`). Игры по-прежнему получают `playerNames: string[]` пропсом — ни один файл игры не меняется |
| `difficulty` и пр. | `GameSettingsContext` (персистится per-game) | Без изменений |

## 5. Структура изменений

### 5.1. Новые файлы

```
src/router/
  routes.tsx        — createBrowserRouter, все маршруты
  GameLayout.tsx    — обёртка /game/:gameKey/*: валидация gameKey, setCurrentGameId, <Outlet/>
  GamePlayRoute.tsx — резолв playerNames (location.state → storage fallback → redirect на setup,
                      если игроков меньше minPlayers), рендер игры по gameKey, onBack=navigate('/')
  GameSetupRoute.tsx— текущий JSX кейса GameStatus.Setup из App.tsx (Setup + UniversalGameSettings),
                      onStart: сохранить игроков → navigate('../play', {state})
```

### 5.2. Маппинг «gameKey → компонент игры»

Сейчас switch в App.tsx — 17 кейсов. Станет одна таблица (либо в `GamePlayRoute.tsx`, либо полем `component` в `GAMES_REGISTRY`):

```tsx
const GAME_COMPONENTS: Record<GameKey, React.LazyExoticComponent<...>> = {
    [GameKey.Alias]: AliasGame,
    ...
};
```

Особые случаи (единственные отличия в пропсах):
- **Telestrations**: дополнительно `initialDifficulty={difficulty}` из контекста;
- **Bunker**: `onRestart={() => navigate('../setup')}` вместо `setStatus(GameStatus.Setup)`.

Ленивая загрузка: оставить текущие `React.lazy` из `GameRegistry.tsx` + `<Suspense>` (минимальный диф). Опционально вторым шагом перейти на `route.lazy` — тогда `GameRegistry.tsx` перестанет импортировать компоненты вообще.

### 5.3. App.tsx после рефакторинга

```tsx
export default function App() {
    return (
        <GameSettingsProvider>
            <LanguageProvider>
                <RouterProvider router={router} />
            </LanguageProvider>
        </GameSettingsProvider>
    );
}
```

Общий каркас (`min-h-screen safe-top safe-bottom`, `max-w-3xl`, ring/shadow) — в корневой layout-маршрут с `<Outlet/>` + `<ScrollRestoration/>` (заменяет ручной `window.scrollTo`).

### 5.4. Поведение кнопки «назад» (браузер/Android PWA)

- `/game/x/play` → back → `/game/x/setup` → back → `/` — естественная история.
- Внутри игры back посреди раунда теряет прогресс раунда — так же, как сейчас теряет его `onBack`. Опционально (фаза 4): `useBlocker` с подтверждением «Выйти из игры?». В первой итерации не делаем.
- `onBack` пропс у игр сохраняется как есть (кнопка в `GameHeader`), просто получает `() => navigate('/')`.

### 5.5. Что удаляется

| Что | Где |
|---|---|
| `switch (status)` + `renderGame()` + `useState<GameStatus>` + `reset`/`handleMenuSelect`/scroll-effect | `App.tsx` (≈150 строк) |
| Поле `setupStatus` | `GAMES_REGISTRY` (17 записей) + тип `GameMetadata` в `types/games.ts` |
| Роутинговые значения `GameStatus` (`Menu`, `Settings`, `Setup`, `*Playing`) и мёртвые значения (`Distributing`, `Hinting`, `Review`, …) | `src/types.ts` — **enum, скорее всего, удаляется целиком**; перед удалением — grep по каждому значению (минимум `Bunker` использует `GameStatus.Setup` через `onRestart` — уже заменено) |
| `console.log('currentGameId', ...)` в `startGame` | попутно |

## 6. Конфигурация

- `npm i react-router` (v7, пакет один — `react-router`).
- **Vite dev/preview**: SPA-fallback работает из коробки.
- **Прод**: в репо есть `express` (`server.js` по `npm run clean`) — нужен catch-all `app.get('*', ...)` → `index.html`, иначе обновление на `/game/alias/play` даст 404.
- **PWA** (`vite-plugin-pwa`): проверить `navigateFallback: '/index.html'` в конфиге workbox.

## 7. Фазы исполнения

| Фаза | Объём | Файлы |
|---|---|---|
| **1. Каркас** | router + layout + маршруты `/` и `/settings`; меню и настройки ходят по URL | `main.tsx`/`App.tsx`, `src/router/routes.tsx`, +2 файла |
| **2. Игры** | `/game/:gameKey/setup` и `/play`, guard'ы (невалидный ключ, нет игроков), маппинг 17 игр, спецслучаи Bunker/Telestrations | `GameLayout`, `GameSetupRoute`, `GamePlayRoute` |
| **3. Зачистка** | удалить switch/`setupStatus`/мёртвый `GameStatus`, обновить memory bank (`project_overview.md`, `games_flow.md` ссылаются на GameStatus-цепочки) | `App.tsx`, `types.ts`, `types/games.ts`, `GameRegistry.tsx`, `.claude/memory/*` |
| **4. Опционально** | `route.lazy` вместо ручного `React.lazy`; `useBlocker` «Выйти из игры?»; прод-fallback в express | — |

Фазы 1–2 можно вкатить одним PR (приложение не работает наполовину на switch, наполовину на роутере без обеих).

## 8. Риски и проверка

- **Риск:** прямой заход на `/game/x/play` без setup → guard: игроков из storage меньше `minPlayers` → redirect на `/game/x/setup`.
- **Риск:** `setCurrentGameId` теперь async (Step 2 storage-миграции) — конфиг сложности подгружается на микротик позже; уже так работает, роутер ничего не меняет.
- **Риск:** двойной `Suspense` (роутер + игры) — оставить один, на уровне layout.
- **Проверка:** `tsc --noEmit` — базлайн 8 ошибок; `eslint` — не хуже текущего; ручной прогон: меню → setup → игра → back (браузерный и кнопкой) для 3–4 игр разных типов (Alias, Bunker c onRestart, Telestrations c initialDifficulty, Corridor без bg-картинки), обновление страницы на каждом экране, невалидный URL.
