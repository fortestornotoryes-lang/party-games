import { Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { MainMenu } from '@/widget/main-menu/components/MainMenu';
import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { GameKey } from '@/entities/game/types';

export function MenuRoute() {
  const navigate = useNavigate();
  const { setCurrentGameId } = useGameSettings();

  const handleSelectGame = (gameId: GameKey) => {
    // Ставим id до навигации, чтобы Setup сразу отрендерился с нужным конфигом
    setCurrentGameId(gameId);
    void navigate(`/game/${gameId}/setup`);
  };

  return (
    <div className="relative">
      <MainMenu onSelectGame={handleSelectGame} />
      <button
        onClick={() => void navigate('/settings')}
        className="glass-card rounded-premium-md fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center text-white/30 transition-all hover:text-white/60 active:scale-95"
      >
        <SettingsIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
