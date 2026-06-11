import {
    ArrowDown,
    Ban,
    Brain,
    Crown,
    Flame,
    Grid,
    Key,
    LayoutGrid,
    Lightbulb,
    ListChecks,
    Palette,
    Pencil,
    Radio,
    Route,
    Scale,
    Shapes,
    Shield,
    Siren,
    Target,
    Timer,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import {lazy} from 'react';

import alieaImage from '../assets/alias.JPG';
import CodenamesImage from '../assets/CodenamesImage.JPG';
import ConnectFourImage from '../assets/ConnectFourImage2.png';
import decryptoImage from '../assets/DecryptoImage.JPG';
import FakeArtistImage from '../assets/FakeArtistImage.png';
import hopperImage from '../assets/hopperImage.png';
import JustOneImage from '../assets/JustOneImage.png';
import mafia2 from '../assets/mafia_2.png';
import ResistanceImage from '../assets/ResistanceImage.png';
import SpyHuntImage from '../assets/SpyHuntImage.png';
import TabyImage from '../assets/tabyImage2.JPG';
import telestrationsImg from '../assets/telephone.png';
import TruthOrDareImage from '../assets/TruthOrDare.png';
import WavelengthImage from '../assets/WavelengthImage.JPG';
import MemoryImage from '../assets/memoryImage2.png';
import {TABOO_REVERSE_MODES} from '../constants/tabooReverseContent';
import type {GamesRegistryMap} from '../types/games';
import {GameKey} from '../types/games';

import {BUNKER_MODES} from "@/games/BunkerGame/constants.ts";
import {CODENAMES_MODES} from "@/games/CodenamesGame/constants.ts";
import {CONNECT_FOUR_MODES} from "@/games/ConnectFourGame/constants.ts";
import {DECRYPTO_MODES} from "@/games/DecryptoGame/constants.ts";
import {MEMO_RISK_MODES} from "@/games/MemoRiskGame/types.ts";
import {SPY_HUNT_MODES} from "@/games/SpyHuntGame/constants.ts";

// Lazy load game components
const SpyHuntGame = lazy(() =>
    import('../games/SpyHuntGame/SpyHuntGame').then((m) => ({default: m.SpyHuntGame}))
);
const AliasGame = lazy(() =>
    import('../games/AliasGame/AliasGame').then((m) => ({default: m.AliasGame}))
);
const FakeArtistGame = lazy(() =>
    import('../games/FakeArtistGame/FakeArtistGame').then((m) => ({default: m.FakeArtistGame}))
);
const ResistanceGame = lazy(() =>
    import('../games/ResistanceGame/ResistanceGame').then((m) => ({default: m.ResistanceGame}))
);
const WavelengthGame = lazy(() =>
    import('../games/WavelengthGame/WavelengthGame').then((m) => ({default: m.WavelengthGame}))
);
const TelestrationsGame = lazy(() =>
    import('../games/TelestrationsGame/TelestrationsGame').then((m) => ({
        default: m.TelestrationsGame,
    }))
);
const JustOneGame = lazy(() =>
    import('../games/JustOneGame/JustOneGame').then((m) => ({default: m.JustOneGame}))
);
const CodenamesGame = lazy(() =>
    import('../games/CodenamesGame/CodenamesGame').then((m) => ({default: m.CodenamesGame}))
);
const DecryptoGame = lazy(() =>
    import('../games/DecryptoGame/DecryptoGame').then((m) => ({default: m.DecryptoGame}))
);
const MafiaGame = lazy(() => import('../games/MafiaGame/MafiaGame'));
const TruthOrDareGame = lazy(() =>
    import('../games/TruthOrDareGame/TruthOrDareGame').then((m) => ({default: m.TruthOrDareGame}))
);
const ConnectFourGame = lazy(() =>
    import('../games/ConnectFourGame/ConnectFourGame').then((m) => ({default: m.ConnectFourGame}))
);
const TabooReverseGame = lazy(() =>
    import('../games/TabooReverseGame/TabooReverseGame').then((m) => ({
        default: m.TabooReverseGame,
    }))
);
const TabooGame = lazy(() =>
    import('../games/TabooGame/TabooGame').then((m) => ({default: m.TabooGame}))
);
const BunkerGame = lazy(() =>
    import('../games/BunkerGame/BunkerGame').then((m) => ({default: m.BunkerGame}))
);
const MillionaireGame = lazy(() =>
    import('../games/MillionaireGame/MillionaireGame').then((m) => ({default: m.MillionaireGame}))
);
const CorridorGame = lazy(() =>
    import('../games/CorridorGame/CorridorGame').then((m) => ({default: m.CorridorGame}))
);
const MemoRiskGame = lazy(() =>
    import('../games/MemoRiskGame/MemoRiskGame').then((m) => ({default: m.MemoRiskGame}))
);

export const GAMES_REGISTRY: GamesRegistryMap = {
    [GameKey.Spy]: {
        id: GameKey.Spy,
        title: 'SPY HUNT',
        subtitle: 'Вычисли шпиона среди своих',
        icon: Shield,
        theme: 'indigo',
        placeholder: 'Игрок',
        description:
            'Один игрок не знает локацию. Остальные задают вопросы и отвечают так, чтобы не выдать место, но помочь найти шпиона.',
        players: '3–7',
        minPlayers: 3,
        modes: [
            {
                id: SPY_HUNT_MODES.CLASSIC,
                name: 'Классика',
                description: '1 шпион, все остальные знают локацию',
                icon: Target,
            },
            {
                id: SPY_HUNT_MODES.DOUBLE_AGENT,
                name: 'Двойной агент',
                description: '2 шпиона (от 5 игроков)',
                icon: Zap,
            },
            {
                id: SPY_HUNT_MODES.MOLE,
                name: 'Предатель',
                description: '1 шпион и 1 помощник (от 5 игроков)',
                icon: Shield,
            },
        ],
        backgroundImage: SpyHuntImage,
    },
    [GameKey.FakeArtist]: {
        id: GameKey.FakeArtist,
        title: 'FAKE ARTIST',
        subtitle: 'Найди того, кто рисует вслепую',
        icon: Palette,
        theme: 'lime',
        placeholder: 'Игрок',
        description:
            'Все рисуют одно и то же, но один игрок не знает слово и пытается подстроиться под остальных, не выдав себя.',
        players: '4–7',
        minPlayers: 4,
        backgroundImage: FakeArtistImage,
    },
    [GameKey.TruthOrDare]: {
        id: GameKey.TruthOrDare,
        title: 'ПРАВДА ИЛИ ДЕЙСТВИЕ',
        subtitle: 'Выбирай: откровение или вызов',
        icon: Flame,
        theme: 'red',
        placeholder: 'Игрок',
        players: '2+',
        description:
            'Задавайте неудобные вопросы, выполняйте смелые задания и проверяйте, кто готов рискнуть ради веселья.',
        minPlayers: 2,
        backgroundImage: TruthOrDareImage,
    },
    [GameKey.Taboo]: {
        id: GameKey.Taboo,
        title: 'ТАБУ',
        subtitle: 'Объясняй, не называя лишнего',
        icon: Ban,
        theme: 'red',
        placeholder: 'Игрок',
        players: '4–10',
        description:
            'Нужно объяснить слово команде, не используя самые очевидные и запрещённые подсказки с карточки.',
        minPlayers: 4,
        backgroundImage: TabyImage,
    },
    [GameKey.TabooReverse]: {
        id: GameKey.TabooReverse,
        title: 'ТАБУ НАОБОРОТ',
        subtitle: 'Подсказки под запретом — больше нет',
        icon: ListChecks,
        theme: 'orange',
        placeholder: 'Игрок',
        players: '4–10',
        description:
            'Объясняй слово только через запрещённые ассоциации, но не произноси сам ответ. Чем точнее намёк, тем быстрее угадают.',
        minPlayers: 4,
        backgroundImage: TabyImage,
        modes: [
            {
                id: TABOO_REVERSE_MODES.CLASSIC,
                name: 'Классика',
                description: 'Одна карточка за ход, объясняй — кто угадал, получает очки',
                icon: Target,
            },
            {
                id: TABOO_REVERSE_MODES.BLITZ,
                name: 'Блиц',
                description: 'Несколько карточек за ход — угадали, берёте следующую',
                icon: Zap,
            },
            {
                id: TABOO_REVERSE_MODES.TEAM,
                name: 'Командный',
                description: 'Две команды — угадывает только своя команда',
                icon: Users,
            },
        ],
    },
    [GameKey.Telestrations]: {
        id: GameKey.Telestrations,
        title: 'TELESTRATIONS',
        subtitle: 'Рисунок превращается в хаос',
        icon: Pencil,
        theme: 'green',
        placeholder: 'Игрок',
        players: '4–12',
        description:
            'Передавайте слова и рисунки по цепочке, а потом смотрите, как исходная идея смешно меняется на каждом ходе.',
        minPlayers: 4,
        backgroundImage: telestrationsImg,
    },
    [GameKey.Codenames]: {
        id: GameKey.Codenames,
        title: 'CODENAMES',
        subtitle: 'Битва шпионов',
        icon: Grid,
        theme: 'indigo',
        placeholder: 'Агент',
        players: '4+',
        description: 'Битва двух команд шпионов',
        minPlayers: 4,
        modes: [
            {id: CODENAMES_MODES.CLASSIC, name: 'Классика', description: '9 своих, 8 чужих, 1 убийца', icon: Target},
            {
                id: CODENAMES_MODES.DEEP_COVER,
                name: 'Глубокое прикрытие',
                description: '8 своих, 8 чужих, 2 убийцы',
                icon: Shield,
            },
            {
                id: CODENAMES_MODES.DOUBLE_AGENT,
                name: 'Двойной агент',
                description: '8 своих, 8 чужих, 1 общий агент (кто первый нашел)',
                icon: Zap,
            },
        ],
        backgroundImage: CodenamesImage,
    },
    [GameKey.Decrypto]: {
        id: GameKey.Decrypto,
        title: 'DECRYPTO',
        subtitle: 'Коды и перехваты',
        icon: Key,
        theme: 'pink',
        placeholder: 'Шифровальщик',
        players: '4+',
        description:
            'Шифруйте числовые коды для своей команды так, чтобы союзники поняли намёк, а соперники не смогли его перехватить.',
        minPlayers: 4,
        modes: [
            {id: DECRYPTO_MODES.CLASSIC, name: 'Классика', description: '4 слова, код из 3 цифр', icon: Key},
            {id: DECRYPTO_MODES.EXTENDED_5, name: 'Широкий код', description: '5 слов, код из 3 цифр', icon: Target},
            {
                id: DECRYPTO_MODES.EXTENDED_6,
                name: 'Супер-шифровка',
                description: '6 слов, код из 3 цифр',
                icon: Brain,
            },
        ],
        backgroundImage: decryptoImage,
    },
    [GameKey.Alias]: {
        id: GameKey.Alias,
        title: 'ALIAS',
        subtitle: 'Объясни быстрее всех',
        icon: Brain,
        theme: 'red',
        placeholder: 'Игрок',
        players: '4+',
        description:
            'За ограниченное время объясняйте как можно больше слов, не используя однокоренные формы и прямые подсказки.',
        minPlayers: 4,
        backgroundImage: alieaImage,
    },
    [GameKey.Resistance]: {
        id: GameKey.Resistance,
        title: 'RESISTANCE',
        subtitle: 'Свергните тиранию',
        icon: Shield,
        theme: 'sky',
        players: '5–10',
        description:
            'Группа сопротивления пытается выполнить миссии, в то время как шпионы пытаются их саботировать.',
        placeholder: 'Игрок',
        minPlayers: 5,
        backgroundImage: ResistanceImage,
    },
    [GameKey.Wavelength]: {
        id: GameKey.Wavelength,
        title: 'WAVELENGTH',
        subtitle: 'На одной волне',
        icon: Radio,
        theme: 'purple',
        placeholder: 'Игрок',
        players: '4+',
        description: 'Настройся на одну частоту',
        minPlayers: 2,
        backgroundImage: WavelengthImage,
    },
    [GameKey.JustOne]: {
        id: GameKey.JustOne,
        title: 'JUST ONE',
        subtitle: 'Пойми намек команды',
        icon: Lightbulb,
        theme: 'yellow',
        placeholder: 'Игрок',
        players: '3–12',
        description: 'Одно слово — одна подсказка',
        minPlayers: 3,
        backgroundImage: JustOneImage,
    },
    [GameKey.Mafia]: {
        id: GameKey.Mafia,
        title: 'MAFIA',
        subtitle: 'Город засыпает...',
        icon: Users,
        theme: 'orange',
        placeholder: 'Житель',
        players: '6–12',
        description: 'Город засыпает...',
        minPlayers: 6,
        backgroundImage: mafia2,
    },

    [GameKey.ConnectFour]: {
        id: GameKey.ConnectFour,
        title: 'ЧЕТЫРЕ В РЯД',
        subtitle: 'Connect Four',
        icon: LayoutGrid,
        theme: 'red',
        placeholder: 'Игрок',
        players: '2',
        description: 'Первым собери 4 фишки в ряд — по горизонтали, вертикали или диагонали.',
        minPlayers: 2,
        backgroundImage: ConnectFourImage,
        modes: [
            {id: CONNECT_FOUR_MODES.CLASSIC, name: 'Классика', description: '7×6 — собери 4 фишки в ряд', icon: Grid},
            {
                id: CONNECT_FOUR_MODES.LARGE,
                name: 'Большое поле',
                description: '9×7 — больше пространства для тактики',
                icon: LayoutGrid,
            },
            {
                id: CONNECT_FOUR_MODES.CONNECT_FIVE,
                name: 'Пять в ряд',
                description: '9×7 — нужно собрать 5 фишек подряд',
                icon: Target,
            },
            {
                id: CONNECT_FOUR_MODES.POP_OUT,
                name: 'Pop Out',
                description: '7×6 — вытащи нижнюю фишку из столбца',
                icon: ArrowDown,
            },
        ],
    },

    [GameKey.Bunker]: {
        id: GameKey.Bunker,
        title: 'БУНКЕР',
        subtitle: 'Кто заслуживает выжить?',
        icon: Siren,
        theme: 'orange',
        placeholder: 'Выживший',
        players: '4–10',
        description:
            'Катастрофа наступила. Бункер вмещает лишь половину группы. Каждый получает случайного персонажа — и борется за место внутри.',
        minPlayers: 4,
        backgroundImage: hopperImage,
        modes: [
            {
                id: BUNKER_MODES.CLASSIC,
                name: 'Классика',
                description: 'Раунды раскрытия по очереди, честное голосование',
                icon: Target,
            },
            {
                id: BUNKER_MODES.DICTATOR,
                name: 'Диктатор',
                description: 'Один игрок — директор бункера, его место гарантировано',
                icon: Crown,
            },
            {
                id: BUNKER_MODES.TRIBUNAL,
                name: 'Трибунал',
                description: 'После голосования один исключённый может раскрыть скрытую черту',
                icon: Scale,
            },
        ],
    },

    [GameKey.Corridor]: {
        id: GameKey.Corridor,
        title: 'КОРИДОР',
        subtitle: 'Дойди первым до другой стороны',
        icon: Route,
        theme: 'teal',
        placeholder: 'Игрок',
        players: '2',
        description:
            'Двигай фишку к противоположному краю или ставь перегородки, чтобы преградить путь сопернику. Нельзя замуровать — путь должен оставаться.',
        minPlayers: 2,
    },

    [GameKey.MemoRisk]: {
        id: GameKey.MemoRisk,
        title: 'МЕМО-РИСК',
        subtitle: 'Запомни и рискни',
        icon: Shapes,
        theme: 'pink',
        placeholder: 'Игрок',
        players: '2+',
        description:
            'Открывай карты, запоминай поле и собирай целевые фигуры. Наткнёшься на опасную — очки хода сгорят. Рискни ещё раз или забери очки.',
        minPlayers: 2,
        backgroundImage: MemoryImage,

        modes: [
            {
                id: MEMO_RISK_MODES.CLASSIC,
                name: 'Классика',
                description: 'Открывай без ограничений, пока сам не решишь остановиться',
                icon: Grid,
            },
            {
                id: MEMO_RISK_MODES.TIMED,
                name: 'На время',
                description: 'Ограниченное время на ход — решай быстрее',
                icon: Timer,
            },
            {
                id: MEMO_RISK_MODES.LIMITED,
                name: 'Ограниченные ходы',
                description: 'Фиксированное число открытий за ход',
                icon: ListChecks,
            },
        ],
    },

    [GameKey.Millionaire]: {
        id: GameKey.Millionaire,
        title: 'МИЛЛИОНЕР',
        subtitle: 'Кто хочет стать миллионером',
        icon: Trophy,
        theme: 'yellow',
        placeholder: 'Игрок',
        players: '2+',
        description:
            'По очереди садитесь в горячее кресло и отвечайте на 15 вопросов возрастающей сложности. Три подсказки, два несгораемых рубежа — и шанс выиграть миллион.',
        minPlayers: 1,
    },
} as const;

export {
    SpyHuntGame,
    AliasGame,
    FakeArtistGame,
    ResistanceGame,
    WavelengthGame,
    TelestrationsGame,
    JustOneGame,
    CodenamesGame,
    DecryptoGame,
    MafiaGame,
    TruthOrDareGame,
    ConnectFourGame,
    TabooReverseGame,
    TabooGame,
    BunkerGame,
    MillionaireGame,
    CorridorGame,
    MemoRiskGame,
};
