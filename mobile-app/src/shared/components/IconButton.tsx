import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

import { GlassCard } from '@/shared/components/GlassCard';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

type IconButtonVariant = 'ghost' | 'filled' | 'danger';

const ICON_COLOR: Record<IconButtonVariant, string> = {
  ghost: 'rgba(255,255,255,0.8)',
  filled: '#000',
  danger: rgba('red', 1),
};

export const IconButton: React.FC<{
  onClick: () => void;
  icon: LucideIcon;
  className?: string;
  variant?: IconButtonVariant;
}> = ({ onClick, icon: Icon, className, variant = 'filled' }) => {
  const handlePress = () => {
    feedbackService.playSound('click');
    feedbackService.vibrate(VIBRATE.tap);
    onClick();
  };

  const icon = <Icon size={20} color={ICON_COLOR[variant]} />;

  return (
    <Pressable
      onPress={handlePress}
      className={className}
      style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
    >
      {variant === 'ghost' ? (
        <GlassCard className="rounded-premium-sm items-center justify-center border-0 p-4">
          {icon}
        </GlassCard>
      ) : variant === 'filled' ? (
        <View className="rounded-premium-sm items-center justify-center bg-white p-4">{icon}</View>
      ) : (
        <View className="rounded-premium-sm border-premium-red/20 bg-premium-red/10 items-center justify-center border p-4">
          {icon}
        </View>
      )}
    </Pressable>
  );
};
