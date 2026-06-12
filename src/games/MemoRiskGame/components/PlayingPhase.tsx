import {Banknote, Layers} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React from 'react';

import {TurnOutcome, type MemoCard, type RoundShapes} from '../types';

import {MemoBoard} from './MemoBoard';
import {ShapeBadges} from './ShapeBadges';

import {StopGameButton} from '@/components/StopGameButton';
import {PrimaryButton} from '@/shared/components/PrimaryButton';
import {TimerBar} from '@/shared/components/TimerBar';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';

interface PlayingPhaseProps {
    board: (MemoCard | null)[];
    gridSize: number;
    /** Общие для всех игроков фигуры раунда */
    round: RoundShapes;
    currentPlayer: string;
    /** Общий счёт текущего игрока */
    totalScore: number;
    turnPoints: number;
    /** Сколько очков ушло в банк (с учётом супер-карты) — для вердикта */
    gainedPoints: number;
    superActive: boolean;
    outcome: TurnOutcome | null;
    /** null — режим без лимита открытий */
    flipsLeft: number | null;
    /** Карт в колоде добора */
    deckCount: number;
    /** null — режим без таймера */
    timer: {timeLeft: number; totalSeconds: number} | null;
    escalation: number;
    onFlip: (slot: number) => void;
    onBank: () => void;
    onStopGame: () => void;
}

const VERDICT_KEYS: Record<TurnOutcome, {title: string; desc: string}> = {
    [TurnOutcome.Banked]: {title: 'bankedTitle', desc: 'bankedDesc'},
    [TurnOutcome.Busted]: {title: 'bustedTitle', desc: 'bustedDesc'},
    [TurnOutcome.Timeout]: {title: 'timeoutTitle', desc: 'timeoutDesc'},
    [TurnOutcome.OutOfFlips]: {title: 'outOfFlipsTitle', desc: 'outOfFlipsDesc'},
};

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
                                                              board,
                                                              gridSize,
                                                              round,
                                                              currentPlayer,
                                                              totalScore,
                                                              turnPoints,
                                                              gainedPoints,
                                                              superActive,
                                                              outcome,
                                                              flipsLeft,
                                                              deckCount,
                                                              timer,
                                                              escalation,
                                                              onFlip,
                                                              onBank,
                                                              onStopGame,
                                                          }) => {
    const {t} = useTranslation();

    const timerPct = timer ? (timer.timeLeft / timer.totalSeconds) * 100 : 0;
    const timerColor = timerPct > 50 ? '#00d88a' : timerPct > 25 ? '#ffcc1f' : '#ff2e4d';
    const isBusted = outcome === TurnOutcome.Busted;
    const verdictAmount = isBusted ? turnPoints : gainedPoints;

    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
            {timer ? (
                <TimerBar pct={timerPct} color={timerColor} className="rounded-full overflow-hidden"/>
            ) : null}

            {/* Цели и опасности раунда — общие для всех */}
            <ShapeBadges round={round}/>

            {/* Текущий игрок и его счёт — меняются при передаче хода */}
            <div className="flex items-center justify-between px-4 py-3 rounded-premium-md border border-white/10 bg-white/5">
                <div className="min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentPlayer}
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            className="font-black truncate text-white/90"
                        >
                            {currentPlayer}
                            <span className="ml-2 text-premium-pink tabular-nums">{totalScore}</span>
                        </motion.p>
                    </AnimatePresence>
                    <p className="text-micro font-black uppercase tracking-widest text-white/30">
                        {t(`${NS.MEMO_RISK}.riskLevel`, {n: escalation})}
                        {flipsLeft !== null && ` · ${t(`${NS.MEMO_RISK}.flipsLeftLabel`, {n: flipsLeft})}`}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {superActive ? (
                        <span className="text-micro font-black uppercase tracking-widest px-2 py-1 rounded-full bg-premium-yellow/10 text-premium-yellow border border-premium-yellow/30">
                            {t(`${NS.MEMO_RISK}.superBadge`)}
                        </span>
                    ) : null}
                    <div className="flex items-center gap-1 text-white/40">
                        <Layers className="w-3.5 h-3.5"/>
                        <span className="text-xs font-black tabular-nums">{deckCount}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-micro font-black uppercase tracking-widest text-white/30">
                            {t(`${NS.MEMO_RISK}.turnPointsLabel`)}
                        </p>
                        <p className="text-2xl font-black italic tabular-nums text-premium-pink leading-none">
                            {turnPoints}
                        </p>
                    </div>
                </div>
            </div>

            <MemoBoard
                board={board}
                gridSize={gridSize}
                dangers={round.dangers}
                disabled={outcome !== null}
                onFlip={onFlip}
            />

            {/* Вердикт хода (ход передаётся сам) или кнопка «забрать очки» */}
            <AnimatePresence mode="wait">
                {outcome === null ? (
                    <motion.div
                        key="bank"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                    >
                        <PrimaryButton
                            onClick={onBank}
                            icon={Banknote}
                            variant="emerald"
                            disabled={turnPoints === 0}
                        >
                            {t(`${NS.MEMO_RISK}.bankBtn`, {n: turnPoints})}
                        </PrimaryButton>
                    </motion.div>
                ) : (
                    <motion.div
                        key="verdict"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        className={`px-4 py-4 rounded-premium-md border text-center ${
                            isBusted
                                ? 'border-premium-red/40 bg-premium-red/10'
                                : 'border-premium-green/40 bg-premium-green/10'
                        }`}
                    >
                        <p
                            className={`text-2xl font-black italic uppercase ${
                                isBusted ? 'text-premium-red' : 'text-premium-green'
                            }`}
                        >
                            {t(`${NS.MEMO_RISK}.${VERDICT_KEYS[outcome].title}`, {n: verdictAmount})}
                        </p>
                        <p className="text-sm font-bold text-white/40 mt-1">
                            {t(`${NS.MEMO_RISK}.${VERDICT_KEYS[outcome].desc}`, {n: verdictAmount})}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <StopGameButton onClick={onStopGame}/>
        </div>
    );
};
