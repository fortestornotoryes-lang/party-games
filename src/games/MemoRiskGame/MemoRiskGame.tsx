import {Shapes} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React, {useCallback, useEffect} from 'react';

import {GameOverPhase} from './components/GameOverPhase';
import {PlayingPhase} from './components/PlayingPhase';
import {
    INITIAL_ESCALATION,
    MEMO_RISK_DIFFICULTY_CONFIG,
    SUPER_MULTIPLIER,
    TURN_END_DELAY_MS,
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

    const [phase, setPhase] = usePersistedState<MemoRiskPhase>(K, 'phase', MemoRiskPhase.Playing, {
        save: (v) => v,
        // Легаси-сессии могли сохранить удалённую фазу 'pass' — нормализуем
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
    const [turnPoints, setTurnPoints] = usePersistedState(K, 'turnPoints', 0);
    const [escalation, setEscalation] = usePersistedState(K, 'escalation', INITIAL_ESCALATION);
    // Фигуры раунда общие для всех игроков; меняются только после забора карт,
    // провала (вырос уровень риска) или когда фигура полностью выбыла с поля
    const [round, setRound] = usePersistedState<RoundShapes | null>(K, 'round', () =>
        pickRoundShapes(cards.board, INITIAL_ESCALATION)
    );
// round?.targets
// round?.dangers
    const [flipsLeft, setFlipsLeft] = usePersistedState<number | null>(K, 'flipsLeft', () =>
        isLimited ? cfg.flipLimit : null
    );
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
    // Первый ход стартует сразу при маунте — usePersistedTimer запускает отсчёт сам
    usePersistedTimer(
        K,
        'timeLeft',
        timer,
        isTimed && phase === MemoRiskPhase.Playing && outcome === null
    );

    const {pause: pauseTimer, reset: resetTimer, start: startTimer} = timer;
    useEffect(() => {
        if (phase !== MemoRiskPhase.Playing || outcome !== null) pauseTimer();
    }, [phase, outcome, pauseTimer]);

    /** Завершить ход: убрать открытые карты, добрать из колоды, передать ход следующему */
    const handleNextTurn = useCallback(() => {
        const isBusted = outcome === TurnOutcome.Busted;

        // Если игрок проиграл (Busted), забранные карты не считаются "взятыми" (за них не дали очков),
        // поэтому они должны вернуться на поле, а не заменяться из колоды.
        const cardsToClean = isBusted
            ? {
                  ...cards,
                  board: cards.board.map((c) =>
                      c?.state === MemoCardState.Collected ? {...c, state: MemoCardState.Revealed} : c
                  ),
              }
            : cards;

        // Игрок забрал целевые карты в этом ходу — фигуры раунда меняются.
        // При провале (Busted) забор не засчитывается.
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
            // Если игрок успешно забрал цели, уровень риска для следующего раунда сбрасывается.
            // Иначе (если раунд просто перестал быть валидным или игрок проиграл) — сохраняем текущий уровень.
            // При Busted уровень уже увеличен в endTurn.
            const nextEscalation = tookTarget ? INITIAL_ESCALATION : escalation;
            setRound(pickRoundShapes(cleaned.board, nextEscalation, tookTarget ? null : round));
            if (tookTarget) setEscalation(INITIAL_ESCALATION);
        }
        // Следующий ход начинается сразу — меняется только игрок и его счёт
        nextPlayer();
        setTurnPoints(0);
        setSuperActive(false);
        setOutcome(null);
        setFlipsLeft(isLimited ? cfg.flipLimit : null);
        if (isTimed) {
            resetTimer(cfg.turnSeconds);
            startTimer();
        }
    }, [
        cards,
        round,
        outcome,
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
        setTurnPoints,
        setSuperActive,
        setOutcome,
        setFlipsLeft,
    ]);

    // Любой исход хода передаёт его автоматически — игроки успевают увидеть вердикт
    useEffect(() => {
        if (outcome === null || phase !== MemoRiskPhase.Playing) return;
        const id = setTimeout(handleNextTurn, TURN_END_DELAY_MS);
        return () => {
            clearTimeout(id);
        };
    }, [outcome, phase, handleNextTurn]);

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

    const handleRestart = () => {
        const fresh = createGame(cfg);
        setCards(fresh);
        setRound(pickRoundShapes(fresh.board, INITIAL_ESCALATION));
        setScores(Object.fromEntries(playerNames.map((n) => [n, 0])));
        setTurnPoints(0);
        setEscalation(INITIAL_ESCALATION);
        setSuperActive(false);
        setOutcome(null);
        setFlipsLeft(isLimited ? cfg.flipLimit : null);
        resetPlayers();
        setPhase(MemoRiskPhase.Playing);
        if (isTimed) {
            resetTimer(cfg.turnSeconds);
            startTimer();
        }
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
                                totalScore={scores[currentPlayer] ?? 0}
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
                                onStopGame={() => {
                                    setPhase(MemoRiskPhase.GameOver);
                                }}
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
