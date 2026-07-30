import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocalizedGames } from '@/entities/game/useLocalizedGame';
import { useTranslation } from '@/shared/i18n';
import { rgba } from '@/shared/theme/colors';

/**
 * Смоук-экран этапа 1: список всех игр из реестра.
 * Проверяет разом ядро без UI-кита: i18n (словари + t), GAMES_REGISTRY,
 * lucide-react-native, NativeWind-классы и MMKV (чтение языка при старте
 * LanguageProvider). Полноценное меню (GameCard-сетка) — этап 3.
 */
export default function MenuScreen() {
  const games = useLocalizedGames();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <View className="px-5">
        <Text className="mb-1 text-3xl font-bold text-white">Party Games</Text>
        <Text className="mb-6 text-base text-white/50">
          {t('menu.tagline', { n: games.length })}
        </Text>

        {games.map((game) => {
          const Icon = game.icon;
          return (
            <View
              key={game.id}
              className="mb-3 flex-row items-center rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <View
                className="mr-4 h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: rgba(game.theme, 0.15) }}
              >
                <Icon size={22} color={rgba(game.theme, 1)} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">{game.title}</Text>
                <Text className="text-sm text-white/40">
                  {game.subtitle} · {game.players}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
