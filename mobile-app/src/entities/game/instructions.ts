import type { GameInstructionsMap, InstructionItem } from './types';
import { GameKey } from './types';

import type { Lang } from '@/shared/i18n/types';

/**
 * Single source of truth for all game instructions and text rules.
 * Русская версия — GAME_INSTRUCTIONS, английская — GAME_INSTRUCTIONS_EN;
 * выбор по языку — getGameInstructions(gameKey, lang).
 */
export const GAME_INSTRUCTIONS: GameInstructionsMap = {
  [GameKey.Spy]: [
    {
      title: '1. Подготовка и сбор',
      content:
        'Все игроки садятся друг против друга или за один стол. Требуется только одно устройство.',
    },
    {
      title: '2. Тайное распределение ролей',
      content:
        'Игроки по очереди смотрят роль. Все мирные увидят одну локацию и уникальную роль, а шпион увидит карточку «Шпион».',
    },
    {
      title: '3. Допрос и обсуждение',
      content:
        'Запускается таймер, игроки задают друг другу завуалированные вопросы по кругу. Мирные вычисляют шпиона, шпион — пытается понять локацию.',
    },
    {
      title: '4. Цели сторон и финал',
      content:
        'Мирные побеждают голосованием против шпиона. Шпион побеждает, если угадает локацию, либо если мирные обвинят невиновного.',
    },
  ],
  [GameKey.FakeArtist]: [
    {
      title: 'Суть игры',
      content:
        'Все игроки знают секретную тему рисования, кроме одного — Фальшивого художника, который маскируется под остальных.',
    },
    {
      title: 'Процесс',
      content:
        'Каждый игрок по очереди рисует на экране ровно одну непрерывную линию своим цветом, пытаясь внести вклад в общий рисунок.',
    },
    {
      title: 'Финал',
      content:
        'После двух кругов рисования игроки голосуют за фальшивого художника. Если его угадали, у него есть один шанс спастись — угадать саму тему рисунка.',
    },
  ],
  [GameKey.Resistance]: [
    {
      title: 'Суть игры',
      content:
        'Игроки делятся на Повстанцев и Шпионов империи. Повстанцы не знают ролей друг друга, шпионы знают всех своих.',
    },
    {
      title: 'Голосование',
      content:
        'Каждый раунд Лидер предлагает состав команды для выполнения миссии. Все игроки открыто голосуют «За» или «Против» этого состава.',
    },
    {
      title: 'Миссии',
      content:
        'Утвержденная команда тайно сдает карты «Успех» или «Саботаж». Повстанцы всегда голосуют за успех, шпионам достаточно одной карты саботажа для провала миссии.',
    },
  ],
  [GameKey.Alias]: [
    {
      title: 'Команды',
      content:
        'Разделитесь на две или более команды. В каждом раунде один игрок объясняет слова, а сокомандники — угадывают.',
    },
    {
      title: 'Объяснение',
      content:
        'Объясните максимум слов за отведенное время. Запрещено использовать однокоренные слова, жесты и прямые переводы.',
    },
    {
      title: 'Очки',
      content:
        'Каждое угаданное слово приносит 1 очко. Штраф за пропущенные слова зависит от выбранных настроек игры.',
    },
    {
      title: 'Победа',
      content:
        'Игра идет до достижения лимита очков (например, 50). Побеждает команда, первой набравшая нужное количество.',
    },
  ],
  [GameKey.JustOne]: [
    {
      title: 'Суть игры',
      content:
        'Кооперативная игра. Один игрок пытается отгадать секретное слово, а вся остальная команда тайно пишет к нему по одному слову-подсказке.',
    },
    {
      title: 'Фильтрация',
      content:
        'Перед тем как показать подсказки ведущему, устройство сравнивает их. Все одинаковые или однокоренные слова автоматически аннулируются и скрываются.',
    },
    {
      title: 'Отгадка',
      content:
        'Ведущий смотрит на оставшиеся уникальные подсказки и делает ровно одну попытку назвать секретное слово.',
    },
  ],
  [GameKey.Telestrations]: [
    {
      title: '1. Старт цепочки',
      content:
        'Первый игрок выбирает секретное слово своей сложности, рисует его на экране за отведенное время и передает телефон следующему.',
    },
    {
      title: '2. Угадывание рисунка',
      content:
        'Второй игрок смотрит исключительно на рисунок первого игрока, пишет текстовую догадку о том, что там изображено, и передает телефон дальше.',
    },
    {
      title: '3. Рисование по тексту',
      content:
        'Третий игрок видит только текстовую догадку второго игрока. Его задача — заново нарисовать это слово и передать телефон четвертому.',
    },
    {
      title: '4. Итоги',
      content:
        'Процесс идет по цепочке: Рисунок -> Текст -> Рисунок. В конце открывается полная галерея трансформации исходного слова.',
    },
  ],
  [GameKey.Wavelength]: [
    {
      title: 'Суть игры',
      content:
        'Командная игра на чтение мыслей. Ведущий видит скрытую целевую зону на полукруглой шкале и дает подсказку, отражающую положение между двумя противоположностями.',
    },
    {
      title: 'Пример',
      content:
        'Если шкала задана как «Холодное — Горячее», а цель находится на максимуме справа, идеальной подсказкой ведущего будет слово «Лава».',
    },
    {
      title: 'Начисление очков',
      content:
        'Команда вращает стрелку, пытаясь угадать точный центр мишени. Очки начисляются в зависимости от точности попадания в зону.',
    },
  ],
  [GameKey.Codenames]: [
    {
      title: '1. Роли и подготовка',
      content:
        'Разделитесь на две команды (Красные и Синие). Каждая команда выбирает одного Капитана. Остальные игроки становятся Оперативниками.',
    },
    {
      title: '2. Ход Капитана',
      content:
        'Капитан тайно смотрит карту агентов и озвучивает подсказку: «Одно слово + число» (например, «Космос 2», где число — количество связанных слов на поле).',
    },
    {
      title: '3. Ход Оперативников',
      content:
        'Команда обсуждает варианты и нажимает на выбранные слова на экране. Ошибка завершает ход, нажатие на черную карту (Убийцу) — мгновенный проигрыш.',
    },
  ],
  [GameKey.Decrypto]: [
    {
      title: '1. Суть игры',
      content:
        'Игроки делятся на две команды. У каждой команды есть 4 секретных слова под номерами 1, 2, 3 и 4. Задача — передавать коды своей команде с помощью ассоциаций.',
    },
    {
      title: '2. Шифрование',
      content:
        'Капитан получает случайный трехзначный код (например, 3-1-4) и пишет 3 ассоциации к словам под этими номерами, после чего передает телефон.',
    },
    {
      title: '3. Перехват',
      content:
        'Начиная со 2-го раунда, команда соперников тоже пытается угадать ваш код, опираясь на историю ваших подсказок из прошлых раундов.',
    },
  ],
  [GameKey.Mafia]: [
    {
      title: 'Цель игры',
      content:
        'Мирным жителям нужно вычислить и проголосовать против всех мафиози, а мафии — тайно устранить мирных граждан до численного паритета.',
    },
    {
      title: 'Ход игры',
      content:
        'Игра делится на фазы дня и ночи. Ночью мафия и особые роли делают скрытые ходы, днем все участники открыто обсуждают события и казнят подозреваемого.',
    },
  ],
  [GameKey.ConnectFour]: [
    {
      title: 'Цель игры',
      content:
        'Первым выстроить непрерывную линию из четырёх фишек своего цвета — по горизонтали, вертикали или диагонали.',
    },
    {
      title: 'Ход',
      content:
        'Игроки ходят по очереди: нажмите на любую ячейку в нужном столбце — фишка падает на самый нижний свободный уровень.',
    },
    {
      title: 'Гравитация',
      content:
        'Выбрать конкретную строку нельзя. Фишка всегда занимает нижнюю доступную позицию выбранного столбца.',
    },
    {
      title: 'Победа',
      content:
        'Соберите 4 фишки своего цвета в ряд (по горизонтали, вертикали или любой диагонали). Если поле заполнено без победителя — ничья.',
    },
  ],
  [GameKey.TruthOrDare]: [
    {
      title: 'Суть игры',
      content:
        'Игроки ходят по очереди. Каждый выбирает: ответить честно на вопрос (Правда) или выполнить задание (Действие).',
    },
    {
      title: 'Правда',
      content:
        'Если выбрал Правду — отвечай честно на вопрос. Нельзя уклоняться или врать. Остальные игроки следят за честностью ответа.',
    },
    {
      title: 'Действие',
      content:
        'Если выбрал Действие — выполни задание полностью и без отговорок. Сложность заданий зависит от выбранного уровня.',
    },
    {
      title: 'Победитель',
      content:
        'В этой игре нет победителей — только незабываемые моменты. Игра идёт столько, сколько хочет компания.',
    },
  ],
  [GameKey.TabooReverse]: [
    {
      title: 'Суть',
      content:
        'Перевёрнутое Табу: объясняющий ОБЯЗАН использовать все запрещённые слова с карточки — они теперь твои единственные подсказки. Само загаданное слово называть нельзя.',
    },
    {
      title: 'Объяснение',
      content:
        'Используй каждое обязательное слово в объяснении хотя бы раз. Например, слово САМОЛЁТ с подсказками «крылья», «небо», «пилот»: «Крылья у него металлические. В небо поднимается каждый день. Пилот управляет им из кабины.»',
    },
    {
      title: 'Очки',
      content:
        '+2 — угадали и все слова использованы. +1 — угадали, но не все слова. 0 — не угадали. −1 — объясняющий назвал загаданное слово сам.',
    },
    {
      title: 'Сложность',
      content:
        'Лёгкие карточки: слова явно связаны с ответом. Средние: связь косвенная. Хардкор: слова почти противоположны — нужна креативность и абсурд.',
    },
  ],
  [GameKey.Taboo]: [
    {
      title: 'Суть',
      content:
        'Классическое Табу: объясняй загаданное слово так, чтобы другие его угадали. Главное условие — нельзя произносить ни одно из запрещённых слов на карточке.',
    },
    {
      title: 'Объяснение',
      content:
        'Слова можно объяснять любыми другими словами, жестами и звуками — кроме однокоренных и слов с карточки. Например, для КОШКИ нельзя говорить «кот», «животное», «мяу», «пушистый».',
    },
    {
      title: 'Очки',
      content:
        '+1 — слово угадано. −1 — объясняющий произнёс запрещённое слово. 0 — никто не угадал за отведённое время.',
    },
    {
      title: 'Сложность',
      content:
        'Лёгкие карточки: простые слова, очевидные запреты. Средние: более специфичные слова. Профи: абстрактные понятия, все очевидные синонимы под запретом.',
    },
  ],
  [GameKey.Millionaire]: [
    {
      title: 'Суть игры',
      content:
        'Игроки по очереди садятся в «горячее кресло» и отвечают на вопросы. Правильный ответ продвигает вас вверх по лестнице призов — от 100 до 1 000 000.',
    },
    {
      title: 'Три подсказки',
      content:
        '«50:50» убирает два неверных варианта. «Звонок другу» даёт совет (друг почти всегда знает). «Помощь зала» показывает, как проголосовала аудитория. Каждую подсказку можно использовать только раз.',
    },
    {
      title: 'Забрать деньги',
      content:
        'После каждого правильного ответа можно остановиться и забрать накопленную сумму — это разумнее, чем рисковать. Или жать «Продолжить» и рваться к миллиону.',
    },
    {
      title: 'Рубежи',
      content:
        'Вопросы 5 (1 000) и 10 (32 000) — несгораемые рубежи. Если ошибёшься после рубежа, гарантированно унесёшь сумму последнего рубежа.',
    },
  ],
  [GameKey.Bunker]: [
    {
      title: 'Ситуация',
      content:
        'Случилась глобальная катастрофа. Есть бункер, но мест в нём меньше, чем людей в группе. Каждый игрок получает случайного персонажа с уникальным набором характеристик.',
    },
    {
      title: 'Раскрытие',
      content:
        'Игра идёт в 3 раунда. В каждом раунде все по очереди объявляют одну характеристику своего персонажа. Сначала — профессия, затем — всё более неожиданные факты.',
    },
    {
      title: 'Обсуждение',
      content:
        'После каждого раунда — свободное обсуждение. Убеждайте, торгуйтесь, блефуйте. Докажите группе, что именно вы нужны в бункере.',
    },
    {
      title: 'Голосование и итог',
      content:
        'После трёх раундов группа голосует, кто не попадёт в бункер. Затем игра симулирует выживание команды — и выясняется, правильный ли выбор был сделан.',
    },
  ],
  [GameKey.Corridor]: [
    {
      title: '1. Цель',
      content:
        'Первым доведи свою фишку до противоположного края. Игрок 1 (бирюзовый ↑) стартует снизу и идёт наверх; Игрок 2 (оранжевый ↓) — сверху вниз.',
    },
    {
      title: '2. Ход',
      content:
        'За ход можно либо нажать «Ход» и передвинуть фишку на одну клетку (вверх, вниз, влево, вправо), либо поставить одну перегородку — горизонтальную (─) или вертикальную (│).',
    },
    {
      title: '3. Перегородки',
      content:
        'У каждого игрока 10 перегородок. Одна перегородка закрывает два прохода подряд. Нельзя полностью отрезать путь сопернику — хотя бы один маршрут к финишу должен оставаться.',
    },
    {
      title: '4. Прыжок через соперника',
      content:
        'Если фишки стоят рядом, можно перепрыгнуть соперника напрямую. Если за ним стена или край доски — прыгай по диагонали в обход.',
    },
  ],
  [GameKey.MemoRisk]: [
    {
      title: '1. Цель',
      content:
        'Набери больше всех очков, пока не истощится колода из 100 карт. Карты лежат рубашкой вверх — запоминай, где что находится: забранные цели заменяются новыми картами из колоды.',
    },
    {
      title: '2. Ход',
      content:
        'В начале хода видно целевую и опасную фигуру. Открыл целевую — получаешь её очки и продолжаешь. Открыл нейтральную — очков нет, но ход продолжается, карта останется открытой до конца хода. Открыл опасную — все очки хода сгорают и ход сразу переходит дальше.',
    },
    {
      title: '3. Риск или стоп',
      content:
        'В любой момент можно остановиться и забрать накопленные очки хода. Чем дольше продолжаешь, тем больше награда — и тем выше шанс наткнуться на опасную фигуру.',
    },
    {
      title: '4. Эскалация',
      content:
        'После каждого провала уровень риска растёт: в следующих ходах становится больше и целевых, и опасных фигур одновременно.',
    },
    {
      title: '5. Ценность карт',
      content:
        'Редкость видна по рамке и числу на карте: обычная +1, необычная (зелёная) +5, редкая (синяя) +10, эпическая (фиолетовая) +20. Супер-карта с молнией удваивает все очки текущего хода.',
    },
  ],
} as const;

