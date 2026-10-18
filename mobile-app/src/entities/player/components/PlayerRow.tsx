import { UserMinus } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { PlayerEntry } from '@/entities/player/types';
import { TextInput } from '@/shared/components/TextInput';
import type { ThemeTokens } from '@/shared/theme/colors';
import { rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

export const DEFAULT_NAMES = ['Дуня', 'Валера', 'Диана', 'Люба', 'Саша'];
export const DEFAULT_NAMES_EN = ['Alex', 'Sam', 'Kate', 'Max', 'Nick'];

interface PlayerRowProps {
  player: PlayerEntry;
  index: number;
  canRemove: boolean;
  config: ThemeTokens;
  /** Тема игры — для цвета номера (в вебе жила внутри config.indexBg) */
  theme: GameTheme;
  placeholder: string;
  onRemove: (id: string) => void;
  onChange: (id: string, name: string) => void;
}

/**
 * Строка игрока на Setup-экране.
 * Drag-reorder веб-версии (motion Reorder) пока не перенесён —
 * TODO(этап 3): react-native-draggable-flatlist или reanimated-реализация.
 */
export const PlayerRow: React.FC<PlayerRowProps> = ({
  player,
  index,
  canRemove,
  config,
  theme,
  placeholder,
  onRemove,
  onChange,
}) => (
  <View className="flex-row items-center gap-4">
    <View
      className={`rounded-premium-sm h-9 w-9 shrink-0 items-center justify-center border ${config.bg20} ${config.border30}`}
    >
      <Text className="text-xs font-black italic" style={{ color: rgba(theme, 1) }}>
        {index + 1}
      </Text>
    </View>

    <View className="flex-1">
      <TextInput
        value={player.name}
        onChangeText={(name) => {
          onChange(player.id, name);
        }}
        autoComplete="off"
        className="rounded-premium-md h-9"
        placeholder={`${placeholder} ${index + 1}`}
      />
    </View>

    {!!canRemove && (
      <Pressable
        onPress={() => {
          onRemove(player.id);
        }}
        className="rounded-premium-sm h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/5"
        style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
      >
        <UserMinus size={20} color="rgba(255,255,255,0.2)" />
      </Pressable>
    )}
  </View>
);
