import React, {lazy} from 'react';
import TruthOrDareImage from '../assets/TruthOrDare.png';
import decryptoImage from '../assets/decryptoImage.png';
import FakeArtistImage from '../assets/FakeArtistImage.png';
import CodenamesImage from '../assets/CodenamesImage.png';
import JustOneImage from '../assets/JustOneImage.png';
import mafia2 from '../assets/mafia_2.png';
import telestrationsImg from '../assets/telephone.png';
import ResistanceImage from '../assets/ResistanceImage.png';
import SpyHuntImage from '../assets/SpyHuntImage.png';
import WavelengthImage from '../assets/WavelengthImage.png';
import alieaImage from '../assets/alieaImage.png';
import TabyImage from '../assets/tabyImage.png';
import ConnectFourImage from '../assets/ConnectFourImage2.png';
import {
    Shield,
    Palette,
    Brain,
    Pencil,
    Lightbulb,
    Radio,
    Target,
    Zap,
    Shield as ShieldIcon,
    Grid,
    Key,
    LucideIcon,
    Users,
    Flame,
    LayoutGrid,
    ArrowDown,
    ListChecks,
    Ban
} from 'lucide-react';
import {GameStatus} from '../types';
import {GameKey, GamesRegistryMap} from '../types/games';

// Lazy load game components
const SpyHuntGame = lazy(() => import('../games/SpyHuntGame/SpyHuntGame').then(m => ({default: m.SpyHuntGame})));
const AliasGame = lazy(() => import('../games/AliasGame/AliasGame').then(m => ({default: m.AliasGame})));
const FakeArtistGame = lazy(() => import('../games/FakeArtistGame/FakeArtistGame').then(m => ({default: m.FakeArtistGame})));
const ResistanceGame = lazy(() => import('../games/ResistanceGame/ResistanceGame').then(m => ({default: m.ResistanceGame})));
const WavelengthGame = lazy(() => import('../games/WavelengthGame/WavelengthGame').then(m => ({default: m.WavelengthGame})));
const TelestrationsGame = lazy(() => import('../games/TelestrationsGame/TelestrationsGame').then(m => ({default: m.TelestrationsGame})));
const JustOneGame = lazy(() => import('../games/JustOneGame/JustOneGame').then(m => ({default: m.JustOneGame})));
const CodenamesGame = lazy(() => import('../games/CodenamesGame/CodenamesGame').then(m => ({default: m.CodenamesGame})));
const DecryptoGame = lazy(() => import('../games/DecryptoGame/DecryptoGame').then(m => ({default: m.DecryptoGame})));
const MafiaGame = lazy(() => import('../games/MafiaGame/MafiaGame'));
const TruthOrDareGame = lazy(() => import('../games/TruthOrDareGame/TruthOrDareGame').then(m => ({default: m.TruthOrDareGame})));
const ConnectFourGame = lazy(() => import('../games/ConnectFourGame/ConnectFourGame').then(m => ({default: m.ConnectFourGame})));
const TabooReverseGame = lazy(() => import('../games/TabooReverseGame/TabooReverseGame').then(m => ({default: m.TabooReverseGame})));
const TabooGame = lazy(() => import('../games/TabooGame/TabooGame').then(m => ({default: m.TabooGame})));

