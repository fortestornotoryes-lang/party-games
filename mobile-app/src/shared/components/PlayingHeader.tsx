import React from 'react';
import { Text, View } from 'react-native';

import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';

interface PlayingHeaderProps {
  /** Имя объясняющего игрока */
  explainer: string;
  /** Оставшееся время в секундах */
  timeLeft: number;
  /** Цвет таймера (hex/rgba — динамический, поэтому не токен Typography) */
  timerColor: string;
  /** Слот для дополнительного контента рядом с таймером (счётчики блиц-режима и т.п.) */
  extra?: React.ReactNode;
}

/**
 * Верхняя строка игрового экрана: «[имя] объясняет» + таймер + опциональный extra-слот.
 * Используется в PlayingPhase игр с раундовым таймером.
 */
export const PlayingHeader: React.FC<PlayingHeaderProps> = ({
  explainer,
  timeLeft,
  timerColor,
  extra,
}) => {
  const { t } = useTranslation();
  return (
    <View className="flex-row items-center justify-between">
      <Typography.Caption color="faint" style={{ letterSpacing: 1.2 }}>
        {t('common.explains', { player: explainer })}
      </Typography.Caption>

      <View className="flex-row items-center gap-3">
        {extra}
        <Text
          className="text-2xl font-black italic"
          style={{ color: timerColor, fontVariant: ['tabular-nums'] }}
        >
          {t('common.secondsShort', { n: timeLeft })}
        </Text>
      </View>
    </View>
  );
};
