import {motion} from 'motion/react';
import React from 'react';

import {PlayingHeader} from '@/components/PlayingHeader.tsx';
import {PrimaryButton} from "@/components/PrimaryButton.tsx";
import {TimerBar} from '@/components/TimerBar.tsx';
import type {TabooClassicCard} from '@/constants/tabooContent.ts';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

/** Плавное уменьшение шрифта по длине слова + перенос как запасной вариант */
const wordFontSize = (word: string): string => {
    const n = word.length;
    if (n <= 6) return '3.5rem';
    if (n <= 8) return '2.8rem';
    if (n <= 10) return '2.3rem';
    if (n <= 13) return '1.9rem';
    return '1.5rem';
};

interface PlayingPhaseProps {
    card: TabooClassicCard;
    currentExplainer: string;
    timeLeft: number;
    cardTimer: number;
    onGuessed: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
                                                              card,
                                                              currentExplainer,
                                                              timeLeft,
                                                              cardTimer,
                                                              onGuessed,
                                                          }) => {
    const {t} = useTranslation();
    const timerPct = (timeLeft / cardTimer) * 100;
    const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#eab308' : '#ef4444';

    return (
        <motion.div
            key="playing"
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.95}}
            className="flex flex-col min-h-full"
        >
            <TimerBar pct={timerPct} color={timerColor}/>

            <div className="flex-1 flex flex-col p-6 gap-5 max-w-lg mx-auto w-full">
                <PlayingHeader explainer={currentExplainer} timeLeft={timeLeft} timerColor={timerColor}/>

                {/* Forbidden words — shown first so explainer sees the constraints */}
                <div className="p-5 rounded-premium-lg border-2 border-premium-red/30 bg-premium-red/5">
                    <p className="text-micro font-black uppercase tracking-[0.5em] text-premium-red/60 mb-3 text-center">
                        🚫 {t(`${NS.TABOO}.forbiddenWords`)}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {card.forbidden.map((w, i) => (
                            <div
                                key={i}
                                className="px-4 py-2 rounded-premium-md border border-premium-red/40 bg-premium-red/10 font-black italic uppercase text-sm text-premium-red"
                            >
                                {w}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main word */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="p-8 rounded-premium-2xl border-2 border-white/15 bg-white/5 text-center w-full">
                        <p className="text-micro font-black uppercase tracking-[0.5em] text-white/30 mb-3">
                            {t(`${NS.TABOO}.wordToGuess`)}
                        </p>
                        <h2
                            className="font-black italic uppercase tracking-tighter leading-tight text-white wrap-break-word"
                            style={{fontSize: wordFontSize(card.word)}}
                        >
                            {card.word}
                        </h2>
                    </div>
                </div>

                {/* Action */}
                <div className="space-y-2">
                    <PrimaryButton
                        onClick={onGuessed}
                        className="bg-premium-green! text-white! shadow-premium-green/30"
                    >
                        {t(`${NS.TABOO}.wordGuessed`)}
                    </PrimaryButton>
                    <p className="text-center text-micro font-black uppercase tracking-widest text-white/20">
                        {t(`${NS.TABOO}.forbiddenHint`)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
