import {useNavigate, useParams} from 'react-router';

import {Setup} from '../components/Setup';
import {UniversalGameSettings} from '../components/UniversalGameSettings';
import {GAME_INSTRUCTIONS} from '../constants/instructions';
import {useGameSettings} from '../contexts/GameSettingsContext';
import {GAMES_REGISTRY} from '../registry/GameRegistry';
import {storageService} from '../services/storageService';
import type {GameModeOption} from '../types';
import type {GameKey} from '../types/games';

/** Экран настройки игры: имена игроков + UniversalGameSettings. */
export function GameSetupRoute() {
    const {gameKey} = useParams();
    const navigate = useNavigate();
    const {
        difficulty,
        mode,
        rounds,
        timerSeconds,
        countHiddenTraits,
        setDifficulty,
        setMode,
        setRounds,
        setTimerSeconds,
        setCountHiddenTraits,
        currentGameId,
    } = useGameSettings();

    const currentGameKey = gameKey as GameKey;
    const config = GAMES_REGISTRY[currentGameKey];

    // GameLayout синхронизирует currentGameId с URL; до этого не рендерим,
    // чтобы не показать настройки предыдущей игры (раньше тут был if (!currentGameId)).
    if (currentGameId !== currentGameKey) return null;

    const startGame = (playerNames: string[]) => {
        void storageService.savePlayersAsync(playerNames);
        void navigate(`/game/${currentGameKey}/play`, {state: {playerNames}});
    };

    return (
        <Setup
            onStart={startGame}
            onBack={() => void navigate('/')}
            title={config.title}
            subtitle={config.subtitle}
            icon={config.icon}
            themeColor={config.theme}
            playerPlaceholder={config.placeholder}
            addPlayerLabel="Добавить"
            instructions={
                (GAME_INSTRUCTIONS[currentGameKey] ?? []) as {
                    title: string;
                    content: string;
                }[]
            }
            description={config.description}
            minPlayers={config.minPlayers}
        >
            <UniversalGameSettings
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                currentGameId={currentGameKey}
                mode={config.modes ? mode : undefined}
                setMode={config.modes ? setMode : undefined}
                rounds={rounds}
                setRounds={setRounds}
                timerSeconds={timerSeconds}
                setTimerSeconds={setTimerSeconds}
                countHiddenTraits={countHiddenTraits}
                setCountHiddenTraits={setCountHiddenTraits}
                modes={config.modes as GameModeOption[]}
            />
        </Setup>
    );
}
