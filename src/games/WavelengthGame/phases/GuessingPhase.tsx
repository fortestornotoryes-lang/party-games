import {motion} from 'motion/react';
import React from 'react';

import {GameCard} from '@/components/GameCard';
import {PrimaryButton} from "@/components/PrimaryButton.tsx";

interface GuessingPhaseProps {
    currentPair: string[];
    guessValue: number;
    onGuessChange: (val: number) => void;
    onConfirm: () => void;
}

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({
                                                                currentPair,
                                                                guessValue,
                                                                onGuessChange,
                                                                onConfirm,
                                                            }) => (
    <motion.div
        key="guessing"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{type: 'spring', damping: 25, stiffness: 200}}
        className="h-full flex flex-col space-y-6"
    >
        {/* Title */}
        <div className="text-center">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                НАСТРОЙТЕ ВОЛНУ
            </h3>
        </div>

        {/* Slider section */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <div className="w-full space-y-5">
                {/* Pole labels */}
                <div className="flex justify-between px-2">
          <span className="text-tag font-black uppercase tracking-[0.2em] text-premium-purple">
            {currentPair[0]}
          </span>
                    <span className="text-tag font-black uppercase tracking-[0.2em] text-premium-purple">
            {currentPair[1]}
          </span>
                </div>

                {/* Custom slider */}
                <div className="relative h-12 flex items-center">
                    {/* Track */}
                    <div
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-white/5 rounded-full border border-white/8 overflow-hidden">
                        {/* Fill */}
                        <div
                            className="absolute left-0 top-0 h-full rounded-full"
                            style={{
                                width: `${guessValue}%`,
                                background:
                                    'linear-gradient(90deg, rgba(199,123,255,0.2) 0%, rgba(199,123,255,0.55) 100%)',
                            }}
                        />
                    </div>

                    {/* Thumb overlay */}
                    <motion.div
                        style={{left: `calc(${guessValue}% - 14px)`}}
                        animate={{left: `calc(${guessValue}% - 14px)`}}
                        transition={{type: 'spring', damping: 30, stiffness: 400}}
                        className="absolute top-1/2 -translate-y-1/2 w-7 h-12 bg-white rounded-premium-sm shadow-[0_4px_24px_rgba(0,0,0,0.5)] z-10 pointer-events-none flex items-center justify-center"
                    >
                        <div className="w-0.5 h-6 bg-black/15 rounded-full"/>
                    </motion.div>

                    {/* Invisible native input for interaction */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={guessValue}
                        onChange={(e) => {
                            onGuessChange(parseInt(e.target.value));
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        style={{touchAction: 'none'}}
                    />
                </div>
            </div>

            {/* Value display */}
            <GameCard className="w-full text-center py-6 border border-premium-purple/20 bg-premium-purple/5">
                <div className="text-tag font-black uppercase tracking-[0.3em] text-premium-purple/60 mb-1">
                    Значение
                </div>
                <div className="text-5xl font-black italic tracking-tighter text-white">
                    {guessValue}
                </div>
            </GameCard>
        </div>

        <PrimaryButton onClick={onConfirm} variant="purple">
            ПОДТВЕРДИТЬ ВЫБОР
        </PrimaryButton>
    </motion.div>
);
