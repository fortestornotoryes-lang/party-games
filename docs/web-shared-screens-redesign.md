# Редизайн общих экранов игр (веб) — для переноса в React Native

> Дата: 2026-10-25. Изменения сделаны **только в вебе** (`src/`). В `mobile-app/` ничего не менялось — этот файл описывает, что и куда переносить.

## Что изменилось

Четыре общих элемента игр получили новый вид в неоновом стиле приложения (тёмные карточки, рамка и свечение цветом игры, `font-black italic uppercase`). Варианты выбирались по прототипам: передача — «Колода», показ слова и команды — «Конверт», выбор слова — «Шоу».

1. **Передача телефона** (`PassPhoneCard`). Вместо большой карточки «нажми» — колода: верхняя тёмная карта с неоновой сеткой и табличкой «Передай телефон / ИМЯ». Карту **смахивают вверх** (drag по Y: ≥ 90 px или бросок быстрее 500 px/с), она улетает, потом вызывается `onClick`. Альтернатива смахиванию — кнопка «Взять карту». В углах — иконка игры (или первая буква имени). Под картой видны 0–2 карты колоды (`deckDepth`).
2. **Показ секретного слова** (`SecretWordCard`, новый). Слово скрыто штриховой плашкой **одной ширины** (не выдаёт длину слова) и видно **только пока палец на карточке** (pointerdown → показать, pointerup/leave/cancel → спрятать). Кнопка «дальше» включается после первого просмотра. `details` (роль, категория, подсказка) прячутся вместе со словом.
3. **Выбор слова** (Крокодил, `ChooseWordPhase`). Плиты с неоновой рамкой цвета сложности (`LEVEL_COLOR`: зелёный/жёлтый/красный), блок «+очки» слева, нижняя «грань» плиты; выбранная плита вспыхивает (opacity готовой тени), остальные гаснут.
4. **Деление на команды** (`features/team-setup/TeamSetupPhase`, новый, общий для Alias и Крокодила). Название команды неоновым курсивом над светящейся линией, игроки — строки с цветной полоской слева (как карточки игр в меню); число команд и цель партии — числа с неоновым подчёркиванием (`NeonOption`, `layoutId`).

## Правила

- **В раздаче ролей все роли показываются одной механикой.** Если только агенты держат палец на экране, а шпион нет — со стороны видно, кто шпион. Поэтому в Охоте на шпиона и Фальшивом художнике шпион/самозванец тоже получает `SecretWordCard` (словом служит название роли), а подпись карточки у всех одна — «Секретная карта» (`common.secretCard`).
- Подсказки «Нажми, чтобы…» на экранах передачи удалены (теперь карту смахивают): ключи `tapToStart`, `tapToContinue`, `tapToVote`, `tapToSeeWord`, `tapToSeeDrawing`.
- Цвет карты передачи = цвет игры из реестра (Две правды — teal, Кто из нас — pink, Миллионер — yellow…), раньше у части игр был нейтральный.
- В Телестрейшн стартовый экран больше не хранит `wordRevealed` в сессии: «видел ли слово» — локальное состояние `SecretWordCard`.
- Резистанс: изменилась только передача телефона; карточка роли осталась прежней.

## Файлы веба → куда в RN

| Веб | Что изменено | RN |
| --- | --- | --- |
| `src/shared/components/PassPhoneCard.tsx` | Переписан: колода + смахивание. Пропсы: `playerName`, `playerLabel?`, `badge?`, `instruction?`, `icon?`, `accentColor?: GameTheme`, `deckDepth?`, `onClick`. `badgeColor` удалён | Переписать на `react-native-gesture-handler` (`Gesture.Pan`, как слайдер Wavelength) + reanimated (улёт карты) |
| `src/shared/components/SecretWordCard.tsx` (новый) | Карточка «держи палец» + `SecretDetail` | `Pressable` `onPressIn`/`onPressOut`; плашка — `View` со `scaleX` от левого края |
| `src/shared/components/PrimaryButton.tsx` | Проп `theme?: GameTheme` — кнопка цвета игры (классы `getTheme(theme).button`) | Аналог через `colors.ts` |
| `src/features/team-setup/components/TeamSetupPhase.tsx` (новый) | Общий экран команд + `NeonOption` | Новый общий компонент; перелёт игроков — layout-анимации reanimated |
| `src/features/role-distribution/components/DistributionFlow.tsx` | `CardStyleResult.bare` — карточка без рамки-обёртки; `passAccentColor: GameTheme`; `deckDepth` по числу оставшихся игроков | Повторить |
| `src/games/SpyHuntGame/components/RoleDistribution.tsx`, `src/games/FakeArtistGame/components/FakeArtistDistribution.tsx` | Все роли через `SecretWordCard` | Повторить |
| `src/games/AliasGame/phases/SetupPhase.tsx`, `src/games/CrocodileGame/phases/SetupPhase.tsx` | Тонкие обёртки над `TeamSetupPhase`; `isTeamsValid` удалён из helpers (валидность считает компонент) | Повторить |
| `src/games/CrocodileGame/phases/ChooseWordPhase.tsx`, `constants.ts` | Неоновые плиты; `LEVEL_STYLES` заменён на `LEVEL_COLOR` | Повторить |
| `src/games/TelestrationsGame/components/TelestrationsStart.tsx` | Показ слова через `SecretWordCard` | Повторить |
| Остальные вызовы `PassPhoneCard` (Табу, Кодовые имена, Миллионер, Резистанс, Правда или действие, Две правды, Кто из нас, Телестрейшн) | Убраны `badgeColor` и «нажми»-подсказки, задан цвет игры | Повторить |
| `src/shared/i18n/*` | `common`: `passSwipeHint`, `passTakeCard`, `peekHint`, `peekRelease`, `secretCard`. Удалены неиспользуемые ключи (см. выше + `spy_hunt.secretRole/agentLabel`, `fake_artist.secretRole/artistRole/yourWord`, `telestrations.makeSureNoOneWatches/showWord`) | Синхронизировать словари |
| `src/app/styles/index.css` | Анимация `animate-nudge` (подсказка «смахни вверх») | CSS-цикл → `withRepeat` в reanimated |

## Чеклист RN

- [ ] `PassPhoneCard`: смахивание + кнопка «Взять карту», улёт карты, `deckDepth`
- [ ] `SecretWordCard` + `SecretDetail`; в Охоте на шпиона и Фальшивом художнике — для всех ролей
- [ ] `TeamSetupPhase` для Alias и Крокодила (+ цель партии в Крокодиле)
- [ ] Неоновые плиты выбора слова в Крокодиле
- [ ] Телестрейшн: показ слова через `SecretWordCard`
- [ ] i18n-ключи
