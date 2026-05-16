/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { MainMenu } from './components/MainMenu';
import { Setup } from './components/Setup';
import { RoleDistribution } from './components/RoleDistribution';
import { SpyHuntGame } from './games/SpyHuntGame/SpyHuntGame';
import { AliasGame } from './games/AliasGame/AliasGame';
import { FakeArtistGame } from './games/FakeArtistGame/FakeArtistGame';
import { FakeArtistDistribution } from './games/FakeArtistGame/components/FakeArtistDistribution';
import { FakeArtistVoting } from './games/FakeArtistGame/components/FakeArtistVoting';
import { ResistanceDistribution } from './games/ResistanceGame/components/ResistanceDistribution';
import { ResistanceGame } from './games/ResistanceGame/ResistanceGame';
import { WavelengthGame } from './games/WavelengthGame/WavelengthGame';
import { TelestrationsGame } from './games/TelestrationsGame/TelestrationsGame';
import { JustOneGame } from './games/JustOneGame/JustOneGame';
import { Player, GameStatus } from './types';
import { SPY_HUNT_INSTRUCTIONS } from './constants/spyHuntContent';
import { FAKE_ARTIST_INSTRUCTIONS } from './constants/fakeArtistContent';
import { RESISTANCE_INSTRUCTIONS } from './constants/resistanceContent';
import { ALIAS_INSTRUCTIONS } from './constants/aliasContent';
import { Shield, Palette, Brain, RotateCcw, Pencil, Lightbulb, Radio } from 'lucide-react';

import { initSpyHunt, initFakeArtist, initResistance } from './utils/gameLogic';

