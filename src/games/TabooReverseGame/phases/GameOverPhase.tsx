import {RotateCcw, Trophy} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import {LeaderboardList} from '@/entities/player/components/LeaderboardList';
import {PrimaryButton} from "@/shared/components/PrimaryButton";
import {useTranslation} from "@/shared/i18n";
import {NS} from "@/shared/i18n/keys";

interface GameOverPhaseProps {
    playerNames: string[];
    scores: Record<string, number>;
    teams?: [string[], string[]];
    onRematch: () => void;
    onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
                                                                playerNames,
                                                                scores,
                                                                teams,
                                                                onRematch,
                                                                onBack,
                                                            }) => {
    const {t} = useTranslation();

    const sorted = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
    const topScore = scores[sorted[0]] ?? 0;
    const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
    const hasWinner = topScore > 0 && topScore > secondScore;

    // ── Team mode calculations ────────────────────────────────────────────────
    const team1Score = teams ? teams[0].reduce((s, p) => s + (scores[p] ?? 0), 0) : 0;
    const team2Score = teams ? teams[1].reduce((s, p) => s + (scores[p] ?? 0), 0) : 0;
    const teamWinner = teams
        ? team1Score > team2Score
            ? 0
            : team2Score > team1Score
                ? 1
                : -1
        : null; // -1 = draw

    return (
        <motion.div
            key="game-over"
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.9}}
            className="flex flex-col items-center p-6 gap-8 max-w-sm mx-auto w-full"
        >
            {/* ── Team result header ─────────────────────────────────────────────── */}
            {teams ? (
                <div className="text-center space-y-2 pt-4 w-full">
                    <Trophy
                        className="w-16 h-16 text-premium-yellow mx-auto mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]"/>
                    <p className="text-micro font-black uppercase tracking-[0.5em] text-white/30">
                        {t(`${NS.TABOO}.gameEnded`)}
                    </p>
                    {teamWinner === -1 ? (
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/70">
                            {t(`${NS.COMMON}.draw`)}!
                        </h2>
                    ) : (
                        <h2
                            className={`text-4xl font-black italic uppercase tracking-tighter ${
                                teamWinner === 0 ? 'text-premium-orange' : 'text-premium-sky'
                            }`}
                        >
                            {t(`${NS.TABOO_REVERSE}.teamWon`, {n: (teamWinner ?? 0) + 1})}
                        </h2>
                    )}

                    {/* Team score cards */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {([0, 1] as const).map((ti) => {
                            const isWinner = teamWinner === ti;
                            const tscore = ti === 0 ? team1Score : team2Score;
                            return (
                                <div
                                    key={ti}
                                    className={`p-4 rounded-premium-md border-2 space-y-2 ${
                                        isWinner
                                            ? ti === 0
                                                ? 'border-premium-orange/60 bg-premium-orange/10 shadow-[0_0_24px_rgba(249,115,22,0.15)]'
                                                : 'border-premium-sky/60 bg-premium-sky/10 shadow-[0_0_24px_rgba(56,189,248,0.15)]'
                                            : 'border-white/10 bg-white/5'
                                    }`}
                                >
                                    <p
                                        className={`text-micro font-black uppercase tracking-widest ${
                                            ti === 0 ? 'text-premium-orange/70' : 'text-premium-sky/70'
                                        }`}
                                    >
                                        {t(`${NS.TABOO_REVERSE}.teamN`, {n: ti + 1})}
                                    </p>
                                    <p
                                        className={`text-3xl font-black italic tabular-nums ${
                                            isWinner
                                                ? ti === 0
                                                    ? 'text-premium-orange'
                                                    : 'text-premium-sky'
                                                : 'text-white/50'
                                        }`}
                                    >
                                        {tscore}
                                    </p>
                                    {/* Members */}
                                    <div className="space-y-1">
                                        {[...teams[ti]]
                                            .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
                                            .map((p) => (
                                                <div key={p} className="flex justify-between items-center">
                                                    <span
                                                        className="text-label font-bold text-white/50 truncate">{p}</span>
                                                    <span
                                                        className="text-label font-black text-white/40 ml-2 tabular-nums">
                            {scores[p] ?? 0}
                          </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* ── Classic / blitz result header ─────────────────────────────────── */
                <div className="text-center space-y-2 pt-4">
                    <Trophy
                        className="w-16 h-16 text-premium-yellow mx-auto mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]"/>
                    <p className="text-micro font-black uppercase tracking-[0.5em] text-white/30">
                        {t(`${NS.TABOO}.gameEnded`)}
                    </p>
                    {hasWinner ? (
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-premium-yellow">
                            {t(`${NS.TABOO_REVERSE}.playerWon`, {player: sorted[0]})}
                        </h2>
                    ) : (
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/70">
                            {t(`${NS.COMMON}.draw`)}!
                        </h2>
                    )}
                </div>
            )}

            {/* ── Individual leaderboard (classic/blitz always; team as subtitle) ── */}
            {!teams && <LeaderboardList players={playerNames} scores={scores}/>}

            <div className="w-full space-y-3">
                <PrimaryButton onClick={onRematch} icon={RotateCcw} variant="outline">
                    {t(`${NS.COMMON}.rematch`).toUpperCase()}
                </PrimaryButton>
                <PrimaryButton onClick={onBack} variant="outline">
                    {t(`${NS.TABOO}.backToMenu`)}
                </PrimaryButton>
            </div>
        </motion.div>
    );
};
