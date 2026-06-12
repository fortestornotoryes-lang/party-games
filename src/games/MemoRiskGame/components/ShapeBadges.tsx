import {AnimatePresence, motion} from 'motion/react';
import React from 'react';

import {SHAPE_META} from '../constants';
import type {MemoShape, RoundShapes} from '../types';

import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import {getTheme} from '@/shared/theme/colors';

const ShapeBadgeRow: React.FC<{label: string; shapes: MemoShape[]; accent: 'green' | 'red'}> = ({
                                                                                                    label,
                                                                                                    shapes,
                                                                                                    accent,
                                                                                                }) => {
    const tokens = getTheme(accent);
    return (
        <div
            className={`flex-1 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-premium-md border ${tokens.border30} ${tokens.bg5}`}
        >
            <span className={`text-micro font-black uppercase tracking-[0.25em] ${tokens.text}`}>
                {label}
            </span>
            <div className="flex items-center gap-2 h-6">
                <AnimatePresence mode="popLayout">
                    {shapes.map((shape) => {
                        const ShapeIcon = SHAPE_META[shape].icon;
                        const shapeTokens = getTheme(SHAPE_META[shape].color);
                        return (
                            <motion.div
                                key={shape}
                                initial={{scale: 0, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                exit={{scale: 0, opacity: 0}}
                                transition={{type: 'spring', stiffness: 400, damping: 25}}
                                layout
                            >
                                <ShapeIcon
                                    className={`w-6 h-6 ${shapeTokens.text}`}
                                    fill="currentColor"
                                    fillOpacity={0.3}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

/** Общие для всех игроков целевые и опасные фигуры текущего раунда. */
export const ShapeBadges: React.FC<{round: RoundShapes}> = ({round}) => {
    const {t} = useTranslation();
    return (
        <div className="flex gap-3 w-full">
            <ShapeBadgeRow label={t(`${NS.MEMO_RISK}.findLabel`)} shapes={round.targets} accent="green"/>
            <ShapeBadgeRow label={t(`${NS.MEMO_RISK}.avoidLabel`)} shapes={round.dangers} accent="red"/>
        </div>
    );
};