export const GAME_INSTRUCTIONS_EN: GameInstructionsMap = {
  [GameKey.Spy]: [
    {
      title: '1. Setup',
      content: 'All players sit facing each other or around one table. Only one device is needed.',
    },
    {
      title: '2. Secret Roles',
      content:
        'Players take turns looking at their role. Civilians see the same location and a unique role, while the spy sees a "Spy" card.',
    },
    {
      title: '3. Interrogation',
      content:
        'The timer starts and players ask each other veiled questions in turn. Civilians try to spot the spy; the spy tries to figure out the location.',
    },
    {
      title: '4. Goals & Finale',
      content:
        'Civilians win by voting out the spy. The spy wins by guessing the location — or if the civilians accuse an innocent player.',
    },
  ],
  [GameKey.FakeArtist]: [
    {
      title: 'The Idea',
      content:
        'Everyone knows the secret drawing topic except one player — the Fake Artist, who tries to blend in with the rest.',
    },
    {
      title: 'The Process',
      content:
        'Each player takes turns drawing exactly one continuous line in their own color, contributing to the shared picture.',
    },
    {
      title: 'The Finale',
      content:
        'After two rounds of drawing, players vote for the fake artist. If caught, they get one chance to save themselves — by guessing the topic.',
    },
  ],
  [GameKey.Resistance]: [
    {
      title: 'The Idea',
      content:
        "Players split into Resistance fighters and Imperial spies. Resistance members don't know anyone's role; spies know each other.",
    },
    {
      title: 'Voting',
      content:
        'Each round the Leader proposes a mission team. All players openly vote for or against that lineup.',
    },
    {
      title: 'Missions',
      content:
        'The approved team secretly plays "Success" or "Sabotage" cards. Resistance always plays success; a single sabotage card fails the mission.',
    },
  ],
  [GameKey.Alias]: [
    {
      title: 'Teams',
      content:
        'Split into two or more teams. Each round one player explains words while teammates guess.',
    },
    {
      title: 'Explaining',
      content:
        'Explain as many words as possible before time runs out. Same-root words, gestures and direct translations are forbidden.',
    },
    {
      title: 'Points',
      content:
        'Each guessed word is worth 1 point. The penalty for skipped words depends on the game settings.',
    },
    {
      title: 'Victory',
      content:
        'Play until the point limit (e.g. 50). The first team to reach it wins.',
    },
  ],
  [GameKey.JustOne]: [
    {
      title: 'The Idea',
      content:
        'A cooperative game. One player tries to guess a secret word while everyone else secretly writes a one-word clue.',
    },
    {
      title: 'Filtering',
      content:
        'Before the clues are shown to the guesser, the device compares them. All identical or same-root clues are cancelled and hidden.',
    },
    {
      title: 'Guessing',
      content:
        'The guesser looks at the remaining unique clues and makes exactly one attempt to name the secret word.',
    },
  ],
  [GameKey.Telestrations]: [
    {
      title: '1. Chain Start',
      content:
        'The first player picks a secret word of their difficulty, draws it on screen within the time limit and passes the phone on.',
    },
    {
      title: '2. Guess the Drawing',
      content:
        "The second player looks only at the first player's drawing, writes a text guess of what it shows, and passes the phone on.",
    },
    {
      title: '3. Draw the Text',
      content:
        "The third player sees only the second player's guess. Their job is to draw that word again and pass the phone to the fourth.",
    },
    {
      title: '4. The Reveal',
      content:
        'The chain continues: Drawing -> Text -> Drawing. At the end, the full gallery of the word\'s transformation is revealed.',
    },
  ],
  [GameKey.Wavelength]: [
    {
      title: 'The Idea',
      content:
        'A team mind-reading game. The psychic sees a hidden target zone on a semicircular dial and gives a clue reflecting a position between two opposites.',
    },
    {
      title: 'Example',
      content:
        'If the scale is "Cold — Hot" and the target sits at the far right, the perfect clue would be "Lava".',
    },
    {
      title: 'Scoring',
      content:
        'The team rotates the needle trying to hit the exact center of the target. Points depend on how close they get.',
    },
  ],
  [GameKey.Codenames]: [
    {
      title: '1. Roles & Setup',
      content:
        'Split into two teams (Red and Blue). Each team picks a Captain; everyone else becomes Operatives.',
    },
    {
      title: "2. Captain's Turn",
      content:
        'The Captain secretly checks the agent map and gives a clue: "one word + a number" (e.g. "Space 2", where the number is how many related words are on the board).',
    },
    {
      title: "3. Operatives' Turn",
      content:
        'The team discusses and taps the chosen words on screen. A mistake ends the turn; tapping the black card (the Assassin) means instant defeat.',
    },
  ],
  [GameKey.Decrypto]: [
    {
      title: '1. The Idea',
      content:
        'Players split into two teams. Each team has 4 secret words numbered 1–4. The goal is to transmit codes to your team using associations.',
    },
    {
      title: '2. Encryption',
      content:
        'The captain receives a random three-digit code (e.g. 3-1-4) and writes 3 associations for the words at those numbers, then passes the phone.',
    },
    {
      title: '3. Interception',
      content:
        'Starting from round 2, the rival team also tries to guess your code using the history of your previous clues.',
    },
  ],
  [GameKey.Mafia]: [
    {
      title: 'The Goal',
      content:
        'Civilians must identify and vote out all mafiosi; the mafia must secretly eliminate civilians until they reach parity.',
    },
    {
      title: 'Gameplay',
      content:
        'The game alternates between day and night. At night the mafia and special roles make hidden moves; by day everyone debates openly and executes a suspect.',
    },
  ],
  [GameKey.ConnectFour]: [
    {
      title: 'The Goal',
      content:
        'Be the first to build an unbroken line of four discs of your color — horizontally, vertically or diagonally.',
    },
    {
      title: 'Turns',
      content:
        'Players alternate turns: tap any cell in the desired column — the disc falls to the lowest free slot.',
    },
    {
      title: 'Gravity',
      content:
        "You can't pick a specific row. A disc always lands in the lowest available position of the chosen column.",
    },
    {
      title: 'Victory',
      content:
        'Connect 4 discs of your color in a row (horizontally, vertically or diagonally). If the board fills up with no winner — it\'s a draw.',
    },
  ],
  [GameKey.TruthOrDare]: [
    {
      title: 'The Idea',
      content:
        'Players take turns. Each one chooses: answer a question honestly (Truth) or complete a challenge (Dare).',
    },
    {
      title: 'Truth',
      content:
        'If you picked Truth — answer honestly. No dodging, no lying. The other players judge your honesty.',
    },
    {
      title: 'Dare',
      content:
        'If you picked Dare — complete the challenge fully, no excuses. Difficulty depends on the chosen level.',
    },
    {
      title: 'The Winner',
      content:
        'There are no winners here — only unforgettable moments. Play as long as the party wants.',
    },
  ],
  [GameKey.TabooReverse]: [
    {
      title: 'The Idea',
      content:
        'Taboo flipped: the explainer MUST use every forbidden word on the card — they are now your only clues. The secret word itself must never be said.',
    },
    {
      title: 'Explaining',
      content:
        'Use every required word at least once. For example, AIRPLANE with clues "wings", "sky", "pilot": "Its wings are metal. It rises into the sky every day. A pilot controls it from the cockpit."',
    },
    {
      title: 'Points',
      content:
        '+2 — guessed and all words used. +1 — guessed, but not all words. 0 — not guessed. −1 — the explainer said the secret word.',
    },
    {
      title: 'Difficulty',
      content:
        'Easy cards: clues clearly relate to the answer. Medium: the link is indirect. Hardcore: clues are almost opposites — creativity and absurdity required.',
    },
  ],
  [GameKey.Taboo]: [
    {
      title: 'The Idea',
      content:
        'Classic Taboo: explain the secret word so others guess it. The catch — you may not say any of the forbidden words on the card.',
    },
    {
      title: 'Explaining',
      content:
        'Use any other words, gestures and sounds — except same-root words and the ones on the card. For CAT you can\'t say "kitten", "animal", "meow" or "furry".',
    },
    {
      title: 'Points',
      content:
        '+1 — word guessed. −1 — the explainer said a forbidden word. 0 — nobody guessed in time.',
    },
    {
      title: 'Difficulty',
      content:
        'Easy cards: simple words, obvious taboos. Medium: more specific words. Pro: abstract concepts with every obvious synonym banned.',
    },
  ],
  [GameKey.Millionaire]: [
    {
      title: 'The Idea',
      content:
        'Players take turns in the hot seat answering questions. Each correct answer moves you up the prize ladder — from 100 to 1,000,000.',
    },
    {
      title: 'Three Lifelines',
      content:
        '"50:50" removes two wrong options. "Phone a Friend" gives advice (the friend almost always knows). "Ask the Audience" shows the crowd vote. Each lifeline works only once.',
    },
    {
      title: 'Take the Money',
      content:
        'After any correct answer you may stop and walk away with your winnings — often wiser than risking it. Or press on toward the million.',
    },
    {
      title: 'Checkpoints',
      content:
        "Questions 5 (1,000) and 10 (32,000) are safe checkpoints. Fail after a checkpoint and you're guaranteed its amount.",
    },
  ],
  [GameKey.Bunker]: [
    {
      title: 'The Situation',
      content:
        'A global catastrophe has struck. There is a bunker, but fewer spots than people. Each player gets a random character with a unique set of traits.',
    },
    {
      title: 'The Reveal',
      content:
        'The game runs in 3 rounds. Each round, everyone announces one trait of their character in turn. Profession first, then increasingly unexpected facts.',
    },
    {
      title: 'Discussion',
      content:
        'After each round — open discussion. Persuade, bargain, bluff. Prove to the group that the bunker needs you.',
    },
    {
      title: 'Vote & Outcome',
      content:
        "After three rounds the group votes on who doesn't get in. Then the game simulates the team's survival — revealing whether the choice was right.",
    },
  ],
  [GameKey.Corridor]: [
    {
      title: '1. The Goal',
      content:
        'Get your pawn to the opposite edge first. Player 1 (teal ↑) starts at the bottom and moves up; Player 2 (orange ↓) — top to bottom.',
    },
    {
      title: '2. Turns',
      content:
        'On your turn, either press "Move" and shift your pawn one cell (up, down, left, right), or place one wall — horizontal (─) or vertical (│).',
    },
    {
      title: '3. Walls',
      content:
        "Each player has 10 walls. One wall blocks two adjacent passages. You can't cut off your opponent completely — at least one route to the finish must remain.",
    },
    {
      title: '4. Jumping',
      content:
        'If the pawns stand next to each other, you may jump straight over your opponent. If a wall or the board edge is behind them — jump diagonally around.',
    },
  ],
  [GameKey.MemoRisk]: [
    {
      title: '1. The Goal',
      content:
        'Score the most points before the 100-card deck runs out. Cards lie face down — memorize what is where: collected targets are replaced with new cards from the deck.',
    },
    {
      title: '2. Turns',
      content:
        'At the start of a turn you see the target and the dangerous shape. Flip a target — score its points and keep going. Flip a neutral — no points, but the turn continues and the card stays open until the turn ends. Flip a dangerous one — all turn points burn and the turn passes on.',
    },
    {
      title: '3. Risk or Stop',
      content:
        'You may stop at any moment and bank your turn points. The longer you push, the bigger the reward — and the higher the chance of hitting a dangerous shape.',
    },
    {
      title: '4. Escalation',
      content:
        'After every bust the risk level rises: following turns have more targets and more dangerous shapes at the same time.',
    },
    {
      title: '5. Card Values',
      content:
        'Rarity shows in the frame and the number: common +1, uncommon (green) +5, rare (blue) +10, epic (purple) +20. The lightning super-card doubles all points of the current turn.',
    },
  ],
} as const;

/** Инструкции игры на выбранном языке */
export function getGameInstructions(gameKey: GameKey, lang: Lang): readonly InstructionItem[] {
  const map = lang === 'en' ? GAME_INSTRUCTIONS_EN : GAME_INSTRUCTIONS;
  return map[gameKey] ?? [];
}
