/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { MainMenu } from './components/MainMenu';
import { Setup } from './components/Setup';
import { RoleDistribution } from './components/RoleDistribution';
import { Game } from './components/Game';
import { Result } from './components/Result';
import { AliasGame } from './components/AliasGame';
import { FakeArtistGame } from './components/FakeArtistGame';
import { FakeArtistDistribution } from './components/FakeArtistDistribution';
import { FakeArtistResult } from './components/FakeArtistResult';
import { ResistanceDistribution } from './components/ResistanceDistribution';
import { ResistanceGame } from './components/ResistanceGame';
import { ResistanceResult } from './components/ResistanceResult';
import { WavelengthGame } from './components/WavelengthGame';
import { TelestrationsGame } from './components/TelestrationsGame';
import { JustOneGame } from './components/JustOneGame';
import { Player, GameStatus } from './types';
import { LOCATIONS_DATA, SPY_HUNT_INSTRUCTIONS } from './constants/spyHuntContent';
import { FAKE_ARTIST_DATA, FAKE_ARTIST_INSTRUCTIONS } from './constants/fakeArtistContent';
import { RESISTANCE_INSTRUCTIONS } from './constants/resistanceContent';
import { TELESTRATIONS_INSTRUCTIONS } from './constants/telestrationsContent';
import { WAVELENGTH_INSTRUCTIONS } from './constants/wavelengthContent';
import { JUST_ONE_INSTRUCTIONS } from './constants/justOneContent';
import { ALIAS_INSTRUCTIONS } from './constants/aliasContent';
import { Shield, Palette, Users, RotateCcw, Pencil, Lightbulb, Brain, Radio } from 'lucide-react';

type AppState = 'menu' | GameStatus;

