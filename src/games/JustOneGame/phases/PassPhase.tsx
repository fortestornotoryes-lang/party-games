import {motion} from 'motion/react';
import React from 'react';

import {PrimaryButton} from '@/components/UI';

interface PassPhaseProps {
    guesser: string;
    onReady: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({guesser, onReady}) => (
    <motion.div
        key="pass"
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0}}
        transition={{type: 'spring', stiffness: 280, damping: 22}}
        className="min-h-full flex flex-col items-center justify-center gap-8 p-6 text-center"
    >
        <div className="space-y-3">
            <p className="text-micro font-black uppercase tracking-[0.5em] text-white/25">Новый раунд</p>
            <h3 className="text-base font-black uppercase tracking-[0.3em] text-white/50">Отгадывает:</h3>
            <h2
                className="text-5xl font-black italic uppercase text-premium-yellow tracking-tighter leading-none"
                style={{textShadow: '0 0 40px rgba(255,204,31,0.3)'}}
            >
                {guesser}
            </h2>
        </div>

        <div
            className="w-full max-w-sm p-6 bg-premium-yellow/[0.05] border border-premium-yellow/15 rounded-premium-xl text-sm text-white/40 leading-relaxed">
            {guesser}, передай телефон остальным. Только они увидят загаданное слово!
        </div>

        <PrimaryButton onClick={onReady}>МЫ ВЗЯЛИ ТЕЛЕФОН</PrimaryButton>
    </motion.div>
);
