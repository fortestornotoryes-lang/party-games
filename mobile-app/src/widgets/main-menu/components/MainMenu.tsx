import { Users, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameMenuCard } from '@/entities/game/components/GameMenuCard';
import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { GameKey } from '@/entities/game/types';
import { useLocalizedGames } from '@/entities/game/useLocalizedGame';
import { contentService } from '@/features/word-stats/model/contentService';
import { useTranslation } from '@/shared/i18n';
import { getTheme, rgba } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface MainMenuProps {
  onSelectGame: (gameId: GameKey) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  const { setCurrentGameId } = useGameSettings();
  const { t: tr } = useTranslation();
  const GAMES = useLocalizedGames();
  const insets = useSafeAreaInsets();
  const [descriptionGameId, setDescriptionGameId] = useState<GameKey | null>(null);

  useEffect(() => {
    void setCurrentGameId(null);
    // Намеренно только при маунте — сброс выбранной игры при возврате в меню
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGameStats = (gameId: GameKey) => {
    const stats = contentService.getWordStats(gameId, DIFFICULTY.MEDIUM);
    return stats.total > 0 ? stats : null;
  };

  const descriptionGame = descriptionGameId
    ? (GAMES.find((g) => g.id === descriptionGameId) ?? null)
    : null;
  const dt = descriptionGame ? getTheme(descriptionGame.theme) : null;
  const DescIcon = descriptionGame?.icon;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 112,
        paddingHorizontal: 20,
      }}
    >
      <View className="mx-auto w-full max-w-md">
        {/* Логотип */}
        <MotiView
          from={{ opacity: 0, translateY: -14 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 350 }}
          className="mb-10 items-center px-4"
        >
          <View className="flex-row">
            <Text
              className="text-logo font-black uppercase italic text-white"
              style={{ letterSpacing: -2, lineHeight: 56 }}
            >
              PARTY{' '}
            </Text>
            <Text
              className="text-logo text-premium-red font-black uppercase italic"
              style={{
                letterSpacing: -2,
                lineHeight: 56,
                textShadowColor: 'rgba(255,46,77,0.45)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 16,
              }}
            >
              HUB
            </Text>
          </View>
          <Text
            className="text-micro mt-3 font-black uppercase italic text-white/20"
            style={{ letterSpacing: 4 }}
          >
            {tr('menu.tagline', { n: GAMES.length })}
          </Text>
        </MotiView>

        {/* Список игр */}
        <View className="gap-3">
          {GAMES.map((game, index) => {
            const stats = getGameStats(game.id);
            return (
              <GameMenuCard
                key={game.id}
                game={game}
                index={index}
                countDisplay={stats ? `${stats.remaining} / ${stats.total}` : null}
                onSelect={() => {
                  onSelectGame(game.id);
                }}
                onDescriptionClick={() => {
                  setDescriptionGameId(game.id);
                }}
              />
            );
          })}
        </View>
      </View>

      {/* Bottom-sheet описания игры */}
      <Modal
        visible={!!descriptionGame}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setDescriptionGameId(null);
        }}
      >
        <Pressable
          className="flex-1 bg-black/60"
          onPress={() => {
            setDescriptionGameId(null);
          }}
        />
        {!!descriptionGame && !!dt && (
          <MotiView
            from={{ translateY: 400 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="absolute bottom-0 left-0 right-0 px-4"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <View
              className="rounded-premium-xl overflow-hidden border border-white/10"
              style={{ backgroundColor: 'rgba(16,16,20,0.98)' }}
            >
              {/* Ручка шита */}
              <View className="items-center pt-3">
                <View className="h-1 w-10 rounded-full bg-white/10" />
              </View>

              <View className="gap-5 px-6 pb-6 pt-4">
                {/* Шапка */}
                <View className="flex-row items-center gap-4">
                  <View
                    className={`rounded-premium-md h-12 w-12 shrink-0 items-center justify-center ${dt.solid}`}
                  >
                    {!!DescIcon && <DescIcon size={20} color="#fff" />}
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text
                      className={`text-lg font-black uppercase italic ${dt.text}`}
                      style={{ letterSpacing: -0.3 }}
                    >
                      {descriptionGame.title}
                    </Text>
                    <Text className="text-label mt-0.5 font-medium text-white/35">
                      {descriptionGame.subtitle}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setDescriptionGameId(null);
                    }}
                    className="h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5"
                    style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
                  >
                    <X size={16} color="rgba(255,255,255,0.3)" />
                  </Pressable>
                </View>

                {/* Описание */}
                <View className={`rounded-premium-md border p-4 ${dt.border20} ${dt.bg5}`}>
                  <Text className="text-card font-medium leading-6 text-white/70">
                    {descriptionGame.description}
                  </Text>
                </View>

                {/* Игроки */}
                <View className="flex-row items-center gap-2">
                  <View
                    className={`rounded-premium-sm flex-row items-center gap-1.5 border px-3 py-1.5 ${dt.bg10} ${dt.border30}`}
                  >
                    <Users size={10} color={rgba(descriptionGame.theme, 1)} />
                    <Text
                      className={`text-micro font-black uppercase ${dt.text}`}
                      style={{ letterSpacing: 1.2 }}
                    >
                      {tr('menu.playersCount', { players: descriptionGame.players })}
                    </Text>
                  </View>
                </View>

                {/* Играть */}
                <Pressable
                  onPress={() => {
                    setDescriptionGameId(null);
                    onSelectGame(descriptionGame.id);
                  }}
                  className={`rounded-premium-md w-full items-center py-4 ${dt.solid}`}
                  style={({ pressed }) => (pressed ? { transform: [{ scale: 0.98 }] } : undefined)}
                >
                  <Text
                    className="text-card font-black uppercase text-black"
                    style={{ letterSpacing: 2.4 }}
                  >
                    {tr('menu.play')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </MotiView>
        )}
      </Modal>
    </ScrollView>
  );
};
