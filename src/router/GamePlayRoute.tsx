import type {ComponentType} from 'react';
import {Navigate, useLocation, useNavigate, useParams} from 'react-router';

import {useGameSettings} from '../contexts/GameSettingsContext';
import {
    AliasGame,
    BunkerGame,
    CodenamesGame,
    ConnectFourGame,
    CorridorGame,
    DecryptoGame,
    FakeArtistGame,
    GAMES_REGISTRY,
    JustOneGame,
    MafiaGame,
    MemoRiskGame,
    MillionaireGame,
    ResistanceGame,
    SpyHuntGame,
    TabooGame,
    TabooReverseGame,
    TelestrationsGame,
    TruthOrDareGame,
    WavelengthGame,
} from '../registry/GameRegistry';
import {sessionService} from '../services/sessionService';
import {storageService} from '../services/storageService';
import {GameKey} from '../types/games';

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
    const {gameKey} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {difficulty} = useGameSettings();

    const currentGameKey = gameKey as GameKey;
    const config = GAMES_REGISTRY[currentGameKey];

    // Игроки приходят через navigation state из Setup;
    // при прямом заходе/обновлении страницы — из storage (Setup их персистит).
    const statePlayerNames = (location.state as { playerNames?: string[] } | null)?.playerNames;
    const playerNames = statePlayerNames ?? storageService.getPlayers();

    if (playerNames.length < config.minPlayers) {
        return <Navigate to={`/game/${currentGameKey}/setup`} replace/>;
    }

    // Если сохранённая сессия (восстановление после перезагрузки) была начата
    // с другим составом игроков — сбрасываем её до маунта игры. Идемпотентно.
    sessionService.syncPlayers(currentGameKey, playerNames);

    const onBack = () => void navigate('/');

    if (currentGameKey === GameKey.Telestrations) {
        return (
            <TelestrationsGame
                playerNames={playerNames}
                onBack={onBack}
                initialDifficulty={difficulty}
            />
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
    return <Game playerNames={playerNames} onBack={onBack}/>;
}
