import { Zap } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { RARITY_META, SHAPE_META } from '../constants';
import { MemoCardState, type MemoCard } from '../types';

import { rgba } from '@/shared/theme/colors';

interface MemoCardViewProps {
  card: MemoCard;
  /** Позиция на поле — передаётся в onFlip */
  slot: number;
  /** Открытая в этом ходу опасная фигура — красная подсветка */
  isDangerRevealed: boolean;
  disabled: boolean;
  onFlip: (slot: number) => void;
}

export const MemoCardView: React.FC<MemoCardViewProps> = ({
  card,
  slot,
  isDangerRevealed,
  disabled,
  onFlip,
}) => {
  const faceUp = card.state !== MemoCardState.Hidden;
  const meta = SHAPE_META[card.shape];
  const ShapeIcon = meta.icon;
  const rarity = RARITY_META[card.rarity];
  const shapeColor = rgba(meta.color, 1);

  const glow = isDangerRevealed
    ? rgba('red', 0.55)
    : card.isSuper
      ? rgba('yellow', 0.4)
      : rarity.glowColor
        ? rgba(rarity.glowColor, 0.35)
        : null;

  return (
    <Pressable
      onPress={() => {
        onFlip(slot);
      }}
      disabled={disabled || faceUp}
      style={{ aspectRatio: 1 }}
    >
      {/* 3D-флип: rotateY + backfaceVisibility, как в вебе. perspective обязателен на Android — без него rotateY не даёт 3D-эффекта и обратная грань не скрывается */}
      <MotiView
        className="absolute inset-0"
        animate={{ rotateY: faceUp ? '180deg' : '0deg', perspective: 1000 }}
        transition={{ type: 'timing', duration: 350 }}
      >
        {/* Рубашка */}
        <View
          className="rounded-premium-sm border-premium-pink/15 absolute inset-0 items-center justify-center border bg-white/5"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Text className="text-lg font-black text-white/15">?</Text>
        </View>

        {/* Лицо: рамка и ценность — по редкости */}
        <View
          className={`rounded-premium-sm absolute inset-0 items-center justify-center gap-0.5 border-2 ${
            card.isSuper
              ? 'border-premium-yellow/80 bg-premium-yellow/10'
              : `${rarity.border} bg-white/5`
          }`}
          style={[
            { backfaceVisibility: 'hidden', transform: [{ rotateY: '180deg' }] },
            glow
              ? {
                  shadowColor: glow,
                  shadowOpacity: 1,
                  shadowRadius: 9,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 6,
                }
              : undefined,
          ]}
        >
          {card.isSuper ? (
            <>
              <Zap size={32} color={rgba('yellow', 1)} fill={rgba('yellow', 0.3)} />
              <Text className="text-label text-premium-yellow font-black">×2</Text>
            </>
          ) : (
            <>
              <ShapeIcon size={32} color={shapeColor} fill={rgba(meta.color, 0.25)} />
              <Text
                className={`font-black ${rarity.text}`}
                style={{ fontVariant: ['tabular-nums'] }}
              >
                +{rarity.points}
              </Text>
            </>
          )}
        </View>
      </MotiView>
    </Pressable>
  );
};
