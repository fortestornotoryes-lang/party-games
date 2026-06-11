import {Shapes} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React, {useCallback, useEffect} from 'react';

import {GameOverPhase} from './components/GameOverPhase';
import {PassPhase} from './components/PassPhase';
import {PlayingPhase} from './components/PlayingPhase';
import {
    BUSTED_PASS_DELAY_MS,
    INITIAL_ESCALATION,
    MEMO_RISK_DIFFICULTY_CONFIG,
    SUPER_MULTIPLIER,
} from './constants';
import {
    canStartRound,
    cardPoints,
    createGame,
    endOfTurnCleanup,
    isRoundValid,
    pickRoundShapes,
} from './helpers';
import {
    MEMO_RISK_MODES,
    MemoCardState,
    MemoRiskPhase,
    TurnOutcome,
    type CardsState,
    type RoundShapes,
} from './types';

import {GameHeader} from '@/components/GameHeader';
import {useGameSettings} from '@/contexts/GameSettingsContext';
import {usePersistedState, usePersistedTimer} from '@/hooks/usePersistedState';
import {usePlayerCycle} from '@/hooks/usePlayerCycle';
import {useTimer} from '@/hooks/useTimer';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {feedbackService, VIBRATE} from '@/services/feedbackService';
import {GameKey} from '@/types/games';

interface Props {
    playerNames: string[];
    onBack: () => void;
}

const K = GameKey.MemoRisk;

