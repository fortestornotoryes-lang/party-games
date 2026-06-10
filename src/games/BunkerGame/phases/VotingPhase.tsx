import {Check, UserX, Vote} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React, {useState} from 'react';

import {ResourceContribRow} from '../components/ResourceContribRow';
import {getPlayerResourceContribution, getRevealedTrait} from '../helpers';
import {type BunkerCharacter, type DifficultyLevel} from '../types';

import {PrimaryButton} from "@/components/PrimaryButton.tsx";
import {Typography} from '@/components/Typography';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {feedbackService, VIBRATE} from '@/services/feedbackService';
import {DIFFICULTY} from '@/types';

interface VotingPhaseProps {
    characters: BunkerCharacter[];
    bunkerCapacity: number;
    totalRounds: number;
    difficulty: DifficultyLevel;
    directorName?: string | null;
    onConfirm: (eliminatedNames: string[]) => void;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({
                                                            characters,
                                                            bunkerCapacity,
                                                            totalRounds,
                                                            difficulty,
                                                            directorName,
                                                            onConfirm,
                                                        }) => {
    const {t} = useTranslation();

    // Director occupies one guaranteed spot — exclude from voting
    const votable = directorName
        ? characters.filter((c) => c.playerName !== directorName)
        : characters;
    const toEliminate = Math.max(0, characters.length - bunkerCapacity);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggle = (name: string) => {
        feedbackService.vibrate(VIBRATE.tap);
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
            } else if (next.size < toEliminate) {
                next.add(name);
            }
            return next;
        });
    };

    const handleConfirm = () => {
        if (selected.size !== toEliminate) return;
        feedbackService.vibrate(VIBRATE.win);
        onConfirm(Array.from(selected));
    };

    const remaining = toEliminate - selected.size;

    return (
        <motion.div
            key="voting"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            className="flex flex-col min-h-full px-5 py-6 gap-5"
        >
            {/* Header */}
            <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                    <Vote className="w-4 h-4 text-premium-red"/>
                    <Typography.Label size="sm" color="red">
                        {t(`${NS.BUNKER}.votingLabel`)}
                    </Typography.Label>
                </div>
                <Typography.Title size="sm" color="white" align="center">
                    {t(`${NS.BUNKER}.whoWontEnter`)}
                </Typography.Title>
            </div>

            {/* Counter */}
            <div
                className="rounded-premium-md p-3 text-center"
                style={{
                    background: remaining > 0 ? 'rgba(255,46,77,0.08)' : 'rgba(0,216,138,0.08)',
                    border: `1px solid ${remaining > 0 ? 'rgba(255,46,77,0.25)' : 'rgba(0,216,138,0.25)'}`,
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={remaining}
                        initial={{scale: 0.8, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.8, opacity: 0}}
                    >
                        {remaining > 0 ? (
                            <Typography.Body size="sm" color="body" align="center">
                                {t(`${NS.BUNKER}.selectMore`, {n: remaining})}
                            </Typography.Body>
                        ) : (
                            <Typography.Body size="sm" color="green" align="center">
                                {t(`${NS.BUNKER}.selectionDone`, {n: toEliminate})}
                            </Typography.Body>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Director safe badge */}
            {!!directorName && (
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-premium-md"
                    style={{
                        background: 'rgba(255,204,31,0.07)',
                        border: '1px solid rgba(255,204,31,0.25)',
                    }}
                >
                    <span className="text-lg">👑</span>
                    <div className="flex-1 min-w-0">
                        <span className="font-black italic uppercase text-white">{directorName}</span>
                        <span
                            className="ml-2 text-tag font-black uppercase tracking-wider"
                            style={{color: 'var(--color-premium-yellow)'}}
                        >
              {t(`${NS.BUNKER}.directorProtected`)}
            </span>
                    </div>
                </div>
            )}

            {/* Player list */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                {votable.map((char) => {
                    const isSelected = selected.has(char.playerName);
                    const revealed = Array.from({length: totalRounds}, (_, i) => i + 1)
                        .map((r) => getRevealedTrait(char, r))
                        .filter(Boolean) as { label: string; entry: { emoji: string; name: string } }[];
                    const contrib = difficulty !== DIFFICULTY.HARD ? getPlayerResourceContribution(char) : null;

                    return (
                        <motion.button
                            key={char.playerName}
                            onClick={() => {
                                toggle(char.playerName);
                            }}
                            whileTap={{scale: 0.97}}
                            className="w-full text-left rounded-premium-md transition-all"
                            style={{
                                background: isSelected ? 'rgba(255,46,77,0.1)' : 'rgba(255,255,255,0.04)',
                                border: isSelected
                                    ? '1.5px solid rgba(255,46,77,0.4)'
                                    : '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <div className="p-3.5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-5 h-5 rounded-premium-xs border-2 flex items-center justify-center transition-all flex-shrink-0"
                                            style={{
                                                borderColor: isSelected ? 'rgba(255,46,77,0.8)' : 'rgba(255,255,255,0.2)',
                                                background: isSelected ? 'rgba(255,46,77,0.8)' : 'transparent',
                                            }}
                                        >
                                            {!!isSelected && <Check className="w-3 h-3 text-white"/>}
                                        </div>
                                        <span className="font-black italic uppercase text-lg text-white leading-none">
                      {char.playerName}
                    </span>
                                        {!!isSelected && (
                                            <div className="flex items-center gap-1">
                                                <UserX className="w-3.5 h-3.5 text-premium-red"/>
                                                <span
                                                    className="text-tag font-black text-premium-red uppercase tracking-wider">
                          {t(`${NS.BUNKER}.eliminatedBadge`)}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-white/30 font-bold">
                    {char.gender} · {char.age}
                  </span>
                                </div>

                                {/* Revealed traits */}
                                <div className="flex flex-wrap gap-1.5">
                                    {revealed.map((rev, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-premium-xs text-tag font-bold"
                                            style={{
                                                background: 'rgba(255,255,255,0.06)',
                                                color: isSelected ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)',
                                            }}
                                        >
                                            {rev.entry.emoji} {rev.entry.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Resource contribution (easy/medium only) */}
                                {!!contrib && <ResourceContribRow contrib={contrib} className="flex gap-2 mt-1.5 flex-wrap"/>}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Confirm */}
            <PrimaryButton
                onClick={handleConfirm}
                disabled={selected.size !== toEliminate}
                variant="red"
                icon={UserX}
            >
                {t(`${NS.BUNKER}.confirmVoteBtn`)}
            </PrimaryButton>
        </motion.div>
    );
};
