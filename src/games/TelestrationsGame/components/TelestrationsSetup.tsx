import {ArrowRight, Pencil} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import type {Difficulty} from '@/constants/telestrationsContent';
import {DIFFICULTY_CONFIG} from '@/constants/telestrationsContent';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {DIFFICULTY} from '@/types';

interface Props {
    playerCount: number;
    difficulty: Difficulty;
    onDifficultyChange: (d: Difficulty) => void;
    onStart: () => void;
}

export const TelestrationsSetup: React.FC<Props> = ({
                                                        playerCount,
                                                        difficulty,
                                                        onDifficultyChange,
                                                        onStart,
                                                    }) => {
    const {t} = useTranslation();

    return (
        <motion.div
            key="setup"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.25}}
            className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-6"
        >
            <div className="text-center space-y-2">
                <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-premium-md bg-premium-orange/10 border border-premium-orange/20 mb-1">
                    <Pencil className="w-7 h-7 text-premium-orange"/>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">{t(`${NS.TELESTRATIONS}.settingsTitle`)}</h3>
                <p className="text-white/30 text-sm">{t(`${NS.TELESTRATIONS}.playerCount`, {n: playerCount})}</p>
            </div>

            <div className="w-full max-w-sm space-y-3">
                <p className="text-micro text-white/25 uppercase font-black tracking-widest mb-3 text-center">
                    {t(`${NS.TELESTRATIONS}.difficultyLabel`)}
                </p>
                {(Object.values(DIFFICULTY) as Difficulty[]).map((diff) => {
                    const cfg = DIFFICULTY_CONFIG[diff];
                    const isSelected = difficulty === diff;
                    return (
                        <motion.button
                            key={diff}
                            whileTap={{scale: 0.97}}
                            onClick={() => {
                                onDifficultyChange(diff);
                            }}
                            className={`w-full p-4 rounded-premium-md border text-left flex items-center gap-4 transition-all ${
                                isSelected ? `${cfg.border} ${cfg.bg}` : 'border-white/10 bg-white/5 opacity-50'
                            }`}
                        >
                            <span className="text-2xl leading-none">{cfg.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <h4
                                    className={`text-base font-black uppercase italic ${isSelected ? cfg.text : 'text-white/40'}`}
                                >
                                    {t(`${NS.TELESTRATIONS}.difficultyLabels.${diff}`)}
                                </h4>
                                <p className="text-xs text-white/30 mt-0.5 leading-tight">
                                    {t(`${NS.TELESTRATIONS}.difficultyDescriptions.${diff}`)}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p
                                    className={`text-base font-black tabular-nums ${isSelected ? cfg.text : 'text-white/25'}`}
                                >
                                    {t(`${NS.TELESTRATIONS}.timerSeconds`, {n: cfg.drawTime})}
                                </p>
                                <p className="text-micro text-white/25 uppercase font-bold tracking-widest">
                                    {t(`${NS.TELESTRATIONS}.drawingTimerLabel`)}
                                </p>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <motion.button
                whileTap={{scale: 0.97}}
                onClick={onStart}
                className="w-full max-w-sm py-5 bg-white text-black rounded-premium-md font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl"
            >
                <span>{t(`${NS.COMMON}.start`)}</span>
                <ArrowRight className="w-5 h-5"/>
            </motion.button>
        </motion.div>
    );
};
