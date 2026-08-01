import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { SHAPE_META } from '../constants';
import type { MemoShape, RoundShapes } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { getTheme, rgba } from '@/shared/theme/colors';

const ShapeBadgeRow: React.FC<{ label: string; shapes: MemoShape[]; accent: 'green' | 'red' }> = ({
  label,
  shapes,
  accent,
}) => {
  const tokens = getTheme(accent);
  return (
    <View
      className={`rounded-premium-md flex-1 items-center gap-1.5 border px-3 py-2.5 ${tokens.border30} ${tokens.bg5}`}
    >
      <Text
        className={`text-micro font-black uppercase ${tokens.text}`}
        style={{ letterSpacing: 2.5 }}
      >
        {label}
      </Text>
      <View className="h-6 flex-row items-center gap-2">
        <AnimatePresence>
          {shapes.map((shape) => {
            const ShapeIcon = SHAPE_META[shape].icon;
            const color = SHAPE_META[shape].color;
            return (
              <MotiView
                key={shape}
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <ShapeIcon size={24} color={rgba(color, 1)} fill={rgba(color, 0.3)} />
              </MotiView>
            );
          })}
        </AnimatePresence>
      </View>
    </View>
  );
};

/** Общие для всех игроков целевые и опасные фигуры текущего раунда. */
export const ShapeBadges: React.FC<{ round: RoundShapes }> = ({ round }) => {
  const { t } = useTranslation();
  return (
    <View className="w-full flex-row gap-3">
      <ShapeBadgeRow label={t(`${NS.MEMO_RISK}.findLabel`)} shapes={round.targets} accent="green" />
      <ShapeBadgeRow label={t(`${NS.MEMO_RISK}.avoidLabel`)} shapes={round.dangers} accent="red" />
    </View>
  );
};