export default function App() {
  const [status, setStatus] = useState<any>('menu');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<any>({
    location: '', word: '', category: '', winner: null, canvasImage: ''
  });

  const startGame = useCallback((playerNames: string[]) => {
    switch (status) {
      case 'setup': {
        const { players: p, location } = initSpyHunt(playerNames);
        setPlayers(p);
        setGameState((prev: any) => ({ ...prev, location }));
        setStatus('distributing');
        break;
      }
      case 'fake_artist_setup': {
        const { players: p } = initFakeArtist(playerNames);
        setPlayers(p);
        setStatus('fake_artist_distributing');
        break;
      }
      case 'resistance_setup': {
        const { players: p } = initResistance(playerNames);
        setPlayers(p);
        setStatus('resistance_distributing');
        break;
      }
      case 'alias_setup':
      case 'just_one_setup':
      case 'telestrations_setup':
      case 'wavelength_setup': {
        const p = playerNames.map(name => ({ id: name, name, role: 'Игрок', isSpy: false }));
        setPlayers(p);
        const map: Record<string, GameStatus> = {
          alias_setup: 'alias',
          just_one_setup: 'just_one_playing',
          telestrations_setup: 'telestrations_playing',
          wavelength_setup: 'wavelength_playing'
        };
        setStatus(map[status]);
        break;
      }
    }
  }, [status]);

  const handleFinishDistribution = (word?: string, category?: string) => {
    if (status === 'distributing') setStatus('playing');
    else if (status === 'fake_artist_distributing') {
      setGameState({...gameState, word, category});
      setStatus('fake_artist_playing');
    } else setStatus('resistance_playing');
  };

  const handleMenuSelect = (id: string) => {
    if (id === 'spy') setStatus('setup');
    else if (id === 'fake_artist') setStatus('fake_artist_setup');
    else if (id === 'resistance') setStatus('resistance_setup');
    else if (id === 'alias') setStatus('alias_setup');
    else if (id === 'just_one') setStatus('just_one_setup');
    else if (id === 'telestrations') setStatus('telestrations_setup');
    else if (id === 'wavelength') setStatus('wavelength_setup');
  };

  const reset = () => setStatus('menu');

  return (
      <div className="min-h-screen bg-black safe-top safe-bottom">
        {status === 'menu' && <MainMenu onSelectGame={handleMenuSelect} />}
        {status === 'setup' && <Setup onStart={startGame} onBack={reset} title="SPY HUNT" subtitle="Найдите шпиона" icon={Shield} themeColor="red" playerPlaceholder="Агент" addPlayerLabel="Добавить" instructions={SPY_HUNT_INSTRUCTIONS} minPlayers={4} />}
        {status === 'fake_artist_setup' && <Setup onStart={startGame} onBack={reset} title="FAKE ARTIST" subtitle="Рисуйте вместе" icon={Palette} themeColor="emerald" playerPlaceholder="Художник" addPlayerLabel="Добавить" instructions={FAKE_ARTIST_INSTRUCTIONS} minPlayers={4} />}
        {status === 'resistance_setup' && <Setup onStart={startGame} onBack={reset} title="RESISTANCE" subtitle="Свергните тиранию" icon={Shield} themeColor="sky" playerPlaceholder="Боец" addPlayerLabel="Добавить" instructions={RESISTANCE_INSTRUCTIONS} minPlayers={5} />}
        {status === 'alias_setup' && <Setup onStart={startGame} onBack={reset} title="ALIAS" subtitle="Объясни быстрее" icon={Brain} themeColor="sky" playerPlaceholder="Игрок" addPlayerLabel="Добавить" instructions={ALIAS_INSTRUCTIONS} minPlayers={4} />}
        {status === 'just_one_setup' && <Setup onStart={startGame} onBack={reset} title="JUST ONE" subtitle="Пойми намек" icon={Lightbulb} themeColor="yellow" playerPlaceholder="Игрок" addPlayerLabel="Добавить" instructions={[]} minPlayers={3} />}
        {status === 'wavelength_setup' && <Setup onStart={startGame} onBack={reset} title="WAVELENGTH" subtitle="На одной волне" icon={Radio} themeColor="purple" playerPlaceholder="Игрок" addPlayerLabel="Добавить" instructions={[]} minPlayers={2} />}
        {status === 'telestrations_setup' && <Setup onStart={startGame} onBack={reset} title="TELESTRATIONS" subtitle="Испорченный телефон" icon={Pencil} themeColor="orange" playerPlaceholder="Игрок" addPlayerLabel="Добавить" instructions={[]} minPlayers={4} />}

        {status === 'distributing' && <RoleDistribution players={players} location={gameState.location} onFinish={() => setStatus('playing')} />}
        {status === 'fake_artist_distributing' && <FakeArtistDistribution players={players} onFinish={handleFinishDistribution} />}
        {status === 'resistance_distributing' && <ResistanceDistribution players={players} onFinish={() => setStatus('resistance_playing')} />}

        {status === 'playing' && <SpyHuntGame players={players} location={gameState.location} onRestart={() => setStatus('setup')} onFinish={() => setStatus('menu')} />}
        {status === 'fake_artist_playing' && <FakeArtistGame players={players} word={gameState.word} category={gameState.category} rounds={2} timerSeconds={0} onBack={reset} onFinish={(img) => { setGameState({...gameState, canvasImage: img}); setStatus('fake_artist_voting'); }} />}
        {status === 'fake_artist_voting' && <FakeArtistVoting players={players} canvasImage={gameState.canvasImage} onReveal={reset} />}
        {status === 'resistance_playing' && <ResistanceGame players={players} onBack={reset} onFinish={reset} />}
        {status === 'alias' && <AliasGame playerNames={players.map(p => p.name)} onBack={reset} />}
        {status === 'just_one_playing' && <JustOneGame playerNames={players.map(p => p.name)} onBack={reset} />}
        {status === 'telestrations_playing' && <TelestrationsGame playerNames={players.map(p => p.name)} onBack={reset} />}
        {status === 'wavelength_playing' && <WavelengthGame playerNames={players.map(p => p.name)} onBack={reset} />}
      </div>
  );
}
