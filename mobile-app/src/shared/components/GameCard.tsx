import React from 'react';
import { Pressable } from 'react-native';

import { GlassCard } from '@/shared/components/GlassCard';
import { SectionLabel } from '@/shared/components/SectionLabel';

export const GameCard: React.FC<{
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}> = ({ children, title, className, onClick }) => {
  const card = (
    <GlassCard className={`rounded-premium-lg border-white/5 p-7 ${className ?? ''}`}>
      {!!title && <SectionLabel className="mb-6">{title}</SectionLabel>}
      {children}
    </GlassCard>
  );

  if (!onClick) return card;
  return (
    <Pressable
      onPress={onClick}
      style={({ pressed }) => (pressed ? { transform: [{ scale: 0.98 }] } : undefined)}
    >
      {card}
    </Pressable>
  );
};
