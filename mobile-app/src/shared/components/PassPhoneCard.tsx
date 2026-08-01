import type { LucideIcon } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Typography } from '@/shared/components/Typography';
import { PREMIUM_RGB, rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

type BadgeColor = 'orange' | 'sky' | 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'default';
type AccentColor = 'green' | 'sky' | 'red' | 'orange' | 'blue' | 'purple' | 'yellow' | 'default';

interface PassPhoneCardProps {
  playerName: string;
  playerLabel?: string;
  badge?: string;
  badgeColor?: BadgeColor;
  instruction?: string;
  icon?: LucideIcon;
  accentColor?: AccentColor;
  onClick: () => void;
}

const badgeStyles: Record<BadgeColor, { box: string; text: string }> = {
  orange: { box: 'bg-premium-orange/10 border-premium-orange/20', text: 'text-premium-orange' },
  sky: { box: 'bg-premium-sky/10 border-premium-sky/20', text: 'text-premium-sky' },
  red: { box: 'bg-premium-red/10 border-premium-red/20', text: 'text-premium-red' },
  green: { box: 'bg-premium-green/10 border-premium-green/20', text: 'text-premium-green' },
  blue: { box: 'bg-premium-blue/10 border-premium-blue/20', text: 'text-premium-blue' },
  purple: { box: 'bg-premium-purple/10 border-premium-purple/20', text: 'text-premium-purple' },
  yellow: { box: 'bg-premium-yellow/10 border-premium-yellow/20', text: 'text-premium-yellow' },
  default: { box: 'bg-white/5 border-white/10', text: 'text-white/40' },
};

/** Акцент карточки: default — нейтральный, цветные — по PREMIUM_RGB */
const accentRgb = (accent: AccentColor): string | null =>
  accent === 'default' ? null : PREMIUM_RGB[accent as GameTheme];

/**
 * Полноэкранная карточка «передай телефон». Глитч-слои веб-версии
 * (mix-blend-mode + clip-path) в RN невоспроизводимы — вместо них
 * статичный HUD-контейнер; пульс иконки сохранён через moti.
 */
export const PassPhoneCard: React.FC<PassPhoneCardProps> = ({
  playerName,
  playerLabel,
  badge,
  badgeColor = 'default',
  instruction,
  icon: Icon,
  accentColor = 'default',
  onClick,
}) => {
  const rgb = accentRgb(accentColor);
  const borderColor = rgb ? `rgba(${rgb},1)` : 'rgba(63,123,255,1)';
  const glowColor = rgb ? `rgba(${rgb},0.15)` : 'rgba(0,0,0,0.55)';
  const iconColor = rgb ? `rgba(${rgb},1)` : 'rgba(255,255,255,0.35)';
  const ringStyle = rgb
    ? { backgroundColor: `rgba(${rgb},0.1)`, borderColor: `rgba(${rgb},0.3)` }
    : { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' };
  const labelColor = rgb ? `rgba(${rgb},0.4)` : 'rgba(255,255,255,0.22)';

  const corner = { borderColor, width: 40, height: 40, position: 'absolute' as const };

  return (
    <Pressable
      onPress={onClick}
      className="rounded-premium-2xl w-full items-center justify-center overflow-hidden"
      style={({ pressed }) => [
        {
          aspectRatio: 3 / 4,
          borderWidth: 1.5,
          borderColor,
          shadowColor: glowColor,
          shadowOpacity: 1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
          elevation: 10,
        },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.065)', 'rgba(255,255,255,0.018)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Углы-уголки */}
      <View style={[corner, { top: 20, left: 20, borderTopWidth: 1, borderLeftWidth: 1 }]} />
      <View style={[corner, { top: 20, right: 20, borderTopWidth: 1, borderRightWidth: 1 }]} />
      <View style={[corner, { bottom: 20, left: 20, borderBottomWidth: 1, borderLeftWidth: 1 }]} />
      <View style={[corner, { bottom: 20, right: 20, borderBottomWidth: 1, borderRightWidth: 1 }]} />

      <View className="items-center gap-7 px-10">
        {/* Пульсирующее кольцо с иконкой */}
        <MotiView
          from={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0.9, scale: 1.15 }}
          transition={{ type: 'timing', duration: 600, loop: true }}
          className="h-[72px] w-[72px] items-center justify-center rounded-full border"
          style={ringStyle}
        >
          {!!Icon && <Icon size={48} color={iconColor} />}
        </MotiView>

        <View className="items-center gap-3">
          {!!badge && (
            <View className={`rounded-full border px-3 py-1 ${badgeStyles[badgeColor].box}`}>
              <Text
                className={`text-micro font-black uppercase ${badgeStyles[badgeColor].text}`}
                style={{ letterSpacing: 1 }}
              >
                {badge}
              </Text>
            </View>
          )}

          <View className="items-center">
            {!!playerLabel && (
              <Text
                className="mb-2 text-label font-black uppercase"
                style={{ color: labelColor, letterSpacing: 5 }}
              >
                {playerLabel}
              </Text>
            )}

            {/* HUD-контейнер имени (без веб-глитчей) */}
            <View className="rounded-premium-xs border border-white/5 bg-black/40 px-6 py-3">
              <Text className="text-pico absolute bottom-1 left-1 text-white/20">SYS_ERR</Text>
              <Text className="text-pico text-premium-pink/40 absolute right-1 top-1">[v4.02]</Text>
              <Typography.Heading size="lg" color="body">
                {playerName}
              </Typography.Heading>
            </View>
          </View>
        </View>

        {!!instruction && (
          <Typography.Body
            align="center"
            className="font-bold uppercase text-white/20"
            style={{ letterSpacing: 3.5 }}
          >
            {instruction}
          </Typography.Body>
        )}
      </View>
    </Pressable>
  );
};
