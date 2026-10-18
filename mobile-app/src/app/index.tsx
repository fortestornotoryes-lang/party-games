import { useRouter } from 'expo-router';
import { FlaskConical, Settings as SettingsIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCurrentGame } from '@/entities/game/model/GameSettingsContext';
import type { GameKey } from '@/entities/game/types';
import { GlassCard } from '@/shared/components/GlassCard';
import { MainMenu } from '@/widgets/main-menu/components/MainMenu';

export default function MenuRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setCurrentGameId } = useCurrentGame();

  const handleSelectGame = (gameId: GameKey) => {
    // Ставим id до навигации, чтобы Setup сразу отрендерился с нужным конфигом
    setCurrentGameId(gameId);
    router.push(`/game/${gameId}/setup`);
  };

  return (
    <View className="flex-1">
      <MainMenu onSelectGame={handleSelectGame} />

      {/* Плавающие кнопки: настройки + debug-витрина UI-кита */}
      <View
        className="absolute right-6 gap-3"
        style={{ bottom: insets.bottom + 24 }}
      >
        <Pressable
          onPress={() => {
            router.push('/showcase');
          }}
          style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
        >
          <GlassCard className="rounded-premium-md h-14 w-14 items-center justify-center">
            <FlaskConical size={20} color="rgba(255,255,255,0.3)" />
          </GlassCard>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push('/settings');
          }}
          style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
        >
          <GlassCard className="rounded-premium-md h-14 w-14 items-center justify-center">
            <SettingsIcon size={20} color="rgba(255,255,255,0.3)" />
          </GlassCard>
        </Pressable>
      </View>
    </View>
  );
}
