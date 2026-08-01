import { HelpCircle, Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { GameMetadata } from '../types';

import { getTheme, rgba } from '@/shared/theme/colors';

interface GameMenuCardProps {
  game: GameMetadata;
  index: number;
  countDisplay: string | null;
  onSelect: () => void;
  onDescriptionClick: () => void;
}

/** Карточка игры в меню. Фоновые картинки веб-версии вернутся после переноса ассетов. */
export const GameMenuCard: React.FC<GameMenuCardProps> = ({
  game,
  index,
  countDisplay,
  onSelect,
  onDescriptionClick,
}) => {
  const Icon = game.icon;
  const t = getTheme(game.theme);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 280, delay: 80 + index * 40 }}
    >
      <Pressable
        onPress={onSelect}
        className="rounded-premium-2xl w-full flex-row items-center gap-4 overflow-hidden border border-white/10 bg-white/5 p-4"
        style={({ pressed }) => (pressed ? { transform: [{ scale: 0.975 }] } : undefined)}
      >
        {/* Левая цветовая полоса */}
        <View
          className={`absolute bottom-0 left-0 top-0 w-1 rounded-r-full opacity-75 ${t.solid}`}
        />

        {/* Иконка */}
        <View
          className={`rounded-premium-md ml-2 h-14 w-14 shrink-0 items-center justify-center overflow-hidden ${t.solid}`}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(0,0,0,0.25)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Icon size={22} color="#fff" />
        </View>

        {/* Контент */}
        <View className="min-w-0 flex-1">
          <Text
            className="mb-1.5 text-lg font-black uppercase italic text-white"
            style={{ letterSpacing: 1.5, lineHeight: 20 }}
          >
            {game.title}
          </Text>
          <Text className="mb-2.5 pr-1 text-xs font-medium text-white/45">{game.subtitle}</Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <View
              className={`rounded-premium-sm flex-row items-center gap-1.5 border px-2.5 py-1 ${t.bg10} ${t.border30}`}
            >
              <Users size={10} color={rgba(game.theme, 1)} />
              <Text
                className={`text-micro font-black uppercase ${t.text}`}
                style={{ letterSpacing: 1.2 }}
              >
                {game.players}
              </Text>
            </View>
            {!!countDisplay && (
              <View className="rounded-premium-sm border border-white/10 bg-white/5 px-2.5 py-1">
                <Text
                  className="text-micro font-black uppercase text-white/25"
                  style={{ letterSpacing: 1 }}
                >
                  {countDisplay}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Кнопка описания */}
        {!!game.description && (
          <Pressable
            onPress={onDescriptionClick}
            hitSlop={6}
            className="h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5"
            style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
          >
            <HelpCircle size={24} color="rgba(255,255,255,0.2)" />
          </Pressable>
        )}
      </Pressable>
    </MotiView>
  );
};
