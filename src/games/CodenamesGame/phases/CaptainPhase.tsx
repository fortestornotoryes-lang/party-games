import {Zap} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import type {Card, Team} from '../types';

import {PrimaryButton} from "@/components/PrimaryButton.tsx";
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface CaptainPhaseProps {
    cards: Card[];
    turn: Team;
    currentCaptain: string;
    clueWord: string;
    clueCount: number;
    onClueWordChange: (word: string) => void;
    onClueCountChange: (count: number) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const CaptainPhase: React.FC<CaptainPhaseProps> = ({
                                                              cards,
                                                              turn,
                                                              currentCaptain,
                                                              clueWord,
                                                              clueCount,
                                                              onClueWordChange,
                                                              onClueCountChange,
                                                              onSubmit,
                                                          }) => {
    const {t} = useTranslation();

    return (
        <motion.div
            key="captain"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="space-y-4 flex flex-col"
        >
            <div className="text-center">
                <p
                    className={`text-sub-heading font-black uppercase tracking-widest ${turn === 'red' ? 'text-premium-red' : 'text-premium-blue'}`}
                >
                    {t(`${NS.CODENAMES}.captainTurn`, {name: currentCaptain})}
                </p>
                <div
                    className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 mb-2 text-label font-black uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full border border-premium-red bg-black"></span>
                        {t(`${NS.CODENAMES}.redTeam`)}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full border border-premium-blue bg-black"></span>
                        {t(`${NS.CODENAMES}.blueTeam`)}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full border bg-stone-400/50"></span>
                        {t(`${NS.CODENAMES}.neutralEndTurn`)}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-900 border border-red-900"></span>
                        {t(`${NS.CODENAMES}.assassinDeath`)}
                    </div>
                </div>
                <p className="text-xs text-white/40 mt-1">{t(`${NS.CODENAMES}.makeClueHint`)}</p>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-4">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`aspect-4/3 rounded border flex items-center justify-center p-1 text-center relative
                            ${card.revealed ? 'opacity-30' : ''}
                            ${
                            card.color === 'red'
                                ? 'border-premium-red/80'
                                : card.color === 'blue'
                                    ? 'border-premium-blue/80'
                                    : card.color === 'neutral'
                                        ? 'bg-stone-400/50 text-white'
                                        : card.color === 'double_agent'
                                            ? 'border-premium-green/80'
                                            : 'bg-red-900 border-red-900'
                        }
                        `}
                    >
            <span className="text-micro font-bold leading-tight wrap-break-word uppercase">
              {card.word}
            </span>
                        {card.color === 'double_agent' && (
                            <div className="absolute top-1 right-1">
                                <Zap className="w-4 h-4 text-white fill-white"/>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-4 mt-auto">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={clueWord}
                        onChange={(e) => {
                            onClueWordChange(e.target.value.replace(/ /g, ''));
                        }}
                        placeholder={t(`${NS.CODENAMES}.oneWord`)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-premium-sm px-4 py-3 text-center font-bold outline-none focus:border-premium-green/50 transition-colors uppercase"
                        required
                    />
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="9"
                        pattern="[0-9]*"
                        value={clueCount === 0 ? '' : clueCount}
                        onChange={(e) => {
                            onClueCountChange(parseInt(e.target.value) || 0);
                        }}
                        placeholder="0"
                        className="w-20 bg-white/5 border border-white/10 rounded-premium-sm px-4 py-3 text-center text-xl font-bold outline-none focus:border-premium-green/50 transition-colors"
                        required
                    />
                </div>
                <PrimaryButton
                    type="submit"
                    variant={turn === 'red' ? 'red' : 'blue'}
                    disabled={!clueWord || clueCount <= 0}
                >
                    {t(`${NS.CODENAMES}.confirm`)}
                </PrimaryButton>
            </form>
        </motion.div>
    );
};
