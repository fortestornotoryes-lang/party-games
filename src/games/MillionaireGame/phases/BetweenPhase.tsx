import confetti from 'canvas-confetti';
import {Banknote, CheckCircle, TrendingUp} from 'lucide-react';
import {motion} from 'motion/react';
import React, {useEffect} from 'react';

import {PrimaryButton} from "@/components/PrimaryButton.tsx";
import {PRIZE_LADDER} from '@/constants/millionaireContent';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface BetweenPhaseProps {
    currentPlayer: string;
    questionIndex: number;
    onTakeMoney: () => void;
    onContinue: () => void;
}

export const BetweenPhase: React.FC<BetweenPhaseProps> = ({
                                                              currentPlayer,
                                                              questionIndex,
                                                              onTakeMoney,
                                                              onContinue,
                                                          }) => {
    const {t} = useTranslation();
    const currentPrize = PRIZE_LADDER[questionIndex];
    const nextPrize = PRIZE_LADDER[questionIndex + 1];

    useEffect(() => {
        const timer = setTimeout(() => {
            confetti({
                particleCount: 55,
                spread: 50,
                origin: {y: 0.25},
                colors: ['#FFCC1F', '#FFD700', '#FFA500', '#fff'],
                gravity: 1.2,
            });
        }, 200);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <motion.div
            key="between"
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.95}}
            transition={{duration: 0.25}}
            className="h-full flex flex-col items-center justify-center p-6 gap-5"
        >
            {/* Checkmark + player name */}
            <motion.div
                initial={{scale: 0, rotate: -15}}
                animate={{scale: 1, rotate: 0}}
                transition={{type: 'spring', stiffness: 280, damping: 18, delay: 0.1}}
                className="flex flex-col items-center gap-3"
            >
                <div
                    className="w-20 h-20 rounded-full bg-premium-green/12 border-2 border-premium-green/40 flex items-center justify-center"
                    style={{boxShadow: '0 0 40px rgba(0,216,138,0.22)'}}
                >
                    <CheckCircle className="w-10 h-10 text-premium-green"/>
                </div>
                <div className="text-center">
                    <p className="text-tag font-black uppercase tracking-[0.28em] text-premium-green/70 mb-1">
                        {t(`${NS.MILLIONAIRE}.correctBadge`)}
                    </p>
                    <p className="text-label text-white/55 font-semibold">{currentPlayer}</p>
                </div>
            </motion.div>

            {/* Prize won */}
            <motion.div
                initial={{opacity: 0, y: 24}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.22}}
                className="w-full glass-card rounded-premium-lg p-5 text-center"
                style={{borderColor: 'rgba(255,204,31,0.2)'}}
            >
                <div className="h-px bg-gradient-to-r from-transparent via-premium-yellow/40 to-transparent mb-4"/>
                <p className="text-tag font-black uppercase tracking-[0.22em] text-white/35 mb-1">
                    {t(`${NS.MILLIONAIRE}.questionSum`, {n: questionIndex + 1})}
                </p>
                <motion.p
                    initial={{scale: 0.8}}
                    animate={{scale: 1}}
                    transition={{type: 'spring', stiffness: 300, damping: 18, delay: 0.3}}
                    className="text-5xl font-black font-display italic tracking-tighter text-premium-yellow leading-none"
                    style={{textShadow: '0 0 40px rgba(255,204,31,0.5)'}}
                >
                    {currentPrize}
                </motion.p>
                <p className="text-tag text-white/25 mt-2 font-black uppercase tracking-wider">
                    {t(`${NS.MILLIONAIRE}.inPocket`)}
                </p>
            </motion.div>

            {/* Decision */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.35}}
                className="w-full space-y-3"
            >
                {/* Primary: continue for next prize */}
                <button
                    onClick={onContinue}
                    className="w-full h-16 rounded-premium-md border border-premium-yellow/30 bg-premium-yellow/10 text-premium-yellow font-black italic text-lg uppercase tracking-tighter flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-premium-yellow/15"
                    style={{boxShadow: '0 0 20px rgba(255,204,31,0.08)'}}
                >
                    <TrendingUp className="w-5 h-5 shrink-0"/>
                    <span>{t(`${NS.MILLIONAIRE}.goForPrize`, {prize: nextPrize})}</span>
                </button>

                {/* Secondary: take money */}
                <PrimaryButton variant="outline" icon={Banknote} onClick={onTakeMoney}>
                    {t(`${NS.MILLIONAIRE}.takeMoney`, {prize: currentPrize})}
                </PrimaryButton>
            </motion.div>
        </motion.div>
    );
};
