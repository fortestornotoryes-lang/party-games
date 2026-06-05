import React from 'react';
import { Typography } from './Typography';

interface PlayingHeaderProps {
  /** Имя объясняющего игрока */
  explainer: string;
  /** Оставшееся время в секундах */
  timeLeft: number;
  /** CSS-цвет таймера (hex/rgba — динамический, поэтому не токен Typography) */
  timerColor: string;
  /** Слот для дополнительного контента рядом с таймером (счётчики блиц-режима и т.п.) */
  extra?: React.ReactNode;
}

/**
 * Верхняя строка игрового экрана: «[имя] объясняет» + таймер + опциональный extra-слот.
 * Используется в PlayingPhase игр с раундовым таймером.
 *
 * @example
 * <PlayingHeader
 *   explainer={currentExplainer}
 *   timeLeft={timeLeft}
 *   timerColor={timerColor}
 *   extra={isBlitz && <BlitzCounters guessed={n} skipped={m} />}
 * />
 */
export const PlayingHeader: React.FC<PlayingHeaderProps> = ({
  explainer,
  timeLeft,
  timerColor,
  extra,
}) => (
  <div className="flex items-center justify-between">
    <Typography.Caption color="faint" className="tracking-widest">
      {explainer} объясняет
    </Typography.Caption>

    <div className="flex items-center gap-3">
      {extra}
      {/* timerColor — динамический hex, не токен; используем span напрямую */}
      <span className="text-2xl font-black italic tabular-nums" style={{ color: timerColor }}>
        {timeLeft}с
      </span>
    </div>
  </div>
);
