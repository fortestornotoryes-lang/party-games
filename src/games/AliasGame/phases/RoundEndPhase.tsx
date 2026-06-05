import React from 'react';
import {motion} from 'motion/react';
import {PrimaryButton} from '@/components/UI';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface RoundEndPhaseProps {
    roundScore: number;
    onContinue: () => void;
}

export const RoundEndPhase: React.FC<RoundEndPhaseProps> = ({roundScore, onContinue}) => {
    const {t} = useTranslation();
    return (
        <motion.div
            key="round_end"
            initial={{opacity: 0, scale: 0.84}}
            animate={{opacity: 1, scale: 1}}
            transition={{type: 'spring', stiffness: 280, damping: 22}}
            className="h-full flex flex-col p-6 items-center justify-center text-center gap-8"
        >
            <div className="space-y-2">
                <p className="text-micro font-black uppercase tracking-[0.5em] text-white/20">
                    {t(`${NS.ALIAS}.timeUp`)}
                </p>
                <div
                    className={`text-8xl font-black italic tracking-tighter leading-none ${
                        roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'
                    }`}
                >
                    {fmtScore(roundScore)}
                </div>
                <h3 className="text-sm font-black uppercase italic tracking-tight text-white/45">
                    {t(`${NS.ALIAS}.pointsPerRound`)}
                </h3>
            </div>
            <PrimaryButton onClick={onContinue}>{t(`${NS.ALIAS}.continueBtn`)}</PrimaryButton>
        </motion.div>
    );
};
