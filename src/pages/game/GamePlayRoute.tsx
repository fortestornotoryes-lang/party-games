import type { ComponentType } from 'react';
import { lazy } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import { GameKey } from '@/entities/game/types';
import { sessionService } from '@/shared/services/sessionService';
import { storageService } from '@/shared/services/storageService';

// Lazy load game components
const SpyHuntGame = lazy(() =>
  import('@/games/SpyHuntGame/SpyHuntGame').then((m) => ({ default: m.SpyHuntGame }))
);
const AliasGame = lazy(() =>
  import('@/games/AliasGame/AliasGame').then((m) => ({ default: m.AliasGame }))
);
const FakeArtistGame = lazy(() =>
  import('@/games/FakeArtistGame/FakeArtistGame').then((m) => ({ default: m.FakeArtistGame }))
);
const ResistanceGame = lazy(() =>
  import('@/games/ResistanceGame/ResistanceGame').then((m) => ({ default: m.ResistanceGame }))
);
const WavelengthGame = lazy(() =>
  import('@/games/WavelengthGame/WavelengthGame').then((m) => ({ default: m.WavelengthGame }))
);
const TelestrationsGame = lazy(() =>
  import('@/games/TelestrationsGame/TelestrationsGame').then((m) => ({
    default: m.TelestrationsGame,
  }))
);
const JustOneGame = lazy(() =>
  import('@/games/JustOneGame/JustOneGame').then((m) => ({ default: m.JustOneGame }))
);
const CodenamesGame = lazy(() =>
  import('@/games/CodenamesGame/CodenamesGame').then((m) => ({ default: m.CodenamesGame }))
);
const DecryptoGame = lazy(() =>
  import('@/games/DecryptoGame/DecryptoGame').then((m) => ({ default: m.DecryptoGame }))
);
const MafiaGame = lazy(() => import('@/games/MafiaGame/MafiaGame'));
const TruthOrDareGame = lazy(() =>
  import('@/games/TruthOrDareGame/TruthOrDareGame').then((m) => ({ default: m.TruthOrDareGame }))
);
const ConnectFourGame = lazy(() =>
  import('@/games/ConnectFourGame/ConnectFourGame').then((m) => ({ default: m.ConnectFourGame }))
);
const TabooReverseGame = lazy(() =>
  import('@/games/TabooReverseGame/TabooReverseGame').then((m) => ({
    default: m.TabooReverseGame,
  }))
);
const TabooGame = lazy(() =>
  import('@/games/TabooGame/TabooGame').then((m) => ({ default: m.TabooGame }))
);
const BunkerGame = lazy(() =>
  import('@/games/BunkerGame/BunkerGame').then((m) => ({ default: m.BunkerGame }))
);
const MillionaireGame = lazy(() =>
  import('@/games/MillionaireGame/MillionaireGame').then((m) => ({ default: m.MillionaireGame }))
);
const CorridorGame = lazy(() =>
  import('@/games/CorridorGame/CorridorGame').then((m) => ({ default: m.CorridorGame }))
);
const MemoRiskGame = lazy(() =>
  import('@/games/MemoRiskGame/MemoRiskGame').then((m) => ({ default: m.MemoRiskGame }))
);

interface GameProps {
  playerNames: string[];
  onBack: () => void;
}

// Bunker (onRestart) и Telestrations (initialDifficulty) рендерятся отдельно —
// у них дополнительные пропсы, см. GamePlayRoute ниже.
const GAME_COMPONENTS: Record<
  Exclude<GameKey, typeof GameKey.Bunker | typeof GameKey.Telestrations>,
  ComponentType<GameProps>
> = {
  [GameKey.Spy]: SpyHuntGame,
  [GameKey.FakeArtist]: FakeArtistGame,
  [GameKey.Resistance]: ResistanceGame,
  [GameKey.Alias]: AliasGame,
  [GameKey.JustOne]: JustOneGame,
  [GameKey.Wavelength]: WavelengthGame,
  [GameKey.Codenames]: CodenamesGame,
  [GameKey.Decrypto]: DecryptoGame,
  [GameKey.Mafia]: MafiaGame,
  [GameKey.TruthOrDare]: TruthOrDareGame,
  [GameKey.ConnectFour]: ConnectFourGame,
  [GameKey.TabooReverse]: TabooReverseGame,
  [GameKey.Taboo]: TabooGame,
  [GameKey.Millionaire]: MillionaireGame,
  [GameKey.Corridor]: CorridorGame,
  [GameKey.MemoRisk]: MemoRiskGame,
};

/** Экран самой игры: резолвит игроков и рендерит компонент по gameKey. */
export function GamePlayRoute() {
  const { gameKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { difficulty } = useGameSettings();

  const currentGameKey = gameKey as GameKey;
  const config = GAMES_REGISTRY[currentGameKey];

  // Игроки приходят через navigation state из Setup;
  // при прямом заходе/обновлении страницы — из storage (Setup их персистит).
  const statePlayerNames = (location.state as { playerNames?: string[] } | null)?.playerNames;
  const playerNames = statePlayerNames ?? storageService.getPlayers();

  if (playerNames.length < config.minPlayers) {
    return <Navigate to={`/game/${currentGameKey}/setup`} replace />;
  }

  // Если сохранённая сессия (восстановление после перезагрузки) была начата
  // с другим составом игроков — сбрасываем её до маунта игры. Идемпотентно.
  sessionService.syncPlayers(currentGameKey, playerNames);

  const onBack = () => void navigate('/');

  if (currentGameKey === GameKey.Telestrations) {
    return (
      <TelestrationsGame playerNames={playerNames} onBack={onBack} initialDifficulty={difficulty} />
    );
  }

  if (currentGameKey === GameKey.Bunker) {
    return (
      <BunkerGame
        playerNames={playerNames}
        onBack={onBack}
        onRestart={() => void navigate(`/game/${currentGameKey}/setup`)}
      />
    );
  }

  const Game = GAME_COMPONENTS[currentGameKey];
  return <Game playerNames={playerNames} onBack={onBack} />;
}
