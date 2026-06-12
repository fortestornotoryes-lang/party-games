import {Settings as SettingsIcon} from 'lucide-react';
import {useNavigate} from 'react-router';

import {MainMenu} from '@/components/MainMenu';
import {useGameSettings} from '@/entities/game/model/GameSettingsContext';
import type {GameKey} from '@/entities/game/types';

export function MenuRoute() {
    const navigate = useNavigate();
    const {setCurrentGameId} = useGameSettings();

    const handleSelectGame = (gameId: GameKey) => {
        // Ставим id до навигации, чтобы Setup сразу отрендерился с нужным конфигом
        setCurrentGameId(gameId);
        void navigate(`/game/${gameId}/setup`);
    };

    return (
        <div className="relative">
            <MainMenu onSelectGame={handleSelectGame}/>
            <button
                onClick={() => void navigate('/settings')}
                className="fixed bottom-6 right-6 w-14 h-14 glass-card rounded-premium-md flex items-center justify-center text-white/30 active:scale-95 transition-all z-50 hover:text-white/60"
            >
                <SettingsIcon className="w-5 h-5"/>
            </button>
        </div>
    );
}
