import { Moon, Shield, Sun, Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface Props {
  playerNames: string[];
  onBack: () => void;
}

/** Мафия и в веб-версии — экран «в разработке»; перенесён 1:1. */
export default function MafiaGame({ playerNames: _playerNames, onBack }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center gap-8 p-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <MotiView
        from={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-premium-lg bg-premium-orange/20 border-premium-orange/40 h-20 w-20 items-center justify-center border"
      >
        <Users size={40} color={rgba('orange', 1)} />
      </MotiView>

      <View className="items-center gap-2">
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 30, lineHeight: 33, letterSpacing: -1.2 }}
        >
          {t('registry.games.mafia.title')}
        </Text>
        <Text
          className="text-tag text-center font-bold uppercase text-white/30"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.MAFIA}.cityFallsAsleep`)}
        </Text>
      </View>

      <View className="rounded-premium-lg w-full max-w-sm gap-6 border border-white/10 bg-white/5 p-8">
        <View className="flex-row justify-center gap-4">
          <Sun size={24} color={rgba('yellow', 1)} />
          <Moon size={24} color={rgba('purple', 1)} />
          <Shield size={24} color={rgba('blue', 1)} />
        </View>
        <Text className="text-center text-sm text-white/40" style={{ lineHeight: 22 }}>
          {t(`${NS.MAFIA}.inDevelopment`)}
        </Text>
      </View>

      <Pressable
        onPress={onBack}
        className="rounded-premium-md bg-white px-10 py-4"
        style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
      >
        <Text className="font-black uppercase text-black" style={{ letterSpacing: 2 }}>
          {t(`${NS.MAFIA}.goBack`)}
        </Text>
      </Pressable>
    </View>
  );
}