export const MemoRiskGame: React.FC<Props> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const {difficulty, mode} = useGameSettings();
    const cfg = MEMO_RISK_DIFFICULTY_CONFIG[difficulty];
    const isTimed = mode === MEMO_RISK_MODES.TIMED;
    const isLimited = mode === MEMO_RISK_MODES.LIMITED;

    const [phase, setPhase] = usePersistedState<MemoRiskPhase>(K, 'phase', MemoRiskPhase.Pass);
    const [cards, setCards] = usePersistedState<CardsState>(K, 'cards', () => createGame(cfg));
    const [scores, setScores] = usePersistedState<Record<string, number>>(K, 'scores', () =>
        Object.fromEntries(playerNames.map((n) => [n, 0]))
    );
    const playerIdxState = usePersistedState(K, 'playerIdx', 0);
    const {current: currentPlayer, next: nextPlayer, reset: resetPlayers} = usePlayerCycle(
        playerNames,
        playerIdxState
    );
    const [turnPoints, setTurnPoints] = usePersistedState(K, 'turnPoints', 0);
    const [escalation, setEscalation] = usePersistedState(K, 'escalation', INITIAL_ESCALATION);
    // Фигуры раунда общие для всех игроков; меняются только после забора карт,
    // провала (вырос уровень риска) или когда фигура полностью выбыла с поля
    const [round, setRound] = usePersistedState<RoundShapes | null>(K, 'round', () =>
        pickRoundShapes(cards.board, INITIAL_ESCALATION)
    );
    const [flipsLeft, setFlipsLeft] = usePersistedState<number | null>(K, 'flipsLeft', null);
    const [superActive, setSuperActive] = usePersistedState(K, 'superActive', false);
    const [outcome, setOutcome] = usePersistedState<TurnOutcome | null>(K, 'outcome', null);

    // Поле могло быть собрано на другой сложности — размер берём из него самого
    const gridSize = Math.round(Math.sqrt(cards.board.length));

    const endTurn = useCallback(
        (result: TurnOutcome, points: number, doubled: boolean) => {
            if (result === TurnOutcome.Busted) {
                setEscalation((e) => e + 1);
            } else {
                const gained = points * (doubled ? SUPER_MULTIPLIER : 1);
                if (gained > 0) {
                    setScores((s) => ({...s, [currentPlayer]: (s[currentPlayer] ?? 0) + gained}));
                }
            }
            setOutcome(result);
        },
        [currentPlayer, setEscalation, setScores, setOutcome]
    );

    const handleTimeUp = useCallback(() => {
        if (outcome !== null) return;
        feedbackService.vibrate(VIBRATE.timeout);
        feedbackService.playSound('timeout');
        endTurn(TurnOutcome.Timeout, turnPoints, superActive);
    }, [outcome, turnPoints, superActive, endTurn]);

    const timer = useTimer({initialTime: cfg.turnSeconds, onTimeUp: handleTimeUp});
    usePersistedTimer(
        K,
        'timeLeft',
        timer,
        isTimed && phase === MemoRiskPhase.Playing && outcome === null
    );

    const {pause: pauseTimer} = timer;
    useEffect(() => {
        if (phase !== MemoRiskPhase.Playing || outcome !== null) pauseTimer();
    }, [phase, outcome, pauseTimer]);

    const startTurn = () => {
        // Фигуры раунда общие — пере-разыгрываем только если текущих нет
        // или какая-то из них уже выбыла с поля
        if (!round || !isRoundValid(round, cards.board)) {
            const fresh = pickRoundShapes(cards.board, escalation);
            if (!fresh) {
                setPhase(MemoRiskPhase.GameOver);
                return;
            }
            setRound(fresh);
        }
        setTurnPoints(0);
        setSuperActive(false);
        setOutcome(null);
        setFlipsLeft(isLimited ? cfg.flipLimit : null);
        setPhase(MemoRiskPhase.Playing);
        feedbackService.playSound('start');
        if (isTimed) {
            timer.reset(cfg.turnSeconds);
            timer.start();
        }
    };

    /** В режиме «Ограниченные ходы» каждое открытие тратит попытку */
    const consumeFlip = (pointsNow: number, superNow: boolean) => {
        if (!isLimited) return;
        const left = (flipsLeft ?? cfg.flipLimit) - 1;
        setFlipsLeft(left);
        if (left <= 0) endTurn(TurnOutcome.OutOfFlips, pointsNow, superNow);
    };

    const flipCard = (slot: number) => {
        if (phase !== MemoRiskPhase.Playing || outcome !== null || !round) return;
        const card = cards.board[slot];
        if (card?.state !== MemoCardState.Hidden) return;
        const {targets, dangers} = round;

        const setSlotState = (state: MemoCardState) => {
            setCards((cs) => ({
                ...cs,
                board: cs.board.map((c, i) => (i === slot && c ? {...c, state} : c)),
            }));
        };

        if (card.isSuper || targets.includes(card.shape)) {
            // Целевая фигура или супер-карта: забираем с поля, ход продолжается
            const newPoints = card.isSuper ? turnPoints : turnPoints + cardPoints(card);
            const newSuper = superActive || card.isSuper;
            setSlotState(MemoCardState.Collected);
            setTurnPoints(newPoints);
            setSuperActive(newSuper);
            feedbackService.vibrate(card.isSuper ? VIBRATE.celebrate : VIBRATE.correct);
            feedbackService.playSound('success');
            consumeFlip(newPoints, newSuper);
            return;
        }

        // Нейтральная или опасная: остаётся открытой до конца хода
        setSlotState(MemoCardState.Revealed);
        if (dangers.includes(card.shape)) {
            feedbackService.vibrate(VIBRATE.error);
            feedbackService.playSound('error');
            endTurn(TurnOutcome.Busted, 0, false);
        } else {
            // Нейтральная: очков не даёт, но ход продолжается
            feedbackService.vibrate(VIBRATE.tap);
            consumeFlip(turnPoints, superActive);
        }
    };

    const handleBank = () => {
        if (phase !== MemoRiskPhase.Playing || outcome !== null) return;
        feedbackService.vibrate(VIBRATE.correct);
        endTurn(TurnOutcome.Banked, turnPoints, superActive);
    };

    const handleNextTurn = useCallback(() => {
        // Игрок забрал карты в этом ходу — фигуры раунда меняются
        const tookCards = cards.board.some((c) => c?.state === MemoCardState.Collected);
        const cleaned = endOfTurnCleanup(cards);
        setCards(cleaned);
        if (!canStartRound(cleaned.board)) {
            feedbackService.vibrate(VIBRATE.win);
            feedbackService.playSound('win');
            setPhase(MemoRiskPhase.GameOver);
            return;
        }
        const escalated = outcome === TurnOutcome.Busted;
        const roundBroken = !round || !isRoundValid(round, cleaned.board);
        if (tookCards || escalated || roundBroken) {
            setRound(pickRoundShapes(cleaned.board, escalation));
        }
        nextPlayer();
        setPhase(MemoRiskPhase.Pass);
    }, [cards, round, outcome, escalation, nextPlayer, setCards, setRound, setPhase]);

    // Провал передаёт ход автоматически — игрок успевает увидеть опасную карту
    useEffect(() => {
        if (outcome !== TurnOutcome.Busted || phase !== MemoRiskPhase.Playing) return;
        const id = setTimeout(handleNextTurn, BUSTED_PASS_DELAY_MS);
        return () => {
            clearTimeout(id);
        };
    }, [outcome, phase, handleNextTurn]);

    const handleRestart = () => {
        const fresh = createGame(cfg);
        setCards(fresh);
        setRound(pickRoundShapes(fresh.board, INITIAL_ESCALATION));
        setScores(Object.fromEntries(playerNames.map((n) => [n, 0])));
        setTurnPoints(0);
        setEscalation(INITIAL_ESCALATION);
        setSuperActive(false);
        setOutcome(null);
        setFlipsLeft(null);
        resetPlayers();
        setPhase(MemoRiskPhase.Pass);
    };

    const gainedPoints = turnPoints * (superActive ? SUPER_MULTIPLIER : 1);

    return (
        <div className="flex flex-col relative" style={{minHeight: '100dvh'}}>
            <GameHeader
                title={t(`${NS.MEMO_RISK}.title`)}
                subtitle={t(`${NS.MEMO_RISK}.subtitle`)}
                icon={Shapes}
                theme="pink"
                onBack={onBack}
            />

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
                <AnimatePresence mode="wait">
                    {phase === MemoRiskPhase.Pass && (
                        <motion.div
                            key="pass"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                        >
                            <PassPhase
                                currentPlayer={currentPlayer}
                                playerNames={playerNames}
                                scores={scores}
                                escalation={escalation}
                                deckCount={cards.deck.length}
                                round={round}
                                onStartTurn={startTurn}
                                onStopGame={() => {
                                    setPhase(MemoRiskPhase.GameOver);
                                }}
                            />
                        </motion.div>
                    )}

                    {phase === MemoRiskPhase.Playing && !!round && (
                        <motion.div
                            key="playing"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                        >
                            <PlayingPhase
                                board={cards.board}
                                gridSize={gridSize}
                                round={round}
                                currentPlayer={currentPlayer}
                                turnPoints={turnPoints}
                                gainedPoints={gainedPoints}
                                superActive={superActive}
                                outcome={outcome}
                                flipsLeft={isLimited ? flipsLeft : null}
                                deckCount={cards.deck.length}
                                timer={isTimed ? {timeLeft: timer.timeLeft, totalSeconds: cfg.turnSeconds} : null}
                                escalation={escalation}
                                onFlip={flipCard}
                                onBank={handleBank}
                                onNextTurn={handleNextTurn}
                            />
                        </motion.div>
                    )}

                    {phase === MemoRiskPhase.GameOver && (
                        <motion.div
                            key="game_over"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                        >
                            <GameOverPhase
                                playerNames={playerNames}
                                scores={scores}
                                onRestart={handleRestart}
                                onBack={onBack}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
