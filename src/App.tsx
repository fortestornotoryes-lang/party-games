/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {Suspense, useCallback, useState} from 'react';
import {MainMenu} from './components/MainMenu';
import {Setup} from './components/Setup';
import {UniversalGameSettings} from './components/UniversalGameSettings';
import {GameModeOption, GameStatus, Player} from './types';
import {storageService} from './services/storageService';
import {Settings} from './components/Settings';
import {Settings as SettingsIcon} from 'lucide-react';
import {GameSettingsProvider, useGameSettings} from './contexts/GameSettingsContext';
import {
  AliasGame,
  CodenamesGame,
  DecryptoGame,
  FakeArtistGame,
  GAMES_REGISTRY,
  JustOneGame,
  MafiaGame,
  ResistanceGame,
  SpyHuntGame,
  TelestrationsGame,
  TruthOrDareGame,
  WavelengthGame
} from './registry/GameRegistry';
import {GAME_INSTRUCTIONS} from './constants/instructions';
import {GameKey} from './types/games';

function AppContent() {
  const { difficulty, mode, rounds, timerSeconds, setDifficulty, setMode, setRounds, setTimerSeconds, currentGameId, setCurrentGameId } = useGameSettings();
  const [status, setStatus] = useState<GameStatus>(GameStatus.Menu);
  const [players, setPlayers] = useState<Player[]>([]);

  const reset = useCallback(() => setStatus(GameStatus.Menu), []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [status]);

  const startGame = useCallback((playerNames: string[]) => {
    if (!currentGameId) return;
    
    storageService.savePlayers(playerNames);
    
    const config = GAMES_REGISTRY[currentGameId];
    const initializedPlayers: Player[] = playerNames.map(name => ({ id: name, name, role: 'Игрок', isSpy: false }));
    
    setPlayers(initializedPlayers);
    setStatus(config.setupStatus);
  }, [currentGameId]);

  const handleMenuSelect = (gameId: GameKey) => {
    setCurrentGameId(gameId);
    setStatus(GameStatus.Setup);
  };

  const renderGame = () => {
    const playerNames = players.map(p => p.name);
    
    return (
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/50 font-black uppercase tracking-widest animate-pulse">Загрузка...</div>}>
        {(() => {
          switch (status) {
            case GameStatus.AliasPlaying: return <AliasGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.JustOnePlaying: return <JustOneGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.TelestrationsPlaying: return <TelestrationsGame playerNames={playerNames} onBack={reset} initialDifficulty={difficulty} />;
            case GameStatus.WavelengthPlaying: return <WavelengthGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.CodenamesPlaying: return <CodenamesGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.DecryptoPlaying: return <DecryptoGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.MafiaPlaying: return <MafiaGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.TruthOrDarePlaying: return <TruthOrDareGame playerNames={playerNames} onBack={reset} />;

            case GameStatus.Playing: return <SpyHuntGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.FakeArtistPlaying: return <FakeArtistGame playerNames={playerNames} onBack={reset} />;
            case GameStatus.ResistancePlaying: return <ResistanceGame playerNames={playerNames} onBack={reset} />;

            case GameStatus.Setup: {
              const config = GAMES_REGISTRY[currentGameId!];
              return (
                <Setup 
                  onStart={startGame} 
                  onBack={reset} 
                  title={config.title} 
                  subtitle={config.subtitle} 
                  icon={config.icon as any}
                  themeColor={config.theme}
                  playerPlaceholder={config.placeholder}
                  addPlayerLabel="Добавить"
                  instructions={(GAME_INSTRUCTIONS[currentGameId as GameKey] ?? []) as { title: string; content: string }[]}
                  description={config.description}
                  minPlayers={config.minPlayers}
                >
                  <UniversalGameSettings 
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    currentGameId={currentGameId!}
                    mode={config.modes ? mode : undefined}
                    setMode={config.modes ? setMode : undefined}
                    rounds={rounds}
                    setRounds={setRounds}
                    timerSeconds={timerSeconds}
                    setTimerSeconds={setTimerSeconds}
                    modes={config.modes as GameModeOption[]}
                  />
                </Setup>
              );
            }
            case GameStatus.Settings: return <Settings onBack={reset} />;
            default: return (
              <div className="relative">
                <MainMenu onSelectGame={handleMenuSelect} />
                <button
                  onClick={() => setStatus(GameStatus.Settings)}
                  className="fixed bottom-6 right-6 w-14 h-14 glass-card rounded-[18px] flex items-center justify-center text-white/30 active:scale-95 transition-all z-50 hover:text-white/60"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>
            );
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen safe-top safe-bottom flex flex-col items-center">
      <div className="w-full max-w-3xl min-h-screen relative flex flex-col shadow-2xl bg-black/20 ring-1 ring-white/5">
         {renderGame()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameSettingsProvider>
      <AppContent />
    </GameSettingsProvider>
  );
}
