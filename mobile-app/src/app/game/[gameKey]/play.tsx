import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import type { ComponentType } from 'react';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import { GameKey, type GameComponentProps } from '@/entities/game/types';
import { AliasGame } from '@/games/AliasGame/AliasGame';
import { BunkerGame } from '@/games/BunkerGame/BunkerGame';
import { CodenamesGame } from '@/games/CodenamesGame/CodenamesGame';
import { ConnectFourGame } from '@/games/ConnectFourGame/ConnectFourGame';
import { CorridorGame } from '@/games/CorridorGame/CorridorGame';
import { DecryptoGame } from '@/games/DecryptoGame/DecryptoGame';
import { WavelengthGame } from '@/games/WavelengthGame/WavelengthGame';
import { FakeArtistGame } from '@/games/FakeArtistGame/FakeArtistGame';
import { JustOneGame } from '@/games/JustOneGame/JustOneGame';
import MafiaGame from '@/games/MafiaGame/MafiaGame';
import { MemoRiskGame } from '@/games/MemoRiskGame/MemoRiskGame';
import { MillionaireGame } from '@/games/MillionaireGame/MillionaireGame';
import { ResistanceGame } from '@/games/ResistanceGame/ResistanceGame';
import { SpyHuntGame } from '@/games/SpyHuntGame/SpyHuntGame';
import { TabooReverseGame } from '@/games/TabooReverseGame/TabooReverseGame';
import { TabooGame } from '@/games/TabooGame/TabooGame';
import { TelestrationsGame } from '@/games/TelestrationsGame/TelestrationsGame';
import { TruthOrDareGame } from '@/games/TruthOrDareGame/TruthOrDareGame';
import { sessionService } from '@/shared/services/sessionService';
import { storageService } from '@/shared/services/storageService';

// Все игры получают единый набор пропсов GameComponentProps (как в вебе).
// Все 18 игр перенесены (этапы 4–6 завершены).
const GAME_COMPONENTS: Record<GameKey, ComponentType<GameComponentProps>> = {
  [GameKey.Spy]: SpyHuntGame,
  [GameKey.Bunker]: BunkerGame,
  [GameKey.Telestrations]: TelestrationsGame,
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

/** Экран самой игры: резолвит игроков и рендерит компонент по gameKey (аналог веб-GamePlayRoute). */
export default function GamePlayRoute() {
  // Экран не гаснет на время партии — критично для pass-the-phone,
  // где телефон лежит на столе между ходами игроков. Снимается автоматически
  // при уходе с экрана (react-router unmount эффект внутри хука).
  useKeepAwake();

  const { gameKey } = useLocalSearchParams<{ gameKey: string }>();
  const router = useRouter();
  const { difficulty } = useGameSettings();

  const currentGameKey = gameKey as GameKey;
  const config = GAMES_REGISTRY[currentGameKey];

  // Игроки читаются из storage — Setup персистит их при каждом изменении
  // и при старте (в вебе был ещё navigation state; в RN он не нужен).
  const playerNames = storageService.getPlayers();

  if (playerNames.length < config.minPlayers) {
    return <Redirect href={`/game/${currentGameKey}/setup`} />;
  }

  // Если сохранённая сессия (восстановление после перезапуска) была начата
  // с другим составом игроков — сбрасываем её до маунта игры. Идемпотентно.
  sessionService.syncPlayers(currentGameKey, playerNames);

  const Game = GAME_COMPONENTS[currentGameKey];
  return (
    <Game
      playerNames={playerNames}
      onBack={() => {
        router.dismissTo('/');
      }}
      onRestart={() => {
        router.dismissTo(`/game/${currentGameKey}/setup`);
      }}
      initialDifficulty={difficulty}
    />
  );
}
