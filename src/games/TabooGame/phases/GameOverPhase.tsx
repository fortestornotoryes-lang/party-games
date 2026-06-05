import {RotateCcw, Trophy} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import {LeaderboardList} from '@/components/LeaderboardList.tsx';
import {PrimaryButton} from '@/components/UI.tsx';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface GameOverPhaseProps {
    playerNames: string[];
    scores: Record<string, number>;
    onRematch: () => void;
    onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
                                                                playerNames,
                                                                scores,
                                                                onRematch,
                                                                onBack,
                                                            }) => {
    const {t} = useTranslation();
    const sorted = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
    const topScore = scores[sorted[0]] ?? 0;
    const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
    const hasWinner = topScore > 0 && topScore > secondScore;

    return (
        <motion.div
            key="game-over"
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.9}}
            className="flex flex-col items-center p-6 gap-8 max-w-sm mx-auto w-full"
        >
            <div className="text-center space-y-2 pt-4">
                <Trophy
                    className="w-16 h-16 text-premium-yellow mx-auto mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]"/>
                <p className="text-micro font-black uppercase tracking-[0.5em] text-white/30">
                    {t(`${NS.TABOO}.gameEnded`)}
                </p>
                {hasWinner ? (
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-premium-yellow">
                        {t(`${NS.TABOO}.playerWon`, {player: sorted[0]})}
                    </h2>
                ) : (
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/70">
                        {t(`${NS.COMMON}.draw`)}!
                    </h2>
                )}
            </div>

            <LeaderboardList players={playerNames} scores={scores}/>

            <div className="w-full space-y-3">
                <PrimaryButton onClick={onRematch} icon={RotateCcw} variant="outline">
                    {t(`${NS.COMMON}.rematch`).toUpperCase()}
                </PrimaryButton>
                <PrimaryButton onClick={onBack} variant="outline">
                    {t(`${NS.TABOO}.backToMenu`)}
                </PrimaryButton>
            </div>
        </motion.div>
    );
};
