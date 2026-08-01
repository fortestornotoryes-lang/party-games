import type { LucideIcon } from 'lucide-react-native';
import { Home } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { getTheme, rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

interface GameHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  theme: GameTheme;
  onBack: () => void;
  extraActions?: React.ReactNode;
}

/**
 * Шапка игрового экрана. В вебе была sticky с backdrop-blur; в RN экраны
 * не скроллят шапку (она вне ScrollView), полупрозрачный фон сохранён.
 */
export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  theme,
  onBack,
  extraActions,
}) => {
  const t = getTheme(theme);
  return (
    <View
      className="flex-row items-center justify-between border-b border-white/5 px-4 py-2.5"
      style={{ backgroundColor: 'rgba(11,9,21,0.75)' }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={`rounded-premium-sm h-8 w-8 items-center justify-center border bg-white/5 ${t.border30}`}
        >
          <Icon size={16} color={rgba(theme, 1)} />
        </View>
        <View>
          <Text
            className="text-sm font-black uppercase italic text-white"
            style={{ letterSpacing: -0.3 }}
          >
            {title}
          </Text>
          <Text
            className="text-micro mt-0.5 font-black uppercase text-white/35"
            style={{ letterSpacing: 1.4 }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {extraActions}
        <Pressable
          onPress={onBack}
          className="rounded-premium-sm h-12 w-12 items-center justify-center border border-white/10 bg-white/5"
          style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
        >
          <Home size={20} color="rgba(255,255,255,0.5)" />
        </Pressable>
      </View>
    </View>
  );
};
