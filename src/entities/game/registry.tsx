import {
  ArrowDown,
  Brain,
  Clock,
  Crown,
  Grid,
  Key,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  Scale,
  Shield,
  Target,
  Timer,
  Users,
  Zap,
} from 'lucide-react';

import {
  AliasIcon, BunkerIcon, ChessIcon, CodenamesIcon, ConnectFourIcon, CorridorIcon,
  CrocodileIcon, DecryptoIcon, FakeArtistIcon, JustOneIcon, MafiaIcon, MemoRiskIcon,
  MillionaireIcon, ResistanceIcon, SpyIcon, TabooIcon, TabooReverseIcon,
  TelestrationsIcon, TruthOrDareIcon, TwoTruthsIcon, WavelengthIcon, WhoAmongUsIcon,
} from './gameIcons';
import type { GamesRegistryMap } from './types';
import { GameKey } from './types';

import alieaImage from '@/assets/alias.webp';
import ChessCardImage from '@/assets/ChessCard.webp';
import CodenamesImage from '@/assets/CodenamesImage.webp';
import ConnectFourImage from '@/assets/ConnectFourImage2.webp';
import CorridorCardImage from '@/assets/CorridorCard.webp';
import CrocodileCardImage from '@/assets/CrocodileCard.webp';
import decryptoImage from '@/assets/DecryptoImage.webp';
import FakeArtistImage from '@/assets/FakeArtistImage.webp';
import hopperImage from '@/assets/hopperImage.webp';
import JustOneImage from '@/assets/JustOneImage.webp';
import mafia2 from '@/assets/mafia_2.webp';
import MemoryImage from '@/assets/memoryImage2.webp';
import MillionaireCardImage from '@/assets/MillionaireCard.webp';
import ResistanceImage from '@/assets/ResistanceImage.webp';
import SpyHuntImage from '@/assets/SpyHuntImage.webp';
import TabyImage from '@/assets/tabyImage2.webp';
import telestrationsImg from '@/assets/telephone.webp';
import TruthOrDareImage from '@/assets/TruthOrDare123.webp';
import TwoTruthsCardImage from '@/assets/TwoTruthsCard.webp';
import WavelengthImage from '@/assets/WavelengthImage.webp';
import WhoAmongUsCardImage from '@/assets/WhoAmongUsCard.webp';
import { ALIAS_DIFFICULTY_CONFIG } from '@/games/AliasGame/constants.ts';
import { BUNKER_MODES } from '@/games/BunkerGame/constants.ts';
import { CHESS_MODES } from '@/games/ChessGame/constants.ts';
import { CODENAMES_MODES } from '@/games/CodenamesGame/constants.ts';
import { CONNECT_FOUR_MODES } from '@/games/ConnectFourGame/constants.ts';
import { DECRYPTO_MODES } from '@/games/DecryptoGame/constants.ts';
import { MEMO_RISK_DIFFICULTY_CONFIG } from '@/games/MemoRiskGame/constants.ts';
import { MEMO_RISK_MODES } from '@/games/MemoRiskGame/types.ts';
import { GAME_DURATION_BY_DIFFICULTY, SPY_HUNT_MODES } from '@/games/SpyHuntGame/constants.ts';
import { TABOO_REVERSE_MODES } from '@/games/TabooReverseGame/constants.ts';
import { DIFFICULTY_CONFIG as TELESTRATIONS_DIFFICULTY_CONFIG } from '@/games/TelestrationsGame/constants.ts';
import type { TranslateFn } from '@/shared/i18n/types';
import type { Difficulty } from '@/shared/types';

// Тексты (title/subtitle/описания/режимы/настройки) — в словарях i18n:
// registry.games.<gameKey>; локализованные метаданные отдаёт useLocalizedGame.

// Подписи под кнопками сложности: остаток контента в пуле игры
const cardsLeft = (_d: Difficulty, remaining: number | undefined, t: TranslateFn) =>
  remaining !== undefined ? t('registry.sublabels.cardsLeft', { n: remaining }) : undefined;

const wordsLeft = (_d: Difficulty, remaining: number | undefined, t: TranslateFn) =>
  remaining !== undefined ? t('registry.sublabels.wordsLeft', { n: remaining }) : undefined;

