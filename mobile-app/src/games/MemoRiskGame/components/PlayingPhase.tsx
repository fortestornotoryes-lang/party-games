import { Banknote, Layers } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { TurnOutcome, type MemoCard, type RoundShapes } from '../types';

import { MemoBoard } from './MemoBoard';
import { ShapeBadges } from './ShapeBadges';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { StopGameButton } from '@/shared/components/StopGameButton';
import { TimerBar } from '@/shared/components/TimerBar';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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
  timer: { timeLeft: number; totalSeconds: number } | null;
  escalation: number;
  onFlip: (slot: number) => void;
  onBank: () => void;
  onStopGame: () => void;
}

const VERDICT_KEYS: Record<TurnOutcome, { title: string; desc: string }> = {
  [TurnOutcome.Banked]: { title: 'bankedTitle', desc: 'bankedDesc' },
  [TurnOutcome.Busted]: { title: 'bustedTitle', desc: 'bustedDesc' },
  [TurnOutcome.Timeout]: { title: 'timeoutTitle', desc: 'timeoutDesc' },
  [TurnOutcome.OutOfFlips]: { title: 'outOfFlipsTitle', desc: 'outOfFlipsDesc' },
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
  const { t } = useTranslation();

  const timerPct = timer ? (timer.timeLeft / timer.totalSeconds) * 100 : 0;
  const timerColor = timerPct > 50 ? '#00d88a' : timerPct > 25 ? '#ffcc1f' : '#ff2e4d';
  const isBusted = outcome === TurnOutcome.Busted;
  const verdictAmount = isBusted ? turnPoints : gainedPoints;

  return (
    <View className="mx-auto w-full max-w-md gap-4">
      {timer ? <TimerBar pct={timerPct} color={timerColor} /> : null}

      {/* Цели и опасности раунда — общие для всех */}
      <ShapeBadges round={round} />

      {/* Текущий игрок и его счёт — меняются при передаче хода */}
      <View className="rounded-premium-md flex-row items-center justify-between border border-white/10 bg-white/5 px-4 py-3">
        <View className="min-w-0 flex-1">
          <AnimatePresence exitBeforeEnter>
            <MotiView
              key={currentPlayer}
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -8 }}
              transition={{ type: 'timing', duration: 200 }}
            >
              <Text numberOfLines={1} className="font-black text-white/90">
                {currentPlayer}{' '}
                <Text className="text-premium-pink" style={{ fontVariant: ['tabular-nums'] }}>
                  {totalScore}
                </Text>
              </Text>
            </MotiView>
          </AnimatePresence>
          <Text
            className="text-micro font-black uppercase text-white/30"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.MEMO_RISK}.riskLevel`, { n: escalation })}
            {flipsLeft !== null && ` · ${t(`${NS.MEMO_RISK}.flipsLeftLabel`, { n: flipsLeft })}`}
          </Text>
        </View>
        <View className="shrink-0 flex-row items-center gap-3">
          {superActive ? (
            <View className="bg-premium-yellow/10 border-premium-yellow/30 rounded-full border px-2 py-1">
              <Text
                className="text-micro text-premium-yellow font-black uppercase"
                style={{ letterSpacing: 2 }}
              >
                {t(`${NS.MEMO_RISK}.superBadge`)}
              </Text>
            </View>
          ) : null}
          <View className="flex-row items-center gap-1">
            <Layers size={14} color="rgba(255,255,255,0.4)" />
            <Text
              className="text-xs font-black text-white/40"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {deckCount}
            </Text>
          </View>
          <View className="items-end">
            <Text
              className="text-micro font-black uppercase text-white/30"
              style={{ letterSpacing: 2 }}
            >
              {t(`${NS.MEMO_RISK}.turnPointsLabel`)}
            </Text>
            <Text
              className="text-premium-pink text-2xl font-black italic"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {turnPoints}
            </Text>
          </View>
        </View>
      </View>

      <MemoBoard
        board={board}
        gridSize={gridSize}
        dangers={round.dangers}
        disabled={outcome !== null}
        onFlip={onFlip}
      />

      {/* Вердикт хода (ход передаётся сам) или кнопка «забрать очки» */}
      <AnimatePresence exitBeforeEnter>
        {outcome === null ? (
          <MotiView
            key="bank"
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: 'timing', duration: 200 }}
          >
            <PrimaryButton
              onClick={onBank}
              icon={Banknote}
              variant="emerald"
              disabled={turnPoints === 0}
            >
              {t(`${NS.MEMO_RISK}.bankBtn`, { n: turnPoints })}
            </PrimaryButton>
          </MotiView>
        ) : (
          <MotiView
            key="verdict"
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: 'timing', duration: 200 }}
            className={`rounded-premium-md items-center border px-4 py-4 ${
              isBusted
                ? 'border-premium-red/40 bg-premium-red/10'
                : 'border-premium-green/40 bg-premium-green/10'
            }`}
          >
            <Text
              className={`text-center text-2xl font-black uppercase italic ${
                isBusted ? 'text-premium-red' : 'text-premium-green'
              }`}
            >
              {t(`${NS.MEMO_RISK}.${VERDICT_KEYS[outcome].title}`, { n: verdictAmount })}
            </Text>
            <Text className="mt-1 text-center text-sm font-bold text-white/40">
              {t(`${NS.MEMO_RISK}.${VERDICT_KEYS[outcome].desc}`, { n: verdictAmount })}
            </Text>
          </MotiView>
        )}
      </AnimatePresence>

      <StopGameButton onClick={onStopGame} />
    </View>
  );
};
