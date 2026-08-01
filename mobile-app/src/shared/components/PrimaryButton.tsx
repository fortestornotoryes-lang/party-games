import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { GlassCard } from '@/shared/components/GlassCard';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

export type ButtonVariant =
  | 'white'
  | 'premium'
  | 'red'
  | 'blue'
  | 'emerald'
  | 'purple'
  | 'orange'
  | 'outline';

const VARIANT_BG: Record<Exclude<ButtonVariant, 'premium'>, string> = {
  white: 'bg-white',
  red: 'bg-premium-red',
  blue: 'bg-premium-blue',
  emerald: 'bg-premium-green',
  purple: 'bg-premium-purple',
  orange: 'bg-premium-orange',
  outline: 'border border-white/5 bg-transparent',
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  white: 'text-black',
  premium: 'text-white',
  red: 'text-white',
  blue: 'text-white',
  emerald: 'text-white',
  purple: 'text-white',
  orange: 'text-white',
  outline: 'text-white/80',
};

/** Цвет глоу-тени для цветных вариантов (iOS shadow) */
const VARIANT_SHADOW: Partial<Record<ButtonVariant, string>> = {
  red: rgba('red', 0.3),
  blue: rgba('blue', 0.3),
  emerald: rgba('green', 0.3),
  purple: rgba('purple', 0.3),
  orange: rgba('orange', 0.3),
};

/** Цвет иконки: на белой кнопке — чёрная, на остальных — белая */
const iconColor = (variant: ButtonVariant) =>
  variant === 'white' ? '#000' : variant === 'outline' ? 'rgba(255,255,255,0.8)' : '#fff';

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: LucideIcon;
  iconElement?: React.ReactNode;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  icon: Icon,
  iconElement,
  disabled,
  variant = 'premium',
  className,
}) => {
  const handlePress = () => {
    feedbackService.playSound('click');
    feedbackService.vibrate(VIBRATE.tap);
    if (onClick) onClick();
  };

  const shadow = VARIANT_SHADOW[variant];
  const content = (
    <View className="h-16 flex-row items-center justify-center gap-3">
      {iconElement ?? (Icon && <Icon size={24} color={iconColor(variant)} />)}
      <Text
        className={`text-xl font-black uppercase italic ${VARIANT_TEXT[variant]}`}
        style={{ letterSpacing: -0.8 }}
      >
        {children}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`w-full ${disabled ? 'opacity-30' : ''} ${className ?? ''}`}
      style={({ pressed }) => [
        pressed && { transform: [{ scale: 0.95 }] },
        shadow
          ? { shadowColor: shadow, shadowOpacity: 1, shadowRadius: 25, shadowOffset: { width: 0, height: 10 }, elevation: 8 }
          : undefined,
      ]}
    >
      {variant === 'premium' ? (
        <GlassCard className="rounded-premium-md border-white/10">{content}</GlassCard>
      ) : (
        <View className={`rounded-premium-md overflow-hidden ${VARIANT_BG[variant]}`}>{content}</View>
      )}
    </Pressable>
  );
};