export const GAMES_REGISTRY: GamesRegistryMap = {
  [GameKey.Spy]: {
    id: GameKey.Spy,
    icon: SpyIcon,
    theme: 'indigo',
    players: '3–7',
    minPlayers: 3,
    maxPlayers: 7,
    difficultySublabel: (d, remaining, t) => {
      const mins = Math.floor(GAME_DURATION_BY_DIFFICULTY[d] / 60);
      const minsStr = t('registry.sublabels.minutes', { n: mins });
      return remaining !== undefined ? `${minsStr} · ${remaining}` : minsStr;
    },
    modes: [
      { id: SPY_HUNT_MODES.CLASSIC, icon: Target },
      { id: SPY_HUNT_MODES.DOUBLE_AGENT, icon: Zap },
      { id: SPY_HUNT_MODES.MOLE, icon: Shield },
    ],
    backgroundImage: SpyHuntImage,
  },
  [GameKey.FakeArtist]: {
    id: GameKey.FakeArtist,
    icon: FakeArtistIcon,
    theme: 'lime',
    players: '4–7',
    minPlayers: 4,
    maxPlayers: 7,
    backgroundImage: FakeArtistImage,
    difficultySublabel: wordsLeft,
    settings: [
      {
        key: 'rounds',
        icon: Shield,
        color: 'green',
        options: [{ value: 1 }, { value: 2 }, { value: 3 }],
      },
      {
        key: 'timerSeconds',
        icon: Zap,
        color: 'green',
        options: [{ value: 0 }, { value: 15 }, { value: 30 }],
      },
    ],
  },
  [GameKey.Bunker]: {
    id: GameKey.Bunker,
    icon: BunkerIcon,
    theme: 'orange',
    players: '4–10',
    minPlayers: 4,
    maxPlayers: 10,
    backgroundImage: hopperImage,
    settings: [
      {
        key: 'rounds',
        icon: Shield,
        color: 'orange',
        options: [{ value: 3 }, { value: 5 }, { value: 7 }],
      },
      {
        key: 'countHiddenTraits',
        icon: Target,
        color: 'orange',
        options: [{ value: true }, { value: false }],
      },
    ],
    modes: [
      { id: BUNKER_MODES.CLASSIC, icon: Target },
      { id: BUNKER_MODES.DICTATOR, icon: Crown },
      { id: BUNKER_MODES.TRIBUNAL, icon: Scale },
    ],
  },
  [GameKey.Corridor]: {
    id: GameKey.Corridor,
    icon: CorridorIcon,
    theme: 'teal',
    players: '2',
    minPlayers: 2,
    maxPlayers: 2,
    hasDifficulty: false,
    backgroundImage: CorridorCardImage,
  },
  [GameKey.MemoRisk]: {
    id: GameKey.MemoRisk,
    icon: MemoRiskIcon,
    theme: 'pink',
    players: '2+',
    minPlayers: 2,
    backgroundImage: MemoryImage,
    difficultySublabel: (d, _remaining, t) => {
      const { gridSize, shapeCount } = MEMO_RISK_DIFFICULTY_CONFIG[d];
      return `${gridSize}×${gridSize} · ${t('registry.sublabels.shapes', { n: shapeCount })}`;
    },
    modes: [
      { id: MEMO_RISK_MODES.CLASSIC, icon: Grid },
      { id: MEMO_RISK_MODES.TIMED, icon: Timer },
      { id: MEMO_RISK_MODES.LIMITED, icon: ListChecks },
    ],
  },
  [GameKey.Millionaire]: {
    id: GameKey.Millionaire,
    icon: MillionaireIcon,
    theme: 'yellow',
    players: '2+',
    minPlayers: 1,
    hasDifficulty: false,
    backgroundImage: MillionaireCardImage,
  },
  [GameKey.TruthOrDare]: {
    id: GameKey.TruthOrDare,
    icon: TruthOrDareIcon,
    theme: 'red',
    players: '2+',
    minPlayers: 2,
    backgroundImage: TruthOrDareImage,
    difficultySublabel: cardsLeft,
  },
  [GameKey.Taboo]: {
    id: GameKey.Taboo,
    icon: TabooIcon,
    theme: 'red',
    players: '4–10',
    minPlayers: 4,
    maxPlayers: 10,
    backgroundImage: TabyImage,
    difficultySublabel: cardsLeft,
    settings: [
      {
        key: 'timerSeconds',
        icon: Clock,
        color: 'red',
        options: [{ value: 30 }, { value: 45 }, { value: 60 }, { value: 90 }],
      },
    ],
  },
  [GameKey.TabooReverse]: {
    id: GameKey.TabooReverse,
    icon: TabooReverseIcon,
    theme: 'orange',
    players: '4–10',
    minPlayers: 4,
    maxPlayers: 10,
    backgroundImage: TabyImage,
    difficultySublabel: cardsLeft,
    settings: [
      {
        key: 'timerSeconds',
        icon: Clock,
        color: 'orange',
        options: [{ value: 30 }, { value: 45 }, { value: 60 }, { value: 90 }],
      },
    ],
    modes: [
      { id: TABOO_REVERSE_MODES.CLASSIC, icon: Target },
      { id: TABOO_REVERSE_MODES.BLITZ, icon: Zap },
      { id: TABOO_REVERSE_MODES.TEAM, icon: Users },
    ],
  },
  [GameKey.Telestrations]: {
    id: GameKey.Telestrations,
    icon: TelestrationsIcon,
    theme: 'green',
    players: '4–12',
    minPlayers: 4,
    maxPlayers: 12,
    backgroundImage: telestrationsImg,
    difficultySublabel: (d, remaining, t) => {
      const cfg = TELESTRATIONS_DIFFICULTY_CONFIG[d];
      const timeStr = `${t('common.secondsShort', { n: cfg.drawTime })} / ${t('common.secondsShort', { n: cfg.guessTime })}`;
      return remaining !== undefined ? `${timeStr} · ${remaining}` : timeStr;
    },
  },
  [GameKey.Codenames]: {
    id: GameKey.Codenames,
    icon: CodenamesIcon,
    theme: 'indigo',
    players: '4+',
    minPlayers: 4,
    difficultySublabel: wordsLeft,
    modes: [
      { id: CODENAMES_MODES.CLASSIC, icon: Target },
      { id: CODENAMES_MODES.DEEP_COVER, icon: Shield },
      { id: CODENAMES_MODES.DOUBLE_AGENT, icon: Zap },
    ],
    backgroundImage: CodenamesImage,
  },
  [GameKey.Decrypto]: {
    id: GameKey.Decrypto,
    icon: DecryptoIcon,
    theme: 'pink',
    players: '4+',
    minPlayers: 4,
    difficultySublabel: wordsLeft,
    modes: [
      { id: DECRYPTO_MODES.CLASSIC, icon: Key },
      { id: DECRYPTO_MODES.EXTENDED_5, icon: Target },
      { id: DECRYPTO_MODES.EXTENDED_6, icon: Brain },
    ],
    backgroundImage: decryptoImage,
  },
  [GameKey.Alias]: {
    id: GameKey.Alias,
    icon: AliasIcon,
    theme: 'red',
    players: '4+',
    minPlayers: 4,
    backgroundImage: alieaImage,
    difficultySublabel: (d, remaining, t) => {
      const { roundTime } = ALIAS_DIFFICULTY_CONFIG[d];
      const secStr = t('registry.sublabels.seconds', { n: roundTime });
      return remaining !== undefined ? `${secStr} · ${remaining}` : secStr;
    },
  },
  [GameKey.Crocodile]: {
    id: GameKey.Crocodile,
    icon: CrocodileIcon,
    theme: 'lime',
    players: '4+',
    minPlayers: 4,
    // Сложность выбирает объясняющий в каждом раунде (3 слова), общей настройки нет
    hasDifficulty: false,
    backgroundImage: CrocodileCardImage,
  },
  [GameKey.Resistance]: {
    id: GameKey.Resistance,
    icon: ResistanceIcon,
    theme: 'sky',
    players: '5–10',
    minPlayers: 5,
    maxPlayers: 10,
    backgroundImage: ResistanceImage,
  },
  [GameKey.Wavelength]: {
    id: GameKey.Wavelength,
    icon: WavelengthIcon,
    theme: 'purple',
    players: '4+',
    minPlayers: 2,
    backgroundImage: WavelengthImage,
    difficultySublabel: wordsLeft,
  },
  [GameKey.JustOne]: {
    id: GameKey.JustOne,
    icon: JustOneIcon,
    theme: 'yellow',
    players: '3–12',
    minPlayers: 3,
    maxPlayers: 12,
    backgroundImage: JustOneImage,
    difficultySublabel: wordsLeft,
  },
  [GameKey.TwoTruths]: {
    id: GameKey.TwoTruths,
    icon: TwoTruthsIcon,
    theme: 'teal',
    players: '3+',
    minPlayers: 3,
    // Каждый игрок рассказывает по разу — количество раундов равно числу игроков
    hasDifficulty: false,
    backgroundImage: TwoTruthsCardImage,
  },
  [GameKey.WhoAmongUs]: {
    id: GameKey.WhoAmongUs,
    icon: WhoAmongUsIcon,
    theme: 'pink',
    players: '3+',
    minPlayers: 3,
    hasDifficulty: false,
    backgroundImage: WhoAmongUsCardImage,
  },
  [GameKey.Mafia]: {
    id: GameKey.Mafia,
    icon: MafiaIcon,
    theme: 'orange',
    players: '6–12',
    minPlayers: 6,
    maxPlayers: 12,
    backgroundImage: mafia2,
  },
  [GameKey.ConnectFour]: {
    id: GameKey.ConnectFour,
    icon: ConnectFourIcon,
    theme: 'red',
    players: '2',
    minPlayers: 2,
    maxPlayers: 2,
    backgroundImage: ConnectFourImage,
    hasDifficulty: false,
    modes: [
      { id: CONNECT_FOUR_MODES.CLASSIC, icon: Grid },
      { id: CONNECT_FOUR_MODES.LARGE, icon: LayoutGrid },
      { id: CONNECT_FOUR_MODES.CONNECT_FIVE, icon: Target },
      { id: CONNECT_FOUR_MODES.POP_OUT, icon: ArrowDown },
    ],
  },
  [GameKey.Chess]: {
    id: GameKey.Chess,
    icon: ChessIcon,
    theme: 'green',
    players: '1–2',
    minPlayers: 1,
    maxPlayers: 2,
    backgroundImage: ChessCardImage,
    modes: [
      { id: CHESS_MODES.COMPUTER, icon: Brain },
      { id: CHESS_MODES.LOCAL, icon: Users },
      { id: CHESS_MODES.TRAINING, icon: Lightbulb },
    ],
  },

} as const;
