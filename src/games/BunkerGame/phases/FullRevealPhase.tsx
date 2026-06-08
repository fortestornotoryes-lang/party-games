import {motion} from 'motion/react';
import React from 'react';

import type {BunkerCharacter} from '../types';
import {ALL_TRAIT_KEYS, TRAIT_LABELS} from '../types';

import {PrimaryButton} from '@/components/PrimaryButton';
import {Typography} from '@/components/Typography';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface FullRevealPhaseProps {
    characters: BunkerCharacter[];
    eliminatedNames: string[];
    totalRounds: number;
    onContinue: () => void;
}

const ALL_TRAIT_ROWS: {key: 'profession' | (typeof ALL_TRAIT_KEYS)[number]; label: string}[] = [
    {key: 'profession', label: TRAIT_LABELS.profession},
    ...ALL_TRAIT_KEYS.map((k) => ({key: k as (typeof ALL_TRAIT_KEYS)[number], label: TRAIT_LABELS[k]})),
];

function CharacterCard({
    char,
    isEliminated,
    totalRounds,
    animDelay,
}: {
    char: BunkerCharacter;
    isEliminated: boolean;
    totalRounds: number;
    animDelay: number;
}) {
    const {t} = useTranslation();

    const revealedSet = new Set<string>([
        'profession',
        ...char.revealOrder.slice(0, totalRounds - 1),
    ]);

    const borderColor = isEliminated ? 'rgba(255,46,77,0.2)' : 'rgba(255,138,31,0.25)';
    const bgColor = isEliminated ? 'rgba(255,46,77,0.05)' : 'rgba(255,138,31,0.06)';
    const nameColor = isEliminated ? 'rgba(255,100,120,0.9)' : '#fff';

    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: animDelay, type: 'spring', stiffness: 260, damping: 24}}
            className="rounded-premium-sm overflow-hidden"
            style={{border: `1px solid ${borderColor}`, background: bgColor}}
        >
            {/* Card header */}
            <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                <span className="text-2xl" style={{opacity: isEliminated ? 0.5 : 1}}>
                    {char.profession.emoji}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-black truncate" style={{color: nameColor}}>
                        {char.playerName}
                    </div>
                    <div className="text-tag text-white/35 truncate">
                        {char.profession.name} · {char.age} л · {char.gender}
                    </div>
                </div>
            </div>

            {/* Trait rows */}
            <div className="px-3 pb-3 space-y-1">
                {ALL_TRAIT_ROWS.map(({key, label}) => {
                    const entry = char[key as keyof BunkerCharacter] as {
                        name: string;
                        emoji: string;
                    } | undefined;
                    if (!entry || typeof entry !== 'object' || !('emoji' in entry)) return null;

                    const isRevealed = revealedSet.has(key);

                    return (
                        <div
                            key={key}
                            className="flex items-center gap-2 min-w-0"
                            style={{opacity: isRevealed ? 1 : 0.4}}
                        >
                            <span className="text-sm w-5 text-center flex-shrink-0">{entry.emoji}</span>
                            <span className="text-xs text-white/40 flex-shrink-0 w-20 truncate">
                                {label}
                            </span>
                            <span className="text-xs font-bold text-white flex-1 truncate">
                                {entry.name}
                            </span>
                            {!isRevealed && (
                                <span
                                    className="text-tag flex-shrink-0 px-1.5 py-0.5 rounded"
                                    style={{
                                        color: '#FF8A1F',
                                        background: 'rgba(255,138,31,0.12)',
                                        border: '1px solid rgba(255,138,31,0.3)',
                                    }}
                                >
                                    {t(`${NS.BUNKER}.hiddenBadge`)}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export const FullRevealPhase: React.FC<FullRevealPhaseProps> = ({
    characters,
    eliminatedNames,
    totalRounds,
    onContinue,
}) => {
    const {t} = useTranslation();

    const survivors = characters.filter((c) => !eliminatedNames.includes(c.playerName));
    const eliminated = characters.filter((c) => eliminatedNames.includes(c.playerName));

    return (
        <motion.div
            key="full-reveal"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="flex flex-col px-5 py-6 gap-5 min-h-full"
        >
            {/* Header */}
            <div className="space-y-1">
                <Typography.Display size="md" glow align="center" color="orange">
                    {t(`${NS.BUNKER}.fullRevealLabel`)}
                </Typography.Display>
                <Typography.Body size="sm" color="muted" align="center">
                    {t(`${NS.BUNKER}.fullRevealDesc`)}
                </Typography.Body>
            </div>

            {/* Survivors */}
            {survivors.length > 0 && (
                <div className="space-y-2">
                    <Typography.Label size="xs" color="muted">
                        {t(`${NS.BUNKER}.survivorsLabel`)}
                    </Typography.Label>
                    <div className="space-y-2">
                        {survivors.map((char, idx) => (
                            <CharacterCard
                                key={char.playerName}
                                char={char}
                                isEliminated={false}
                                totalRounds={totalRounds}
                                animDelay={0.1 + idx * 0.07}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Eliminated */}
            {eliminated.length > 0 && (
                <div className="space-y-2">
                    <Typography.Label size="xs" color="muted">
                        {t(`${NS.BUNKER}.outsidersLabel`)}
                    </Typography.Label>
                    <div className="space-y-2">
                        {eliminated.map((char, idx) => (
                            <CharacterCard
                                key={char.playerName}
                                char={char}
                                isEliminated={true}
                                totalRounds={totalRounds}
                                animDelay={0.1 + survivors.length * 0.07 + 0.1 + idx * 0.07}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Continue button */}
            <div className="mt-auto pt-2">
                <PrimaryButton onClick={onContinue}>
                    {t(`${NS.BUNKER}.toSurvivalBtn`)}
                </PrimaryButton>
            </div>
        </motion.div>
    );
};
