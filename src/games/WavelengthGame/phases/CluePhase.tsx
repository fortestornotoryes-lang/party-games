import React from 'react';
import {motion} from 'motion/react';
import {ChevronRight, Sparkles} from 'lucide-react';
import {PrimaryButton} from '@/components/UI';
import {GameCard} from '@/components/GameCard';

interface CluePhaseProps {
    psychic: string;
    currentPair: string[];
    targetValue: number;
    onDone: () => void;
}

export const CluePhase: React.FC<CluePhaseProps> = ({
                                                        psychic,
                                                        currentPair,
                                                        targetValue,
                                                        onDone,
                                                    }) => (
    <motion.div
        key="clue"
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -20}}
        transition={{type: 'spring', damping: 25, stiffness: 200}}
        className="h-full flex flex-col space-y-6"
    >
        {/* Psychic identity */}
        <div className="text-center space-y-2">
            <div className="text-tag font-black uppercase tracking-[0.4em] text-white/35">
                Текущий Телепат
            </div>
            <h3 className="text-4xl font-black italic text-premium-purple tracking-tighter uppercase">
                {psychic}
            </h3>
            <p className="text-sm text-white/50 font-medium max-w-xs mx-auto">
                Только ты видишь целевую зону на шкале!
            </p>
        </div>

        {/* Scale card */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <GameCard className="relative w-full overflow-hidden">
                {/* Top accent line */}
                <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent 0%, rgba(199,123,255,0.4) 50%, transparent 100%)',
                    }}
                />

                <div className="relative w-full px-8 py-8 pointer-events-none">
                    {/* Scale track */}
                    <div
                        className="h-5 w-full bg-black/40 rounded-full relative overflow-visible border border-white/8">
                        {/* Purple target zone */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.3, duration: 0.4}}
                            style={{left: `${Math.max(0, targetValue - 5)}%`, width: '10%'}}
                            className="absolute top-0 h-full bg-premium-purple/70 rounded-premium-xs"
                            aria-hidden="true"
                        >
                            {/* Glow */}
                            <div
                                className="absolute inset-0 rounded-premium-xs"
                                style={{boxShadow: '0 0 18px 4px rgba(199,123,255,0.45)'}}
                            />
                        </motion.div>

                        {/* Center tick */}
                        <motion.div
                            initial={{scaleY: 0}}
                            animate={{scaleY: 1}}
                            transition={{delay: 0.45, duration: 0.25}}
                            style={{left: `${targetValue}%`}}
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/70 z-10"
                        />
                    </div>

                    {/* Pair labels */}
                    <div className="flex justify-between mt-3">
            <span className="text-tag font-black uppercase tracking-[0.2em] text-premium-purple/80">
              {currentPair[0]}
            </span>
                        <span className="text-tag font-black uppercase tracking-[0.2em] text-premium-purple/80">
              {currentPair[1]}
            </span>
                    </div>
                </div>
            </GameCard>

            {/* Clue instruction */}
            <div className="space-y-3 text-center w-full">
                <div className="flex items-center justify-center gap-2 text-white/35 text-sm font-medium">
                    <Sparkles className="w-3.5 h-3.5"/>
                    <span>Придумай подсказку, чтобы попали в зону</span>
                </div>

                {/* Pair display */}
                <div className="flex items-center justify-center gap-2">
          <span className="text-base font-black italic uppercase tracking-tight text-white/50">
            {currentPair[0]}
          </span>
                    <ChevronRight className="w-4 h-4 text-premium-purple"/>
                    <span className="text-base font-black italic uppercase tracking-tight text-white">
            {currentPair[1]}
          </span>
                </div>
            </div>
        </div>

        <PrimaryButton onClick={onDone} variant="purple">
            Я ДАЛ ПОДСКАЗКУ
        </PrimaryButton>
    </motion.div>
);
