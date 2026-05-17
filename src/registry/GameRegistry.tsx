import React, { lazy } from 'react';
import { Shield, Palette, Brain, Pencil, Lightbulb, Radio, Target, Zap, Shield as ShieldIcon, Grid, Key, LucideIcon, Users } from 'lucide-react';
import { GameStatus, GameMetadata } from '../types';
import { GameKey, GamesRegistryMap } from '../types/games';
// Lazy load game components
const SpyHuntGame = lazy(() => import('../games/SpyHuntGame/SpyHuntGame').then(m => ({ default: m.SpyHuntGame })));
const AliasGame = lazy(() => import('../games/AliasGame/AliasGame').then(m => ({ default: m.AliasGame })));
const FakeArtistGame = lazy(() => import('../games/FakeArtistGame/FakeArtistGame').then(m => ({ default: m.FakeArtistGame })));
const ResistanceGame = lazy(() => import('../games/ResistanceGame/ResistanceGame').then(m => ({ default: m.ResistanceGame })));
const WavelengthGame = lazy(() => import('../games/WavelengthGame/WavelengthGame').then(m => ({ default: m.WavelengthGame })));
const TelestrationsGame = lazy(() => import('../games/TelestrationsGame/TelestrationsGame').then(m => ({ default: m.TelestrationsGame })));
const JustOneGame = lazy(() => import('../games/JustOneGame/JustOneGame').then(m => ({ default: m.JustOneGame })));
const CodenamesGame = lazy(() => import('../games/CodenamesGame/CodenamesGame').then(m => ({ default: m.CodenamesGame })));
const DecryptoGame = lazy(() => import('../games/DecryptoGame/DecryptoGame').then(m => ({ default: m.DecryptoGame })));
const MafiaGame = lazy(() => import('../games/MafiaGame/MafiaGame'));

// Lazy load distribution screens
const RoleDistribution = lazy(() => import('../games/SpyHuntGame/components/RoleDistribution').then(m => ({ default: m.RoleDistribution })));
const FakeArtistDistribution = lazy(() => import('../games/FakeArtistGame/components/FakeArtistDistribution').then(m => ({ default: m.FakeArtistDistribution })));
const ResistanceDistribution = lazy(() => import('../games/ResistanceGame/components/ResistanceDistribution').then(m => ({ default: m.ResistanceDistribution })));
const FakeArtistVoting = lazy(() => import('../games/FakeArtistGame/components/FakeArtistVoting').then(m => ({ default: m.FakeArtistVoting })));