export default function App() {
  const [status, setStatus] = useState<AppState>('menu');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState({
    location: '',
    word: '',
    category: '',
    winner: null as 'resistance' | 'spies' | null
  });

  const startGame = useCallback((playerNames: string[]) => {
    switch (status) {
      case 'setup': {
        const locationObj = LOCATIONS_DATA[Math.floor(Math.random() * LOCATIONS_DATA.length)];
        const spyIndex = Math.floor(Math.random() * playerNames.length);
        const availableRoles = [...locationObj.roles].sort(() => Math.random() - 0.5);

        const initialPlayers: Player[] = playerNames.map((name, index) => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          role: index === spyIndex ? 'Шпион' : availableRoles[index % availableRoles.length],
          isSpy: index === spyIndex,
        }));

        setPlayers(initialPlayers);
        setGameState(prev => ({ ...prev, location: locationObj.name }));
        setStatus('distributing');
        break;
      }

      case 'fake_artist_setup': {
        const gameObj = FAKE_ARTIST_DATA[Math.floor(Math.random() * FAKE_ARTIST_DATA.length)];
        const spyIndex = Math.floor(Math.random() * playerNames.length);

        const initialPlayers: Player[] = playerNames.map((name, index) => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          role: index === spyIndex ? 'Самозванец' : 'Художник',
          isSpy: index === spyIndex,
        }));

        setPlayers(initialPlayers);
        setGameState(prev => ({ ...prev, word: gameObj.word, category: gameObj.category }));
        setStatus('fake_artist_distributing');
        break;
      }

      case 'resistance_setup': {
        const pCount = playerNames.length;
        let spyCount = 2;
        if (pCount >= 7) spyCount = 3;
        if (pCount >= 10) spyCount = 4;

        const indices = Array.from({ length: pCount }, (_, i) => i).sort(() => Math.random() - 0.5);
        const spyIndices = indices.slice(0, spyCount);

        const initialPlayers: Player[] = playerNames.map((name, index) => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          role: spyIndices.includes(index) ? 'Шпион' : 'Сопротивление',
          isSpy: spyIndices.includes(index)
        }));

        setPlayers(initialPlayers);
        setStatus('resistance_distributing');
        break;
      }

      case 'wavelength_setup':
      case 'telestrations_setup':
      case 'just_one_setup':
      case 'alias_setup': {
        const newStatusMap: Record<string, GameStatus> = {
          'wavelength_setup': 'wavelength_playing',
          'telestrations_setup': 'telestrations_playing',
          'just_one_setup': 'just_one_playing',
          'alias_setup': 'alias'
        };
        const initialPlayers: Player[] = playerNames.map((name) => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          role: 'Участник',
          isSpy: false
        }));
        setPlayers(initialPlayers);
        setStatus(newStatusMap[status]);
        break;
      }
    }
  }, [status]);

  const handleFinishDistribution = () => {
    if (status === 'distributing') setStatus('playing');
    else if (status === 'fake_artist_distributing') setStatus('fake_artist_playing');
    else setStatus('resistance_playing');
  };

  const handleFinishGame = (params?: any) => {
    if (status === 'playing') setStatus('result');
    else if (status === 'fake_artist_playing') setStatus('fake_artist_result');
    else if (status === 'resistance_playing') {
      setGameState(prev => ({ ...prev, winner: params }));
      setStatus('resistance_result');
    }
  };

  const resetToMenu = () => {
    setStatus('menu');
    setPlayers([]);
    setGameState({ location: '', word: '', category: '', winner: null });
  };

  const restartGame = (type: 'spy' | 'fake' | 'resistance') => {
    setPlayers([]);
    if (type === 'spy') {
      setStatus('setup');
      setGameState(prev => ({ ...prev, location: '' }));
    } else if (type === 'fake') {
      setStatus('fake_artist_setup');
      setGameState(prev => ({ ...prev, word: '', category: '' }));
    } else {
      setStatus('resistance_setup');
      setGameState(prev => ({ ...prev, winner: null }));
    }
  };

  const quickRestartSpy = useCallback(() => {
    const locationObj = LOCATIONS_DATA[Math.floor(Math.random() * LOCATIONS_DATA.length)];
    const spyIndex = Math.floor(Math.random() * players.length);
    const availableRoles = [...locationObj.roles].sort(() => Math.random() - 0.5);
    setPlayers(players.map((p, i) => ({
      ...p,
      role: i === spyIndex ? 'Шпион' : availableRoles[i % availableRoles.length],
      isSpy: i === spyIndex,
    })));
    setGameState(prev => ({ ...prev, location: locationObj.name }));
    setStatus('distributing');
  }, [players]);

  const quickRestartFake = useCallback(() => {
    const gameObj = FAKE_ARTIST_DATA[Math.floor(Math.random() * FAKE_ARTIST_DATA.length)];
    const spyIndex = Math.floor(Math.random() * players.length);
    setPlayers(players.map((p, i) => ({
      ...p,
      role: i === spyIndex ? 'Самозванец' : 'Художник',
      isSpy: i === spyIndex,
    })));
    setGameState(prev => ({ ...prev, word: gameObj.word, category: gameObj.category }));
    setStatus('fake_artist_distributing');
  }, [players]);

  const handleMenuSelect = (id: string) => {
    const statusMap: Record<string, AppState> = {
      'spy': 'setup',
      'fake_artist': 'fake_artist_setup',
      'resistance': 'resistance_setup',
      'wavelength': 'wavelength_setup',
      'telestrations': 'telestrations_setup',
      'just_one': 'just_one_setup',
      'alias': 'alias_setup'
    };
    setStatus(statusMap[id] || 'menu');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden safe-top safe-bottom">
      {status === 'menu' && (
        <MainMenu onSelectGame={handleMenuSelect} />
      )}
      {status === 'setup' && (
        <Setup 
          onStart={startGame} 
          onBack={resetToMenu}
          title="SPY HUNT"
          subtitle="Найдите шпиона среди своих"
          icon={Shield}
          themeColor="red"
          playerPlaceholder="Агент"
          addPlayerLabel="Вербовать Агента"
          instructions={SPY_HUNT_INSTRUCTIONS}
          minPlayers={4}
          maxPlayers={7}
        />
      )}
      {status === 'fake_artist_setup' && (
        <Setup 
          onStart={startGame} 
          onBack={resetToMenu}
          title="FAKE ARTIST"
          subtitle="Рисуйте вместе, но берегитесь самозванца"
          icon={Palette}
          themeColor="emerald"
          playerPlaceholder="Художник"
          addPlayerLabel="Добавить Художника"
          instructions={FAKE_ARTIST_INSTRUCTIONS}
          minPlayers={4}
          maxPlayers={7}
        />
      )}
      {status === 'resistance_setup' && (
        <Setup 
          onStart={startGame} 
          onBack={resetToMenu}
          title="THE RESISTANCE"
          subtitle="Свергните тиранию или станьте её частью"
          icon={Shield}
          themeColor="sky"
          playerPlaceholder="Боец"
          addPlayerLabel="Вербовать Повстанца"
          instructions={RESISTANCE_INSTRUCTIONS}
          minPlayers={5}
          maxPlayers={10}
        />
      )}
      {status === 'distributing' && (
        <RoleDistribution 
          players={players} 
          location={gameState.location} 
          onFinish={handleFinishDistribution} 
        />
      )}
      {status === 'fake_artist_distributing' && (
        <FakeArtistDistribution 
          players={players} 
          word={gameState.word} 
          category={gameState.category}
          onFinish={handleFinishDistribution} 
        />
      )}
      {status === 'resistance_distributing' && (
        <ResistanceDistribution 
          players={players} 
          onFinish={handleFinishDistribution} 
        />
      )}
      {status === 'playing' && (
        <Game 
          players={players} 
          location={gameState.location} 
          onRestart={() => restartGame('spy')}
          onFinish={handleFinishGame}
        />
      )}
      {status === 'fake_artist_playing' && (
        <FakeArtistGame 
          players={players} 
          word={gameState.word} 
          category={gameState.category}
          onBack={resetToMenu}
          onFinish={handleFinishGame}
        />
      )}
      {status === 'resistance_playing' && (
        <ResistanceGame 
          players={players} 
          onBack={resetToMenu}
          onFinish={handleFinishGame}
        />
      )}
      {status === 'alias_setup' && (
        <Setup 
          onStart={startGame} 
          onBack={resetToMenu}
          title="ALIAS"
          subtitle="Объясни, если сможешь"
          icon={Brain}
          themeColor="sky"
          playerPlaceholder="Игрок"
          addPlayerLabel="Добавить Игрока"
          instructions={ALIAS_INSTRUCTIONS}
          minPlayers={4}
          maxPlayers={12}
        />
      )}
      {status === 'alias' && (
        <AliasGame 
          playerNames={players.map(p => p.name)} 
          onBack={resetToMenu} 
        />
      )}
      {status === 'wavelength_setup' && (
        <Setup
          onStart={startGame}
          onBack={resetToMenu}
          title="WAVELENGTH"
          subtitle="Читай мысли, угадывай волну"
          icon={Radio}
          themeColor="purple"
          playerPlaceholder="Телепат"
          addPlayerLabel="Добавить Игрока"
          instructions={WAVELENGTH_INSTRUCTIONS}
          minPlayers={2}
          maxPlayers={12}
        />
      )}
      {status === 'wavelength_playing' && (
        <WavelengthGame playerNames={players.map(p => p.name)} onBack={resetToMenu} />
      )}
      {status === 'telestrations_setup' && (
        <Setup 
          onStart={startGame} 
          onBack={resetToMenu}
          title="TELESTRATIONS"
          subtitle="Рисуй, угадывай, смейся"
          icon={Pencil}
          themeColor="orange"
          playerPlaceholder="Художник"
          addPlayerLabel="Добавить Игрока"
          instructions={TELESTRATIONS_INSTRUCTIONS}
          minPlayers={4}
          maxPlayers={12}
        />
      )}
      {status === 'telestrations_playing' && (
        <TelestrationsGame 
          playerNames={players.map(p => p.name)} 
          onBack={resetToMenu} 
        />
      )}
      {status === 'just_one_setup' && (
        <Setup 
          onStart={startGame} 
          onBack={resetToMenu}
          title="JUST ONE"
          subtitle="Намек понял?"
          icon={Lightbulb}
          themeColor="emerald"
          playerPlaceholder="Игрок"
          addPlayerLabel="Добавить Игрока"
          instructions={JUST_ONE_INSTRUCTIONS}
          minPlayers={3}
          maxPlayers={12}
        />
      )}
      {status === 'just_one_playing' && (
        <JustOneGame 
          playerNames={players.map(p => p.name)} 
          onBack={resetToMenu} 
        />
      )}
      {status === 'result' && (
        <Result
          players={players}
          location={gameState.location}
          onPlayAgain={quickRestartSpy}
          onRestart={() => restartGame('spy')}
        />
      )}
      {status === 'fake_artist_result' && (
        <FakeArtistResult
          players={players}
          word={gameState.word}
          onPlayAgain={quickRestartFake}
          onRestart={() => restartGame('fake')}
        />
      )}
      {status === 'resistance_result' && (
        <ResistanceResult 
          players={players} 
          winner={gameState.winner || 'resistance'} 
          onRestart={() => restartGame('resistance')} 
        />
      )}
    </div>
  );
}
