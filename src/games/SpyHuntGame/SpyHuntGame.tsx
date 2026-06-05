import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Skull} from 'lucide-react';
import confetti from 'canvas-confetti';
import {Player} from '@/types';
import {storageService} from '@/services/storageService';
import {feedbackService, VIBRATE} from '@/services/feedbackService';
import {GAME_DURATION_BY_DIFFICULTY} from '@/constants/spyHuntContent';
import {useGameSettings} from '@/contexts/GameSettingsContext';
import {GameHeader} from '@/components/GameHeader';
import {GAMES_REGISTRY} from '@/registry/GameRegistry';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {RoleDistribution} from './components/RoleDistribution';
import {useTimer} from '@/hooks/useTimer';
import {initSpyHunt} from '@/utils/gameLogic';
import {SpyHuntPhase} from './types';
import {PlayingPhase} from './phases/PlayingPhase';
import {RevealPhase} from './phases/RevealPhase';

interface GameProps {
    playerNames: string[];
    onBack: () => void;
}

export const SpyHuntGame: React.FC<GameProps> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const {difficulty, mode} = useGameSettings();
    const [players, setPlayers] = useState<Player[]>([]);
    const [location, setLocation] = useState('');
    const [phase, setPhase] = useState<SpyHuntPhase>(SpyHuntPhase.Distributing);

    const gameDuration =
        GAME_DURATION_BY_DIFFICULTY[
        (difficulty as keyof typeof GAME_DURATION_BY_DIFFICULTY) ?? 'medium'
            ] ?? 480;
    const {timeLeft, start: startTimer} = useTimer({initialTime: gameDuration});

    useEffect(() => {
        const {players: p, location: loc} = initSpyHunt(playerNames, difficulty, mode);
        setPlayers(p);
        setLocation(loc);
    }, [playerNames, difficulty, mode]);

    useEffect(() => {
        if (phase !== SpyHuntPhase.Reveal) return;
        const settings = storageService.getSettings();
        feedbackService.playSound('win');
        feedbackService.vibrate(VIBRATE.win);
        if (settings.visualEffects) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: {y: 0.6},
                colors: ['#ef4444', '#ffffff'],
            });
        }
    }, [phase]);

    const spy = players.find((p) => p.isSpy);
    const subtitle =
        phase === SpyHuntPhase.Distributing
            ? t(`${NS.SPY_HUNT}.subtitleDistributing`)
            : phase === SpyHuntPhase.Playing
                ? t(`${NS.SPY_HUNT}.subtitlePlaying`)
                : t(`${NS.SPY_HUNT}.subtitleReveal`);

    if (players.length === 0) return null;

    return (
        <div className="flex flex-col min-h-screen pb-10">
            <GameHeader
                title={GAMES_REGISTRY.spy.title}
                subtitle={subtitle}
                icon={Skull}
                theme="red"
                onBack={onBack}
            />

            <AnimatePresence mode="wait">
                {phase === SpyHuntPhase.Distributing && (
                    <motion.div
                        key="distributing"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="flex-1 flex flex-col"
                    >
                        <RoleDistribution
                            players={players}
                            location={location}
                            onFinish={() => {
                                setPhase(SpyHuntPhase.Playing);
                                startTimer();
                            }}
                        />
                    </motion.div>
                )}

                {phase === SpyHuntPhase.Playing && (
                    <PlayingPhase
                        players={players}
                        timeLeft={timeLeft}
                        onReveal={() => setPhase(SpyHuntPhase.Reveal)}
                    />
                )}

                {phase === SpyHuntPhase.Reveal && (
                    <RevealPhase spy={spy} location={location} onBack={onBack}/>
                )}
            </AnimatePresence>
        </div>
    );
};
