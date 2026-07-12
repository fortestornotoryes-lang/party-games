import {
  ArrowDown,
  Ban,
  Brain,
  Clock,
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

import type { GamesRegistryMap } from './types';
import { GameKey } from './types';

import alieaImage from '@/assets/alias.JPG';
import CodenamesImage from '@/assets/CodenamesImage.JPG';
import ConnectFourImage from '@/assets/ConnectFourImage2.png';
import decryptoImage from '@/assets/DecryptoImage.JPG';
import FakeArtistImage from '@/assets/FakeArtistImage.png';
import hopperImage from '@/assets/hopperImage.png';
import JustOneImage from '@/assets/JustOneImage.png';
import mafia2 from '@/assets/mafia_2.png';
import MemoryImage from '@/assets/memoryImage2.png';
import ResistanceImage from '@/assets/ResistanceImage.png';
import SpyHuntImage from '@/assets/SpyHuntImage.png';
import TabyImage from '@/assets/tabyImage2.JPG';
import telestrationsImg from '@/assets/telephone.png';
import TruthOrDareImage from '@/assets/TruthOrDare123.png';
import WavelengthImage from '@/assets/WavelengthImage.JPG';
import { ALIAS_DIFFICULTY_CONFIG } from '@/games/AliasGame/constants.ts';
import { BUNKER_MODES } from '@/games/BunkerGame/constants.ts';
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
    icon: Shield,
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
    icon: Palette,
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
    icon: Siren,
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
    icon: Route,
    theme: 'teal',
    players: '2',
    minPlayers: 2,
    maxPlayers: 2,
    hasDifficulty: false,
  },
  [GameKey.MemoRisk]: {
    id: GameKey.MemoRisk,
    icon: Shapes,
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
    icon: Trophy,
    theme: 'yellow',
    players: '2+',
    minPlayers: 1,
    hasDifficulty: false,
  },
  [GameKey.TruthOrDare]: {
    id: GameKey.TruthOrDare,
    icon: Flame,
    theme: 'red',
    players: '2+',
    minPlayers: 2,
    backgroundImage: TruthOrDareImage,
    difficultySublabel: cardsLeft,
  },
  [GameKey.Taboo]: {
    id: GameKey.Taboo,
    icon: Ban,
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
    icon: ListChecks,
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
    icon: Pencil,
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
    icon: Grid,
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
    icon: Key,
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
    icon: Brain,
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
  [GameKey.Resistance]: {
    id: GameKey.Resistance,
    icon: Shield,
    theme: 'sky',
    players: '5–10',
    minPlayers: 5,
    maxPlayers: 10,
    backgroundImage: ResistanceImage,
  },
  [GameKey.Wavelength]: {
    id: GameKey.Wavelength,
    icon: Radio,
    theme: 'purple',
    players: '4+',
    minPlayers: 2,
    backgroundImage: WavelengthImage,
    difficultySublabel: wordsLeft,
  },
  [GameKey.JustOne]: {
    id: GameKey.JustOne,
    icon: Lightbulb,
    theme: 'yellow',
    players: '3–12',
    minPlayers: 3,
    maxPlayers: 12,
    backgroundImage: JustOneImage,
    difficultySublabel: wordsLeft,
  },
  [GameKey.Mafia]: {
    id: GameKey.Mafia,
    icon: Users,
    theme: 'orange',
    players: '6–12',
    minPlayers: 6,
    maxPlayers: 12,
    backgroundImage: mafia2,
  },
  [GameKey.ConnectFour]: {
    id: GameKey.ConnectFour,
    icon: LayoutGrid,
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
} as const;
