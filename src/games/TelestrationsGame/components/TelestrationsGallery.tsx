import {Home, Shuffle} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import {STEP_TYPE} from '../types';
import type {Step} from '../types';

interface Props {
    initialWord: string;
    steps: Step[];
    onNewGame: () => void;
    onBack: () => void;
}

export const TelestrationsGallery: React.FC<Props> = ({
                                                          initialWord,
                                                          steps,
                                                          onNewGame,
                                                          onBack,
                                                      }) => (
    <motion.div
        key="gallery"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.25}}
        className="absolute inset-0 overflow-y-auto"
    >
        <div className="p-6 space-y-6 pb-40">
            <div className="text-center space-y-1">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Финал цепочки</h3>
                <p className="text-white/30 text-sm">Смотрите, как менялось слово</p>
            </div>

            <div className="flex items-center gap-4">
                <div
                    className="w-11 h-11 flex-shrink-0 rounded-full bg-premium-orange/10 border border-premium-orange/20 flex items-center justify-center text-micro font-black text-premium-orange">
                    START
                </div>
                <div className="flex-1 p-4 bg-premium-orange/10 border border-premium-orange/20 rounded-premium-md">
                    <p className="text-xs text-premium-orange uppercase font-black tracking-widest mb-1">
                        Исходное слово
                    </p>
                    <p className="text-xl font-bold italic">{initialWord}</p>
                </div>
            </div>

            {steps.map((step, idx) => (
                <motion.div
                    key={idx}
                    initial={{opacity: 0, y: 16}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: idx * 0.08}}
                    className="flex flex-col gap-2"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-black border ${
                                step.type === STEP_TYPE.Draw
                                    ? 'bg-premium-orange/10 border-premium-orange/20 text-premium-orange'
                                    : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                        >
                            {step.type === STEP_TYPE.Draw ? '✏️' : '💬'}
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-white/30">
                            {step.author}
                        </p>
                    </div>
                    <div className="ml-14 bg-white/5 border border-white/5 rounded-premium-lg overflow-hidden p-3">
                        {step.type === STEP_TYPE.Draw ? (
                            <img src={step.content} alt="Drawing" className="w-full rounded-premium-sm"/>
                        ) : (
                            <div className="p-3 text-center">
                                <p className="text-xl font-black italic">{step.content}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>

        <div
            className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/95 to-transparent pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-3 max-w-sm mx-auto">
                <button
                    onClick={onNewGame}
                    className="w-full py-5 bg-white text-black rounded-premium-md font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
                >
                    <Shuffle className="w-5 h-5"/>
                    <span>Новая игра</span>
                </button>
                <button
                    onClick={onBack}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white/40 rounded-premium-md font-bold uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                >
                    <Home className="w-4 h-4"/>
                    <span className="text-xs">В меню</span>
                </button>
            </div>
        </div>
    </motion.div>
);