export const GAMES_REGISTRY: GamesRegistryMap = {
    [GameKey.Spy]: {
        id: GameKey.Spy,
        title: 'SPY HUNT',
        subtitle: 'Поиск тайного агента',
        icon: Shield,
        theme: 'indigo',
        placeholder: 'Игрок',
        description: '1 игрок — шпион. Все остальные знают локацию. Шпион должен догадаться, где он находится, по вопросам.',
        players: '4–7',
        minPlayers: 4,
        setupStatus: GameStatus.SpyHuntPlaying,
        modes: [
            {id: 'classic', name: 'Классика', description: '1 шпион, все остальные знают локацию', icon: Target},
            {id: 'double_agent', name: 'Двойной агент', description: '2 шпиона (от 5 игроков)', icon: Zap},
            {id: 'mole', name: 'Предатель', description: '1 шпион и 1 помощник (от 5 игроков)', icon: ShieldIcon},
        ],
        backgroundImage: SpyHuntImage,

    },
    [GameKey.FakeArtist]: {
        id: GameKey.FakeArtist,
        title: 'FAKE ARTIST',
        subtitle: 'Найдите фейкового автора',
        icon: Palette,
        theme: 'lime',
        placeholder: 'Игрок',
        description: 'В этой игре один игрок — фейковый художник, который не знает, что рисуют остальные.',
        players: '4–7',
        minPlayers: 4,
        setupStatus: GameStatus.FakeArtistPlaying,
        backgroundImage: FakeArtistImage,

    },
    [GameKey.TruthOrDare]: {
        id: GameKey.TruthOrDare,
        title: 'ПРАВДА ИЛИ ДЕЙСТВИЕ',
        subtitle: 'Честность или риск',
        icon: Flame,
        theme: 'cyan',
        placeholder: 'Игрок',
        players: '2+',
        description: 'Классическая игра: ответь честно на вопрос или выполни задание',
        minPlayers: 2,
        setupStatus: GameStatus.TruthOrDarePlaying,
        backgroundImage: TruthOrDareImage,

    },
    [GameKey.Taboo]: {
        id: GameKey.Taboo,
        title: 'ТАБУ',
        subtitle: 'Объясни без запрещённых слов',
        icon: Ban,
        theme: 'red',
        placeholder: 'Игрок',
        players: '4–10',
        description: 'Объясняй загаданное слово любыми словами — кроме запрещённых на карточке!',
        minPlayers: 4,
        setupStatus: GameStatus.TabooPlaying,
        backgroundImage: TabyImage,
    },
    [GameKey.TabooReverse]: {
        id: GameKey.TabooReverse,
        title: 'ТАБУ НАОБОРОТ',
        subtitle: 'Запрещённые слова — твои подсказки',
        icon: ListChecks,
        theme: 'orange',
        placeholder: 'Игрок',
        players: '4–10',
        description: 'Объясняй загаданное слово, используя только запрещённые слова. Само слово называть нельзя!',
        minPlayers: 4,
        setupStatus: GameStatus.TabooReversePlaying,
        backgroundImage: TabyImage,
        modes: [
            { id: 'classic', name: 'Классика',  description: 'Одна карточка за ход, объясняй — кто угадал, получает очки', icon: Target },
            { id: 'blitz',   name: 'Блиц',      description: 'Несколько карточек за ход — угадали, берёте следующую',       icon: Zap    },
            { id: 'team',    name: 'Командный',  description: 'Две команды — угадывает только своя команда',                 icon: Users  },
        ],
    },
    [GameKey.Telestrations]: {
        id: GameKey.Telestrations,
        title: 'TELESTRATIONS',
        subtitle: 'Испорченный рисунок',
        icon: Pencil,
        theme: 'green',
        placeholder: 'Игрок',
        players: '4–12',
        description: 'Рисуй и угадывай по цепочке',
        minPlayers: 4,
        setupStatus: GameStatus.TelestrationsPlaying,
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
        setupStatus: GameStatus.CodenamesPlaying,
        modes: [
            {id: 'classic', name: 'Классика', description: '9 своих, 8 чужих, 1 убийца', icon: Target},
            {id: 'deep_cover', name: 'Глубокое прикрытие', description: '8 своих, 8 чужих, 2 убийцы', icon: ShieldIcon},
            {
                id: 'double_agent',
                name: 'Двойной агент',
                description: '8 своих, 8 чужих, 1 общий агент (кто первый нашел)',
                icon: Zap
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
        description: 'Шифруй свои, перехватывай чужие',
        minPlayers: 4,
        setupStatus: GameStatus.DecryptoPlaying,
        modes: [
            {id: 'classic', name: 'Классика', description: '4 слова, код из 3 цифр', icon: Key},
            {id: 'extended_5', name: 'Широкий код', description: '5 слов, код из 3 цифр', icon: Target},
            {id: 'extended_6', name: 'Супер-шифровка', description: '6 слов, код из 3 цифр', icon: Brain},
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
        description: 'Объясни слово быстрее всех',
        minPlayers: 4,
        setupStatus: GameStatus.AliasPlaying,
        backgroundImage: alieaImage,

    },
    [GameKey.Resistance]: {
        id: GameKey.Resistance,
        title: 'RESISTANCE',
        subtitle: 'Свергните тиранию',
        icon: Shield,
        theme: 'sky',
        players: '5–10',
        description: 'Группа сопротивления пытается выполнить миссии, в то время как шпионы пытаются их саботировать.',
        placeholder: 'Игрок',
        minPlayers: 5,
        setupStatus: GameStatus.ResistancePlaying,
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
        setupStatus: GameStatus.WavelengthPlaying,
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
        setupStatus: GameStatus.JustOnePlaying,
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
        setupStatus: GameStatus.MafiaPlaying,
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
        setupStatus: GameStatus.ConnectFourPlaying,
        backgroundImage: ConnectFourImage,
        modes: [
            { id: 'classic',      name: 'Классика',     description: '7×6 — собери 4 фишки в ряд',           icon: Grid },
            { id: 'large',        name: 'Большое поле', description: '9×7 — больше пространства для тактики', icon: LayoutGrid },
            { id: 'connect_five', name: 'Пять в ряд',   description: '9×7 — нужно собрать 5 фишек подряд',   icon: Target },
            { id: 'pop_out',      name: 'Pop Out',       description: '7×6 — вытащи нижнюю фишку из столбца', icon: ArrowDown },
        ],
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
};
