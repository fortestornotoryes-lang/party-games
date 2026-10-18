import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { ArrowLeft, HelpCircle, Play, Shuffle, UserPlus, Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import { DEFAULT_NAMES, DEFAULT_NAMES_EN, PlayerRow } from '@/entities/player/components/PlayerRow';
import type { PlayerEntry } from '@/entities/player/types';
import { GlassCard } from '@/shared/components/GlassCard';
import { InstructionsModal } from '@/shared/components/InstructionsModal';
import { Typography } from '@/shared/components/Typography';
import { shuffle } from '@/shared/helpers/random';
import { useLanguage } from '@/shared/i18n';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { storageService } from '@/shared/services/storageService';
import { getTheme, rgba } from '@/shared/theme/colors';
import { DIFFICULTY, type GameTheme } from '@/shared/types';

interface SetupProps {
  onStart: (playerNames: string[]) => void;
  onBack: () => void;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  themeColor: GameTheme;
  playerPlaceholder: string;
  addPlayerLabel: string;
  instructions: { title: string; content: string }[];
  description?: string;
  minPlayers: number;
  maxPlayers?: number;
  children?: React.ReactNode;
}

let _idCounter = 0;
const makeId = () => `p-${++_idCounter}-${Math.random().toString(36).slice(2, 6)}`;

/** Фон приложения — для градиента футера (совпадает с APP_BG в _layout) */
const BG = '#0b0915';

export const Setup: React.FC<SetupProps> = ({
  onStart,
  onBack,
  title,
  subtitle,
  themeColor,
  playerPlaceholder,
  addPlayerLabel,
  instructions,
  description,
  minPlayers,
  maxPlayers = 12,
  children,
}) => {
  const { difficulty } = useGameConfig();
  const { t, lang } = useLanguage();
  const insets = useSafeAreaInsets();
  const config = getTheme(themeColor);
  // MMKV синхронный — ленивый инициализатор работает как в вебе
  const [players, setPlayers] = useState<PlayerEntry[]>(() => {
    const savedNames = storageService.getPlayers();
    if (savedNames.length >= minPlayers) {
      return savedNames.slice(0, maxPlayers).map((name) => ({ id: makeId(), name }));
    }
    const shuffled = shuffle(lang === 'en' ? DEFAULT_NAMES_EN : DEFAULT_NAMES);
    return Array.from({ length: minPlayers }, (_, i) => ({
      id: makeId(),
      name: shuffled[i] ?? `${playerPlaceholder} ${i + 1}`,
    }));
  });
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const names = players.map((p) => p.name);
    if (names.some((n) => n.trim() !== '')) {
      storageService.savePlayers(names);
    }
  }, [players]);

  const addPlayer = () => {
    if (players.length < maxPlayers)
      setPlayers((prev) => [
        ...prev,
        { id: makeId(), name: `${playerPlaceholder} ${prev.length + 1}` },
      ]);
  };
  const removePlayer = (id: string) => {
    if (players.length > minPlayers) setPlayers((prev) => prev.filter((p) => p.id !== id));
  };
  const handleNameChange = (id: string, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };
  const shufflePlayers = () => {
    setPlayers((prev) => shuffle(prev));
  };

  const isReady = players.every((p) => p.name.trim() !== '');
  const canRemove = players.length > minPlayers;
  const titleWords = title.split(' ');
  const diffColor =
    difficulty === DIFFICULTY.EASY
      ? 'text-premium-green'
      : difficulty === DIFFICULTY.MEDIUM
        ? 'text-premium-sky'
        : 'text-premium-red';
  const diffLabel =
    difficulty === DIFFICULTY.EASY
      ? t('common.difficultyShort.easy')
      : difficulty === DIFFICULTY.MEDIUM
        ? t('common.difficultyShort.medium')
        : t('common.difficultyShort.hard');

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 24,
        }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Шапка */}
          <View className="mb-12">
            <View className="mb-4 flex-row items-center justify-between">
              <Pressable
                onPress={onBack}
                style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
              >
                <GlassCard className="h-12 w-12 items-center justify-center rounded-full border-0">
                  <ArrowLeft size={24} color="#fff" />
                </GlassCard>
              </Pressable>
              <View className="flex-1 items-center pl-2">
                {titleWords.length > 1 ? (
                  <>
                    <Typography.Title align="center">
                      {titleWords.slice(0, -1).join(' ')}
                    </Typography.Title>
                    <Typography.Title align="center" className={config.text}>
                      {titleWords.at(-1)}
                    </Typography.Title>
                  </>
                ) : (
                  <Typography.Title align="center" className={config.text}>
                    {title}
                  </Typography.Title>
                )}
              </View>
            </View>

            <View className="flex-row items-center justify-between px-1">
              <View className="flex-row items-center gap-3">
                <View className={`h-3 w-1 rounded-full ${config.solid}`} />
                <Text
                  className="text-tag font-black uppercase italic text-white/80"
                  style={{ letterSpacing: 4 }}
                >
                  {subtitle}
                </Text>
              </View>
              <GlassCard className="rounded-premium-sm border-0 px-4 py-1.5">
                <Text
                  className={`text-tag font-black uppercase italic ${diffColor}`}
                  style={{ letterSpacing: 2 }}
                >
                  {diffLabel}
                </Text>
              </GlassCard>
            </View>
          </View>

          {/* Игроки */}
          <View className="mb-10">
            <View className="mb-6 flex-row items-center justify-between px-1">
              <View className="flex-row items-center gap-3">
                <Users size={16} color={rgba(themeColor, 1)} />
                <Text
                  className="text-tag font-black uppercase text-white/80"
                  style={{ letterSpacing: 4 }}
                >
                  {t('common.participants')}
                </Text>
              </View>
              <View className="flex-row items-center gap-4">
                <Pressable
                  onPress={() => {
                    feedbackService.vibrate(VIBRATE.tap);
                    shufflePlayers();
                  }}
                  hitSlop={8}
                  style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
                >
                  <Shuffle size={20} color="rgba(255,255,255,0.2)" />
                </Pressable>
                <View className="rounded-premium-sm border border-white/5 bg-white/5 px-4 py-1">
                  <Text className="text-label font-black italic text-white/80">
                    {players.length} / {maxPlayers}
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-4">
              {players.map((p, i) => (
                <PlayerRow
                  key={p.id}
                  player={p}
                  index={i}
                  canRemove={canRemove}
                  config={config}
                  theme={themeColor}
                  placeholder={playerPlaceholder}
                  onRemove={removePlayer}
                  onChange={handleNameChange}
                />
              ))}
            </View>

            {players.length < maxPlayers && (
              <Pressable
                onPress={addPlayer}
                className="rounded-premium-lg mt-4 h-12 w-full flex-row items-center justify-center gap-4 border-2 border-dashed border-white/25"
                style={({ pressed }) => (pressed ? { transform: [{ scale: 0.97 }] } : undefined)}
              >
                <UserPlus size={20} color="rgba(255,255,255,0.5)" />
                <Text
                  className="text-label font-black uppercase text-white/50"
                  style={{ letterSpacing: 4 }}
                >
                  {addPlayerLabel}
                </Text>
              </Pressable>
            )}
          </View>

          {!!children && <View className="mt-12">{children}</View>}
        </MotiView>
      </ScrollView>

      {/* Футер: инструкции + старт */}
      <View className="absolute bottom-0 left-0 right-0">
        <LinearGradient
          colors={['transparent', `${BG}F2`, BG]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          className="mx-auto w-full max-w-md flex-row gap-5 px-6 pt-6"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Pressable
            onPress={() => {
              setShowInstructions(true);
            }}
            className="flex-[1]"
            style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
          >
            <GlassCard className="rounded-premium-md h-16 items-center justify-center border-white/5">
              <HelpCircle size={28} color="rgba(255,255,255,0.8)" />
            </GlassCard>
          </Pressable>

          <Pressable
            disabled={!isReady}
            onPress={() => {
              feedbackService.playSound('click');
              feedbackService.vibrate(VIBRATE.tap);
              onStart(players.map((p) => p.name));
            }}
            className={`rounded-premium-md h-16 flex-[2] flex-row items-center justify-center gap-4 ${config.solid} ${
              isReady ? '' : 'opacity-30'
            }`}
            style={({ pressed }) => [
              {
                shadowColor: rgba(themeColor, 0.3),
                shadowOpacity: 1,
                shadowRadius: 25,
                shadowOffset: { width: 0, height: 10 },
                elevation: 8,
              },
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
          >
            <Play size={24} color="#fff" fill="#fff" />
            <Text
              className="text-2xl font-black uppercase italic text-white"
              style={{ letterSpacing: -1 }}
            >
              {t('common.start')}
            </Text>
          </Pressable>
        </View>
      </View>

      <InstructionsModal
        open={showInstructions}
        onClose={() => {
          setShowInstructions(false);
        }}
        title={title}
        instructions={instructions}
        description={description}
        theme={themeColor}
      />
    </View>
  );
};
