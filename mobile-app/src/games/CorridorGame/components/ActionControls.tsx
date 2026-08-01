import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionMode } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  actionMode: ActionMode;
  curColor: string;
  wallsDepleted: boolean;
  onSelect: (m: ActionMode) => void;
}

export const ActionControls: React.FC<Props> = ({
  actionMode,
  curColor,
  wallsDepleted,
  onSelect,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const buttons = [
    {
      m: ActionMode.Move,
      label: t(`${NS.CORRIDOR}.moveLabel`),
      hint: t(`${NS.CORRIDOR}.moveHint`),
    },
    {
      m: ActionMode.WallH,
      label: t(`${NS.CORRIDOR}.wallHLabel`),
      hint: t(`${NS.CORRIDOR}.wallHHint`),
    },
    {
      m: ActionMode.WallV,
      label: t(`${NS.CORRIDOR}.wallVLabel`),
      hint: t(`${NS.CORRIDOR}.wallVHint`),
    },
  ] as const;

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: insets.bottom + 16 }}>
      <View className="flex-row gap-2">
        {buttons.map(({ m, label, hint }) => {
          const isActive = actionMode === m;
          const isWallBtn = m === ActionMode.WallH || m === ActionMode.WallV;
          const disabled = isWallBtn && wallsDepleted;
          return (
            <Pressable
              key={m}
              onPress={() => {
                if (!disabled) onSelect(m);
              }}
              disabled={disabled}
              className="rounded-premium-sm flex-1 items-center gap-0.5 py-2.5"
              style={({ pressed }) => [
                {
                  backgroundColor: isActive ? `${curColor}22` : 'rgba(255,255,255,0.05)',
                  borderWidth: 1.5,
                  borderColor: isActive ? `${curColor}55` : 'rgba(255,255,255,0.08)',
                  opacity: disabled ? 0.2 : 1,
                },
                pressed && !disabled && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <Text
                className="text-xs font-black uppercase"
                style={{ color: isActive ? curColor : 'rgba(255,255,255,0.45)' }}
              >
                {label}
              </Text>
              <Text
                className="text-micro font-medium"
                style={{ color: isActive ? curColor : 'rgba(255,255,255,0.45)', opacity: 0.55 }}
              >
                {hint}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
