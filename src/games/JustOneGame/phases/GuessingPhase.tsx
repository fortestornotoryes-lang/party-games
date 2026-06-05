import React from 'react';
import {motion} from 'motion/react';
import {PrimaryButton} from '@/components/UI';

interface GuessingPhaseProps {
    guesser: string;
    visibleHints: string[];
    guess: string;
    onGuessChange: (val: string) => void;
    onGuess: () => void;
}

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({
                                                                guesser,
                                                                visibleHints,
                                                                guess,
                                                                onGuessChange,
                                                                onGuess,
                                                            }) => (
    <motion.div
        key="guessing"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        className="p-6 space-y-8"
    >
        <div className="text-center space-y-1 pt-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-premium-yellow">
                {guesser}
            </h3>
            <p className="text-sm text-white/40 font-medium">Угадай слово по подсказкам команды</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
            {visibleHints.map((hint, i) => (
                <motion.div
                    key={i}
                    initial={{scale: 0, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{delay: i * 0.07, type: 'spring', stiffness: 320, damping: 22}}
                    className="px-5 py-3 bg-premium-yellow/[0.07] border border-premium-yellow/20 rounded-premium-md"
                >
          <span className="text-xl font-black italic uppercase tracking-tight text-premium-yellow">
            {hint}
          </span>
                </motion.div>
            ))}
            {visibleHints.length === 0 && (
                <p className="text-white/25 text-sm italic">
                    Все подсказки совпали — ни одной не осталось!
                </p>
            )}
        </div>

        <div className="space-y-3 pt-2">
            <input
                type="text"
                value={guess}
                onChange={(e) => onGuessChange(e.target.value)}
                placeholder="Твоя догадка..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && guess.trim()) onGuess();
                }}
                className="w-full py-5 bg-white/4 border border-white/8 rounded-premium-lg text-center text-3xl font-black italic uppercase outline-none focus:border-premium-yellow/40 transition-all placeholder:text-white/15"
            />
            <PrimaryButton onClick={onGuess} disabled={!guess.trim()}>
                ОТВЕТИТЬ
            </PrimaryButton>
        </div>
    </motion.div>
);