// export const GAMES_REGISTRY: Record<string, GameMetadata> = {
//   spy: {
//     id: 'spy',
//     title: 'SPY HUNT',
//     subtitle: 'Поиск тайного агента',
//     icon: Shield,
//     theme: 'red',
//     placeholder: 'Игрок',
//     description: '1 игрок — шпион. Все остальные знают локацию. Шпион должен догадаться, где он находится, по вопросам.',
//     description: 'Раскройте лжеца среди своих',
//     players: '4–7',
//     instructions: SPY_HUNT_INSTRUCTIONS,
//     minPlayers: 4,
//     setupStatus: 'distributing',
//     modes: [
//       { id: 'classic', name: 'Классика', description: '1 шпион, все остальные знают локацию', icon: Target },
//       { id: 'double_agent', name: 'Двойной агент', description: '2 шпиона (от 5 игроков)', icon: Zap },
//       { id: 'mole', name: 'Предатель', description: '1 шпион и 1 помощник (от 5 игроков)', icon: ShieldIcon },
//     ]
//   },
//   fake_artist: {
//     id: 'fake_artist',
//     title: 'FAKE ARTIST',
//     subtitle: 'Найдите фейкового автора',
//     icon: Palette,
//     theme: 'emerald',
//     placeholder: 'Игрок',
//     description: 'В этой игре один игрок — фейковый художник, который не знает, что рисуют остальные.',
//     description: 'Кто-то рисует, не зная темы',
//     players: '4–7',
//     instructions: FAKE_ARTIST_INSTRUCTIONS,
//     minPlayers: 4,
//     setupStatus: 'fake_artist_distributing'
//   },
//   resistance: {
//     id: 'resistance',
//     title: 'RESISTANCE',
//     subtitle: 'Свергните тиранию',
//     icon: Shield,
//     theme: 'sky',
//     players: '5–10',
//     description: 'Шпионы против повстанцев',
//     placeholder: 'Игрок',
//     instructions: RESISTANCE_INSTRUCTIONS,
//     description: 'Группа сопротивления пытается выполнить миссии, в то время как шпионы пытаются их саботировать.',
//     minPlayers: 5,
//     setupStatus: 'resistance_distributing'
//   },
//   alias: {
//     id: 'alias',
//     title: 'ALIAS',
//     subtitle: 'Объясни быстрее всех',
//     icon: Brain,
//     theme: 'sky',
//     placeholder: 'Игрок',
//     players: '4+',
//     description: 'Объясни слово быстрее всех',
//     instructions: ALIAS_INSTRUCTIONS,
//     minPlayers: 4,
//     setupStatus: 'alias_playing'
//   },
//   just_one: {
//     id: 'just_one',
//     title: 'JUST ONE',
//     subtitle: 'Пойми намек команды',
//     icon: Lightbulb,
//     theme: 'yellow',
//     placeholder: 'Игрок',
//     players: '3–12',
//     description: 'Одно слово — одна подсказка',
//     instructions: JUST_ONE_INSTRUCTIONS,
//     minPlayers: 3,
//     setupStatus: 'just_one_playing'
//   },
//   telestrations: {
//     id: 'telestrations',
//     title: 'TELESTRATIONS',
//     subtitle: 'Испорченный рисунок',
//     icon: Pencil,
//     theme: 'orange',
//     placeholder: 'Игрок',
//     players: '4–12',
//     description: 'Рисуй и угадывай по цепочке',
//     instructions: TELESTRATIONS_INSTRUCTIONS,
//     minPlayers: 4,
//     setupStatus: 'telestrations_playing'
//   },
//   wavelength: {
//     id: 'wavelength',
//     title: 'WAVELENGTH',
//     subtitle: 'На одной волне',
//     icon: Radio,
//     theme: 'purple',
//     placeholder: 'Игрок',
//     players: '4+',
//     description: 'Настройся на одну частоту',
//     instructions: WAVELENGTH_INSTRUCTIONS,
//     minPlayers: 2,
//     setupStatus: 'wavelength_playing'
//   },
//   codenames: {
//     id: 'codenames',
//     title: 'CODENAMES',
//     subtitle: 'Битва шпионов',
//     icon: Grid,
//     theme: 'emerald',
//     placeholder: 'Агент',
//     players: '4+',
//     description: 'Битва двух команд шпионов',
//     instructions: CODENAMES_INSTRUCTIONS,
//     minPlayers: 4,
//     setupStatus: 'codenames_playing',
//     modes: [
//       { id: 'classic', name: 'Классика', description: '9 своих, 8 чужих, 1 убийца', icon: Target },
//       { id: 'deep_cover', name: 'Глубокое прикрытие', description: '8 своих, 8 чужих, 2 убийцы', icon: ShieldIcon },
//       { id: 'double_agent', name: 'Двойной агент', description: '8 своих, 8 чужих, 1 общий агент (кто первый нашел)', icon: Zap },
//     ]
//   },
//   decrypto: {
//     id: 'decrypto',
//     title: 'DECRYPTO',
//     subtitle: 'Коды и перехваты',
//     icon: Key,
//     theme: 'purple',
//     placeholder: 'Шифровальщик',
//     players: '4+',
//     description: 'Шифруй свои, перехватывай чужие',
//     instructions: DECRYPTO_INSTRUCTIONS,
//     minPlayers: 4,
//     setupStatus: 'decrypto_playing',
//     modes: [
//       { id: 'classic', name: 'Классика', description: '4 слова, код из 3 цифр', icon: Key },
//       { id: 'extended_5', name: 'Широкий код', description: '5 слов, код из 3 цифр', icon: Target },
//       { id: 'extended_6', name: 'Супер-шифровка', description: '6 слов, код из 3 цифр', icon: Brain },
//     ]
//   },
//   mafia: {
//     id: 'mafia',
//     title: 'MAFIA',
//     subtitle: 'Город засыпает...',
//     icon: Users,
//     theme: 'orange',
//     placeholder: 'Житель',
//     players: '6–12',
//     description: 'Город засыпает...',
//     instructions: [
//       { title: 'Цель игры', content: 'Мирным жителям нужно вычислить всех мафиози, а мафии — устранить мирных.' },
//       { title: 'Ход игры', content: 'Игра делится на день и ночь. Ночью мафия убивает, днем все обсуждают и голосуют.' }
//     ],
//     minPlayers: 6,
//     setupStatus: 'mafia_playing'
//   }
// };
export const GAMES_REGISTRY: GamesRegistryMap = {
  [GameKey.Spy]: {
    id: GameKey.Spy,
    title: 'SPY HUNT',
    subtitle: 'Поиск тайного агента',
    icon: Shield,
    theme: 'red',
    placeholder: 'Игрок',
    description: '1 игрок — шпион. Все остальные знают локацию. Шпион должен догадаться, где он находится, по вопросам.',
    players: '4–7',
    minPlayers: 4,
    setupStatus: 'distributing',
    modes: [
      { id: 'classic', name: 'Классика', description: '1 шпион, все остальные знают локацию', icon: Target },
      { id: 'double_agent', name: 'Двойной агент', description: '2 шпиона (от 5 игроков)', icon: Zap },
      { id: 'mole', name: 'Предатель', description: '1 шпион и 1 помощник (от 5 игроков)', icon: ShieldIcon },
    ]
  },
  [GameKey.FakeArtist]: {
    id: GameKey.FakeArtist,
    title: 'FAKE ARTIST',
    subtitle: 'Найдите фейкового автора',
    icon: Palette,
    theme: 'emerald',
    placeholder: 'Игрок',
    description: 'В этой игре один игрок — фейковый художник, который не знает, что рисуют остальные.',
    players: '4–7',
    minPlayers: 4,
    setupStatus: 'fake_artist_distributing'
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
    setupStatus: 'resistance_distributing'
  },
  [GameKey.Alias]: {
    id: GameKey.Alias,
    title: 'ALIAS',
    subtitle: 'Объясни быстрее всех',
    icon: Brain,
    theme: 'sky',
    placeholder: 'Игрок',
    players: '4+',
    description: 'Объясни слово быстрее всех',
    minPlayers: 4,
    setupStatus: 'alias_playing'
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
    setupStatus: 'just_one_playing'
  },
  [GameKey.Telestrations]: {
    id: GameKey.Telestrations,
    title: 'TELESTRATIONS',
    subtitle: 'Испорченный рисунок',
    icon: Pencil,
    theme: 'orange',
    placeholder: 'Игрок',
    players: '4–12',
    description: 'Рисуй и угадывай по цепочке',
    minPlayers: 4,
    setupStatus: 'telestrations_playing'
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
    setupStatus: 'wavelength_playing'
  },
  [GameKey.Codenames]: {
    id: GameKey.Codenames,
    title: 'CODENAMES',
    subtitle: 'Битва шпионов',
    icon: Grid,
    theme: 'emerald',
    placeholder: 'Агент',
    players: '4+',
    description: 'Битва двух команд шпионов',
    minPlayers: 4,
    setupStatus: 'codenames_playing',
    modes: [
      { id: 'classic', name: 'Классика', description: '9 своих, 8 чужих, 1 убийца', icon: Target },
      { id: 'deep_cover', name: 'Глубокое прикрытие', description: '8 своих, 8 чужих, 2 убийцы', icon: ShieldIcon },
      { id: 'double_agent', name: 'Двойной агент', description: '8 своих, 8 чужих, 1 общий агент (кто первый нашел)', icon: Zap },
    ]
  },
  [GameKey.Decrypto]: {
    id: GameKey.Decrypto,
    title: 'DECRYPTO',
    subtitle: 'Коды и перехваты',
    icon: Key,
    theme: 'purple',
    placeholder: 'Шифровальщик',
    players: '4+',
    description: 'Шифруй свои, перехватывай чужие',
    minPlayers: 4,
    setupStatus: 'decrypto_playing',
    modes: [
      { id: 'classic', name: 'Классика', description: '4 слова, код из 3 цифр', icon: Key },
      { id: 'extended_5', name: 'Широкий код', description: '5 слов, код из 3 цифр', icon: Target },
      { id: 'extended_6', name: 'Супер-шифровка', description: '6 слов, код из 3 цифр', icon: Brain },
    ]
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
    setupStatus: 'mafia_playing'
  }
} as const;

export { 
  SpyHuntGame, AliasGame, FakeArtistGame, ResistanceGame, WavelengthGame, TelestrationsGame, JustOneGame, CodenamesGame, DecryptoGame, MafiaGame,
  RoleDistribution, FakeArtistDistribution, ResistanceDistribution, FakeArtistVoting
};
