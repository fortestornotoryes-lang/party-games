/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, Suspense } from 'react';
import { MainMenu } from './components/MainMenu';
import { Setup } from './components/Setup';
import { UniversalGameSettings } from './components/UniversalGameSettings';
import { Player, GameStatus, GameState } from './types';
import { storageService } from './services/storageService';
import { Settings } from './components/Settings';
import { Settings as SettingsIcon } from 'lucide-react';
import { initSpyHunt, initFakeArtist, initResistance } from './utils/gameLogic';
import { GameSettingsProvider, useGameSettings } from './contexts/GameSettingsContext';
import { GAMES_REGISTRY, SpyHuntGame, AliasGame, FakeArtistGame, ResistanceGame, WavelengthGame, TelestrationsGame, JustOneGame, CodenamesGame, DecryptoGame, MafiaGame, RoleDistribution, FakeArtistDistribution, ResistanceDistribution, FakeArtistVoting } from './registry/GameRegistry';
import { GAME_INSTRUCTIONS } from './constants/instructions';
import { GameKey } from './types/games';

function AppContent() {
  const { difficulty, mode, rounds, timerSeconds, setDifficulty, setMode, setRounds, setTimerSeconds, currentGameId, setCurrentGameId } = useGameSettings();
  const [status, setStatus] = useState<GameStatus>('menu');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    status: 'menu',
    location: '', 
    word: '', 
    category: '', 
    winner: null, 
    canvasImage: '', 
    rounds: 2
  });

  const reset = useCallback(() => setStatus('menu'), []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [status]);

  const startGame = useCallback((playerNames: string[]) => {
    if (!currentGameId) return;
    
    storageService.savePlayers(playerNames);
    
    const config = GAMES_REGISTRY[currentGameId];
    let initializedPlayers: Player[] = [];
    
    switch (currentGameId) {
      case 'spy': {
        const { players: p, location } = initSpyHunt(playerNames, difficulty, mode);
        initializedPlayers = p;
        setGameState(prev => ({ ...prev, location }));
        break;
      }
      case 'fake_artist': {
        const { players: p } = initFakeArtist(playerNames);
        initializedPlayers = p;
        break;
      }
      case 'resistance': {
        const { players: p } = initResistance(playerNames);
        initializedPlayers = p;
        break;
      }
      default:
        initializedPlayers = playerNames.map(name => ({ id: name, name, role: 'Игрок', isSpy: false }));
    }

    setPlayers(initializedPlayers);
    setStatus(config.setupStatus);
  }, [currentGameId, difficulty, mode]);

  const handleMenuSelect = (gameId: string) => {
    setCurrentGameId(gameId);
    setStatus('setup');
  };

  const renderGame = () => {
    const playerNames = players.map(p => p.name);
    
    return (
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/50 font-black uppercase tracking-widest animate-pulse">Загрузка...</div>}>
        {(() => {
          switch (status) {
            case 'alias_playing': return <AliasGame playerNames={playerNames} onBack={reset} />;
            case 'just_one_playing': return <JustOneGame playerNames={playerNames} onBack={reset} />;
            case 'telestrations_playing': return <TelestrationsGame playerNames={playerNames} onBack={reset} initialDifficulty={difficulty} initialRounds={rounds} />;
            case 'wavelength_playing': return <WavelengthGame playerNames={playerNames} onBack={reset} />;
            case 'codenames_playing': return <CodenamesGame playerNames={playerNames} onBack={reset} />;
            case 'decrypto_playing': return <DecryptoGame playerNames={playerNames} onBack={reset} />;
            case 'mafia_playing': return <MafiaGame playerNames={playerNames} onBack={reset} />;
            
            case 'playing': return <SpyHuntGame players={players} location={gameState.location!} onRestart={() => setStatus('setup')} onFinish={reset} />;
            case 'fake_artist_playing': return <FakeArtistGame players={players} word={gameState.word} category={gameState.category} rounds={gameState.rounds} timerSeconds={gameState.timerSeconds} onBack={reset} onFinish={(img) => { setGameState({...gameState, canvasImage: img}); setStatus('fake_artist_voting'); }} />;
            case 'resistance_playing': return <ResistanceGame players={players} onBack={reset} onFinish={reset} />;
            
            case 'distributing': return <RoleDistribution players={players} location={gameState.location!} onFinish={() => setStatus('playing')} />;
            case 'fake_artist_distributing': return <FakeArtistDistribution players={players} onFinish={(word, category, rounds, timerSeconds) => { setGameState({...gameState, word, category, rounds, timerSeconds}); setStatus('fake_artist_playing'); }} />;
            case 'resistance_distributing': return <ResistanceDistribution players={players} onFinish={() => setStatus('resistance_playing')} />;
            
            case 'fake_artist_voting': return <FakeArtistVoting players={players} canvasImage={gameState.canvasImage} onReveal={reset} />;
            
            case 'setup': {
              const config = GAMES_REGISTRY[currentGameId!];
              return (
                <Setup 
                  onStart={startGame} 
                  onBack={reset} 
                  title={config.title} 
                  subtitle={config.subtitle} 
                  icon={config.icon} 
                  themeColor={config.theme} 
                  playerPlaceholder={config.placeholder} 
                  addPlayerLabel="Добавить"
                  instructions={GAME_INSTRUCTIONS[currentGameId as GameKey] ?? []}
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
                    modes={config.modes}
                  />
                </Setup>
              );
            }
            case 'settings': return <Settings onBack={reset} />;
            default: return (
              <div className="relative">
                <MainMenu onSelectGame={handleMenuSelect} />
                <button
                  onClick={() => setStatus('settings')}
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

