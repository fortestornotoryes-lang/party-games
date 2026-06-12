import {useCallback, useEffect, useMemo} from 'react';

import {
    INITIAL_ESCALATION,
    MEMO_RISK_DIFFICULTY_CONFIG,
    SUPER_MULTIPLIER,
    TURN_END_DELAY_MS,
} from '../constants';
import {
    canStartRound,
    cardPoints,
    createGame,
    endOfTurnCleanup,
    isRoundValid,
    pickRoundShapes,
} from '../helpers';
import {
    MEMO_RISK_MODES,
    MemoCardState,
    MemoRiskPhase,
    TurnOutcome,
    type CardsState,
    type RoundShapes,
} from '../types';

import {useGameSettings} from '@/contexts/GameSettingsContext';
import {usePersistedState, usePersistedTimer} from '@/shared/hooks/usePersistedState';
import {usePlayerCycle} from '@/shared/hooks/usePlayerCycle';
import {useTimer} from '@/shared/hooks/useTimer';
import {feedbackService, VIBRATE} from '@/shared/services/feedbackService';
import {GameKey} from '@/types/games';

const K = GameKey.MemoRisk;

export const useMemoRiskGameLogic = (playerNames: string[], onBack: () => void) => {
    const {difficulty, mode} = useGameSettings();
    const cfg = MEMO_RISK_DIFFICULTY_CONFIG[difficulty];
    const isTimed = mode === MEMO_RISK_MODES.TIMED;
    const isLimited = mode === MEMO_RISK_MODES.LIMITED;

    // --- State ---
    const [phase, setPhase] = usePersistedState<MemoRiskPhase>(K, 'phase', MemoRiskPhase.Playing, {
        save: (v) => v,
        load: (raw) => (raw === MemoRiskPhase.GameOver ? MemoRiskPhase.GameOver : MemoRiskPhase.Playing),
    });
    const [cards, setCards] = usePersistedState<CardsState>(K, 'cards', () => createGame(cfg));
    const [scores, setScores] = usePersistedState<Record<string, number>>(K, 'scores', () =>
        Object.fromEntries(playerNames.map((n) => [n, 0]))
    );
    const playerIdxState = usePersistedState(K, 'playerIdx', 0);
    const {current: currentPlayer, next: nextPlayer, reset: resetPlayers} = usePlayerCycle(
        playerNames,
        playerIdxState
    );

    const [turn, setTurn] = usePersistedState(K, 'turn', () => ({
        points: 0,
        superActive: false,
        flipsLeft: isLimited ? cfg.flipLimit : null,
        outcome: null as TurnOutcome | null,
    }));

    const [escalation, setEscalation] = usePersistedState(K, 'escalation', INITIAL_ESCALATION);
    const [round, setRound] = usePersistedState<RoundShapes | null>(K, 'round', () =>
        pickRoundShapes(cards.board, INITIAL_ESCALATION)
    );

    // --- Derived ---
    const gridSize = useMemo(() => Math.round(Math.sqrt(cards.board.length)), [cards.board.length]);
    const {points: turnPoints, superActive, flipsLeft, outcome} = turn;
    const gainedPoints = turnPoints * (superActive ? SUPER_MULTIPLIER : 1);

    // --- Actions ---
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
            setTurn((t) => ({...t, outcome: result}));
        },
        [currentPlayer, setEscalation, setScores, setTurn]
    );

    const handleTimeUp = useCallback(() => {
        if (turn.outcome !== null) return;
        feedbackService.vibrate(VIBRATE.timeout);
        feedbackService.playSound('timeout');
        endTurn(TurnOutcome.Timeout, turn.points, turn.superActive);
    }, [turn.outcome, turn.points, turn.superActive, endTurn]);

    const timer = useTimer({initialTime: cfg.turnSeconds, onTimeUp: handleTimeUp});
    usePersistedTimer(
        K,
        'timeLeft',
        timer,
        isTimed && phase === MemoRiskPhase.Playing && turn.outcome === null
    );

    const {pause: pauseTimer, reset: resetTimer, start: startTimer} = timer;

    useEffect(() => {
        if (phase !== MemoRiskPhase.Playing || turn.outcome !== null) pauseTimer();
    }, [phase, turn.outcome, pauseTimer]);

    const handleNextTurn = useCallback(() => {
        const isBusted = turn.outcome === TurnOutcome.Busted;

        // Reset collected cards back to revealed if busted
        const cardsToClean = isBusted
            ? {
                  ...cards,
                  board: cards.board.map((c) =>
                      c?.state === MemoCardState.Collected ? {...c, state: MemoCardState.Revealed} : c
                  ),
              }
            : cards;

        const tookTarget =
            !isBusted &&
            !!round &&
            cards.board.some((c) => c?.state === MemoCardState.Collected && round.targets.includes(c.shape));

        const cleaned = endOfTurnCleanup(cardsToClean);
        setCards(cleaned);

        if (!canStartRound(cleaned.board)) {
            feedbackService.vibrate(VIBRATE.win);
            feedbackService.playSound('win');
            setPhase(MemoRiskPhase.GameOver);
            return;
        }

        const roundBroken = !round || !isRoundValid(round, cleaned.board);
        if (tookTarget || isBusted || roundBroken) {
            const nextEscalation = tookTarget ? INITIAL_ESCALATION : escalation;
            setRound(pickRoundShapes(cleaned.board, nextEscalation, tookTarget ? null : round));
            if (tookTarget) setEscalation(INITIAL_ESCALATION);
        }

        nextPlayer();
        setTurn({
            points: 0,
            superActive: false,
            flipsLeft: isLimited ? cfg.flipLimit : null,
            outcome: null,
        });

        if (isTimed) {
            resetTimer(cfg.turnSeconds);
            startTimer();
        }
    }, [
        cards,
        round,
        turn.outcome,
        escalation,
        isLimited,
        isTimed,
        cfg,
        nextPlayer,
        resetTimer,
        startTimer,
        setCards,
        setPhase,
        setRound,
        setTurn,
    ]);

    useEffect(() => {
        if (turn.outcome === null || phase !== MemoRiskPhase.Playing) return;
        const id = setTimeout(handleNextTurn, TURN_END_DELAY_MS);
        return () => { clearTimeout(id); };
    }, [turn.outcome, phase, handleNextTurn]);

    const flipCard = useCallback((slot: number) => {
        if (phase !== MemoRiskPhase.Playing || turn.outcome !== null || !round) return;
        const card = cards.board[slot];
        if (card?.state !== MemoCardState.Hidden) return;

        const {targets, dangers} = round;

        const updateBoard = (newState: MemoCardState) => {
            setCards((cs) => ({
                ...cs,
                board: cs.board.map((c, i) => (i === slot && c ? {...c, state: newState} : c)),
            }));
        };

        let nextPoints = turn.points;
        let nextSuper = turn.superActive;
        let isTurnOver = false;

        if (card.isSuper || targets.includes(card.shape)) {
            nextPoints = card.isSuper ? turn.points : turn.points + cardPoints(card);
            nextSuper = turn.superActive || card.isSuper;

            updateBoard(MemoCardState.Collected);
            feedbackService.vibrate(card.isSuper ? VIBRATE.celebrate : VIBRATE.correct);
            feedbackService.playSound('success');
        } else {
            updateBoard(MemoCardState.Revealed);
            if (dangers.includes(card.shape)) {
                feedbackService.vibrate(VIBRATE.error);
                feedbackService.playSound('error');
                endTurn(TurnOutcome.Busted, 0, false);
                isTurnOver = true;
            } else {
                feedbackService.vibrate(VIBRATE.tap);
            }
        }

        if (!isTurnOver) {
            const nextFlips = isLimited ? (turn.flipsLeft ?? cfg.flipLimit) - 1 : null;
            const isOutOfFlips = isLimited && nextFlips !== null && nextFlips <= 0;

            setTurn((t) => ({
                ...t,
                points: nextPoints,
                superActive: nextSuper,
                flipsLeft: nextFlips,
                outcome: isOutOfFlips ? TurnOutcome.OutOfFlips : t.outcome,
            }));

            if (isOutOfFlips) {
                endTurn(TurnOutcome.OutOfFlips, nextPoints, nextSuper);
            }
        }
    }, [phase, turn, round, cards.board, isLimited, cfg.flipLimit, setCards, setTurn, endTurn]);

    const handleBank = useCallback(() => {
        if (phase !== MemoRiskPhase.Playing || turn.outcome !== null) return;
        feedbackService.vibrate(VIBRATE.correct);
        endTurn(TurnOutcome.Banked, turn.points, turn.superActive);
    }, [phase, turn.outcome, turn.points, turn.superActive, endTurn]);

    const handleRestart = useCallback(() => {
        const fresh = createGame(cfg);
        setCards(fresh);
        setRound(pickRoundShapes(fresh.board, INITIAL_ESCALATION));
        setScores(Object.fromEntries(playerNames.map((n) => [n, 0])));
        setTurn({
            points: 0,
            superActive: false,
            flipsLeft: isLimited ? cfg.flipLimit : null,
            outcome: null,
        });
        setEscalation(INITIAL_ESCALATION);
        resetPlayers();
        setPhase(MemoRiskPhase.Playing);
        if (isTimed) {
            resetTimer(cfg.turnSeconds);
            startTimer();
        }
    }, [cfg, playerNames, isLimited, isTimed, resetPlayers, resetTimer, startTimer, setCards, setRound, setScores, setTurn, setEscalation, setPhase]);

    return {
        phase,
        cards,
        gridSize,
        round,
        currentPlayer,
        scores,
        turnPoints,
        gainedPoints,
        superActive,
        outcome,
        flipsLeft: isLimited ? flipsLeft : null,
        timer: isTimed ? {timeLeft: timer.timeLeft, totalSeconds: cfg.turnSeconds} : null,
        escalation,
        flipCard,
        handleBank,
        handleRestart,
        stopGame: () => { setPhase(MemoRiskPhase.GameOver); },
    };
};
