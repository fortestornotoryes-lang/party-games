import type { LucideIcon } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ScrollView, View } from 'react-native';

import type { Player } from '@/entities/player/types';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { ProgressDots } from '@/shared/components/ProgressDots';

type AccentColor = 'green' | 'sky' | 'red' | 'orange' | 'blue' | 'purple' | 'yellow' | 'default';

export interface CardStyleResult {
  className?: string;
  style?: StyleProp<ViewStyle>;
}

interface DistributionFlowProps {
  players: Player[];
  onFinish: () => void;
  /** Содержимое раскрытой карточки роли */
  renderCard: (player: Player, isLast: boolean, onNext: () => void) => React.ReactNode;
  /** Стили контейнера карточки — могут зависеть от игрока */
  getCardStyle?: (player: Player) => CardStyleResult;
  passInstruction?: string;
  passIcon?: LucideIcon;
  passAccentColor?: AccentColor;
  /** Tailwind-класс активной точки ProgressDots, напр. "bg-premium-red" */
  activeColor?: string;
}

/**
 * Пошаговая раздача ролей: PassPhoneCard («передай телефон») → карточка роли.
 * Порт веб-фичи role-distribution; карточка роли рендерится игрой через renderCard.
 */
export const DistributionFlow: React.FC<DistributionFlowProps> = ({
  players,
  onFinish,
  renderCard,
  getCardStyle,
  passInstruction,
  passIcon,
  passAccentColor,
  activeColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLast = currentIndex === players.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentIndex((i) => i + 1);
      setIsRevealed(false);
    }
  };

  const cardMeta = getCardStyle?.(currentPlayer) ?? {};

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <ProgressDots
        count={players.length}
        current={currentIndex}
        activeColor={activeColor}
        className="mb-8"
      />

      {/* Один AnimatePresence с составным key — при переходе к следующему игроку currentIndex
          и isRevealed сбрасываются одним тиком, поэтому вложенные AnimatePresence запускали
          две анимации выхода одновременно на одном и том же элементе */}
      <AnimatePresence exitBeforeEnter>
        {!isRevealed ? (
          <MotiView
            key={`${currentIndex}-locked`}
            from={{ opacity: 0, scale: 0.92, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: 0.92, translateY: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="w-full max-w-sm"
          >
            <PassPhoneCard
              playerName={currentPlayer.name}
              instruction={passInstruction}
              icon={passIcon}
              accentColor={passAccentColor}
              onClick={() => {
                setIsRevealed(true);
              }}
            />
          </MotiView>
        ) : (
          <MotiView
            key={`${currentIndex}-revealed`}
            from={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.92, translateY: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={`rounded-premium-2xl w-full max-w-sm overflow-hidden ${cardMeta.className ?? ''}`}
            style={cardMeta.style}
          >
            {renderCard(currentPlayer, isLast, handleNext)}
          </MotiView>
        )}
      </AnimatePresence>
    </ScrollView>
  );
};
