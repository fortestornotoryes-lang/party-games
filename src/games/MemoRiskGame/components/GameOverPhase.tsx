import confetti from 'canvas-confetti';
import {Home, RotateCcw, Trophy} from 'lucide-react';
import React, {useEffect} from 'react';

import {LeaderboardList} from '@/entities/player/components/LeaderboardList';
import {PrimaryButton} from '@/shared/components/PrimaryButton';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';

interface GameOverPhaseProps {
    playerNames: string[];
    scores: Record<string, number>;
    onRestart: () => void;
    onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
                                                                playerNames,
                                                                scores,
                                                                onRestart,
                                                                onBack,
                                                            }) => {
    const {t} = useTranslation();

    useEffect(() => {
        void confetti({
            particleCount: 130,
            spread: 75,
            origin: {y: 0.45},
            colors: ['#ff2eb4', '#c77bff', '#ffcc1f', '#ffffff'],
        });
    }, []);

    return (
        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto w-full">
            <div className="text-center space-y-2">
                <Trophy className="w-12 h-12 text-premium-yellow mx-auto"/>
                <p className="text-2xl font-black italic uppercase text-white">
                    {t(`${NS.COMMON}.gameOver`)}
                </p>
                <p className="text-micro font-black uppercase tracking-[0.3em] text-white/30">
                    {t(`${NS.MEMO_RISK}.deckEmpty`)}
                </p>
            </div>

            <LeaderboardList players={playerNames} scores={scores}/>

            <div className="w-full space-y-3">
                <PrimaryButton onClick={onRestart} icon={RotateCcw} variant="purple">
                    {t(`${NS.MEMO_RISK}.newGame`)}
                </PrimaryButton>
                <PrimaryButton onClick={onBack} icon={Home} variant="outline">
                    {t(`${NS.MEMO_RISK}.toMenu`)}
                </PrimaryButton>
            </div>
        </div>
    );
};
