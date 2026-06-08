import {ChevronRight} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import {type BunkerCharacter, getRevealedTrait} from '../types';

import {PrimaryButton} from '@/components/PrimaryButton.tsx';
import {Typography} from '@/components/Typography';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import type {GameTheme} from '@/types';
import {rgba} from '@/theme/colors';

interface RevealPhaseProps {
    characters: BunkerCharacter[];
    revealRound: number;
    totalRounds: number;
    onDone: () => void;
}

const ROUND_COLORS: GameTheme[] = ['orange', 'yellow', 'sky', 'green', 'purple', 'red', 'pink'];

export const RevealPhase: React.FC<RevealPhaseProps> = ({
    characters,
    revealRound,
    totalRounds,
    onDone,
}) => {
    const {t} = useTranslation();
    const colorName = ROUND_COLORS[(revealRound - 1) % ROUND_COLORS.length];

    return (
        <motion.div
            key={`reveal-${revealRound}`}
            initial={{opacity: 0, x: 40}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -40}}
            transition={{type: 'spring', stiffness: 300, damping: 28}}
            className="flex flex-col min-h-full px-5 py-6 gap-5"
        >
            {/* Round progress */}
            <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1.5">
                    {Array.from({length: totalRounds}, (_, i) => i + 1).map((r) => (
                        <div
                            key={r}
                            className="h-1.5 rounded-full transition-all"
                            style={{
                                width: r === revealRound ? '2rem' : '0.5rem',
                                background:
                                    r === revealRound
                                        ? `var(--color-premium-${colorName})`
                                        : r < revealRound
                                          ? 'rgba(255,255,255,0.3)'
                                          : 'rgba(255,255,255,0.08)',
                            }}
                        />
                    ))}
                </div>
                <Typography.Label size="xs" color="muted">
                    {t(`${NS.BUNKER}.roundOf`, {current: revealRound, total: totalRounds})}
                </Typography.Label>
            </div>

            {/* All characters */}
            <div className="space-y-2">
                <Typography.Label size="xs" color="muted">
                    {t(`${NS.BUNKER}.revealedThisRound`)}
                </Typography.Label>
                <div className="space-y-2">
                    {characters.map((char, idx) => {
                        const revealed = getRevealedTrait(char, revealRound);
                        if (!revealed) return null;
                        return (
                            <motion.div
                                key={char.playerName}
                                initial={{opacity: 0, y: 8}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: idx * 0.04, type: 'spring', stiffness: 260, damping: 24}}
                                className="flex items-center gap-3 p-3 rounded-premium-sm"
                                style={{
                                    background: `linear-gradient(135deg, ${rgba(colorName, 0.07)} 0%, rgba(0,0,0,0.2) 100%)`,
                                    border: `1px solid ${rgba(colorName, 0.2)}`,
                                }}
                            >
                                <div
                                    className="w-10 h-10 shrink-0 rounded-premium-sm flex items-center justify-center text-xl"
                                    style={{
                                        background: rgba(colorName, 0.12),
                                        border: `1px solid ${rgba(colorName, 0.25)}`,
                                    }}
                                >
                                    {revealed.entry.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-micro text-white/30 font-black uppercase tracking-widest">
                                        {char.playerName} · {char.age} л · {char.gender}
                                    </div>
                                    <div
                                        className="text-micro font-bold uppercase tracking-widest mt-0.5"
                                        style={{color: `var(--color-premium-${colorName})`, opacity: 0.7}}
                                    >
                                        {t(`${NS.BUNKER}.traitLabels.${revealed.traitKey}`)}
                                    </div>
                                    <div className="text-sm font-black text-white mt-0.5 truncate">
                                        {revealed.entry.name}
                                    </div>
                                </div>
                                {!revealed.entry.isPositive && (
                                    <span className="text-premium-red/60 text-xs flex-shrink-0">⚠</span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto">
                <PrimaryButton onClick={onDone} icon={ChevronRight}>
                    {t(`${NS.BUNKER}.allAnnouncedBtn`)}
                </PrimaryButton>
            </div>
        </motion.div>
    );
};
