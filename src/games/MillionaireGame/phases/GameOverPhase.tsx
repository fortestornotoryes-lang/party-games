import React from 'react';
import {motion} from 'motion/react';
import {CheckCircle, ChevronRight, Star, XCircle} from 'lucide-react';
import {PrimaryButton} from '@/components/UI';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface GameOverPhaseProps {
    currentPlayer: string;
    questionIndex: number;
    correctAnswer: string | undefined;
    guaranteed: string;
    playerScores: Record<string, string>;
    onNextPlayer: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
                                                                currentPlayer,
                                                                questionIndex,
                                                                correctAnswer,
                                                                guaranteed,
                                                                playerScores,
                                                                onNextPlayer,
                                                            }) => {
    const {t} = useTranslation();

    return (
        <motion.div
            key="gameover"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className="h-full flex flex-col items-center justify-between p-6 overflow-y-auto"
        >
            <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full">
                {/* Error icon with shake */}
                <motion.div
                    initial={{scale: 0}}
                    animate={{scale: [0, 1.15, 1], x: [0, -8, 8, -8, 8, 0]}}
                    transition={{duration: 0.55, delay: 0.1}}
                >
                    <div
                        className="w-24 h-24 rounded-full bg-premium-red/12 border-2 border-premium-red/40 flex items-center justify-center"
                        style={{boxShadow: '0 0 40px rgba(255,46,77,0.2)'}}
                    >
                        <XCircle className="w-12 h-12 text-premium-red"/>
                    </div>
                </motion.div>

                {/* Result info */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.22}}
                    className="text-center space-y-1"
                >
                    <p className="text-tag font-black uppercase tracking-[0.3em] text-premium-red/70">
                        {t(`${NS.MILLIONAIRE}.wrong`)}
                    </p>
                    <p className="text-label font-bold text-white/65">{currentPlayer}</p>
                    <p className="text-label text-white/30">
                        {t(`${NS.MILLIONAIRE}.questionOf15`, {n: questionIndex + 1})}
                    </p>
                </motion.div>

                {/* Correct answer */}
                {correctAnswer && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.32}}
                        className="w-full glass-card rounded-premium-lg overflow-hidden"
                        style={{borderColor: 'rgba(0,216,138,0.25)'}}
                    >
                        <div className="h-px bg-gradient-to-r from-transparent via-premium-green/40 to-transparent"/>
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-premium-green"/>
                                <span className="text-tag font-black uppercase tracking-widest text-premium-green">
                  {t(`${NS.MILLIONAIRE}.correctAnswer`)}
                </span>
                            </div>
                            <p className="text-label font-bold text-white text-center">{correctAnswer}</p>
                        </div>
                    </motion.div>
                )}

                {/* Guaranteed amount */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.38}}
                    className="w-full glass-card rounded-premium-lg p-4 text-center"
                >
                    <p className="text-tag font-black uppercase tracking-[0.22em] text-white/30 mb-1">
                        {t(`${NS.MILLIONAIRE}.guaranteedAmount`)}
                    </p>
                    <p className="text-4xl font-black font-display italic tracking-tighter text-white/55 leading-none">
                        {guaranteed === '0' ? '0' : guaranteed}
                    </p>
                    {guaranteed === '0' && (
                        <p className="text-tag text-white/20 mt-1 font-black uppercase tracking-wider">
                            {t(`${NS.MILLIONAIRE}.nothingEarned`)}
                        </p>
                    )}
                </motion.div>

                {/* Scoreboard */}
                {Object.keys(playerScores).length > 1 && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.44}}
                        className="w-full glass-card rounded-premium-lg p-4"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="w-3.5 h-3.5 text-premium-yellow"/>
                            <span className="text-tag font-black uppercase tracking-[0.22em] text-white/35">
                {t(`${NS.COMMON}.score`)}
              </span>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(playerScores)
                                .sort(
                                    (a, b) =>
                                        parseFloat(b[1].replace(/\D/g, '')) - parseFloat(a[1].replace(/\D/g, ''))
                                )
                                .map(([name, score], i) => (
                                    <div key={name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-tag font-black text-white/20 w-4">{i + 1}</span>
                                            <span
                                                className={`text-label font-semibold ${
                                                    name === currentPlayer ? 'text-white' : 'text-white/50'
                                                }`}
                                            >
                        {name}
                      </span>
                                        </div>
                                        <span
                                            className={`text-label font-black ${
                                                name === currentPlayer ? 'text-white/55' : 'text-white/35'
                                            }`}
                                        >
                      {score}
                    </span>
                                    </div>
                                ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Next player */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.52}}
                className="w-full pt-4"
            >
                <PrimaryButton variant="white" icon={ChevronRight} onClick={onNextPlayer}>
                    {t(`${NS.MILLIONAIRE}.nextPlayer`)}
                </PrimaryButton>
            </motion.div>
        </motion.div>
    );
};
