import {
  ChevronDown,
  ChevronUp,
  List,
  MessageSquare,
  Skull,
  Timer,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { Player } from '@/entities/player/types';
import { LOCATIONS, QUESTION_IDEAS } from '@/games/SpyHuntGame/constants';
import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface PlayingPhaseProps {
  players: Player[];
  timeLeft: number;
  onReveal: () => void;
}

/** Кнопка-аккордеон подсказок (вопросы / локации) */
const ToggleRow: React.FC<{
  open: boolean;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}> = ({ open, icon, label, onPress }) => (
  <Pressable
    onPress={onPress}
    className="rounded-premium-md w-full flex-row items-center justify-between border border-white/10 bg-white/5 p-4"
    style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
  >
    <View className="flex-row items-center gap-3">
      {icon}
      <Text
        className="text-tag font-black uppercase text-white/60"
        style={{ letterSpacing: 2 }}
      >
        {label}
      </Text>
    </View>
    {open ? (
      <ChevronUp size={16} color="rgba(255,255,255,0.6)" />
    ) : (
      <ChevronDown size={16} color="rgba(255,255,255,0.6)" />
    )}
  </Pressable>
);

/** Круглый индикатор времени — единственная часть экрана, которой нужен timeLeft каждую секунду */
const TimerDisplay: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const warn = timeLeft < 60;
  return (
    <View className="items-center">
      <View
        className={`h-28 w-28 items-center justify-center rounded-full border-2 ${
          warn ? 'border-premium-red/60 bg-premium-red/10' : 'border-white/10 bg-white/5'
        }`}
        style={
          warn
            ? {
                shadowColor: rgba('red', 0.5),
                shadowOpacity: 1,
                shadowRadius: 15,
                shadowOffset: { width: 0, height: 0 },
                elevation: 8,
              }
            : undefined
        }
      >
        <Timer
          size={24}
          color={warn ? rgba('red', 1) : 'rgba(255,255,255,0.3)'}
          style={{ marginBottom: 4 }}
        />
        <Text
          className="text-3xl font-black italic text-white"
          style={{ letterSpacing: -1.2, fontVariant: ['tabular-nums'] }}
        >
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};

/**
 * Аккордеоны с подсказками + список игроков + кнопка раскрытия — вынесены в
 * memo-компонент: players/onReveal не меняются каждую секунду (в отличие от
 * timeLeft у родителя), поэтому 1Hz-тик таймера не должен перерендеривать
 * список игроков.
 */
const GameBody: React.FC<{ players: Player[]; onReveal: () => void }> = React.memo(
  ({ players, onReveal }) => {
    const { t } = useTranslation();
    const [showQuestions, setShowQuestions] = useState(false);
    const [showLocations, setShowLocations] = useState(false);

    return (
      <>
      <View className="gap-3">
        <ToggleRow
          open={showQuestions}
          icon={<MessageSquare size={16} color={rgba('red', 1)} />}
          label={t(`${NS.SPY_HUNT}.questionIdeas`)}
          onPress={() => {
            setShowQuestions((v) => !v);
          }}
        />

        {!!showQuestions && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-2">
            {QUESTION_IDEAS.map((q, i) => (
              <View
                key={i}
                className="rounded-premium-md border border-white/5 bg-white/5 p-4"
              >
                <Text className="text-label italic text-white/55">{q}</Text>
              </View>
            ))}
          </MotiView>
        )}

        <ToggleRow
          open={showLocations}
          icon={<List size={16} color={rgba('sky', 1)} />}
          label={t(`${NS.SPY_HUNT}.possibleLocations`)}
          onPress={() => {
            setShowLocations((v) => !v);
          }}
        />

        {!!showLocations && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-row flex-wrap gap-2"
          >
            {LOCATIONS.map((loc, i) => (
              <View
                key={i}
                className="rounded-premium-sm border border-white/5 bg-white/5 p-3"
                style={{ width: '48%', flexGrow: 1 }}
              >
                <Text className="text-tag text-center font-bold text-white/45">{loc}</Text>
              </View>
            ))}
          </MotiView>
        )}
      </View>

      <View className="pt-6">
        <Text
          className="text-tag mb-4 text-center font-black uppercase text-white/20"
          style={{ letterSpacing: 3 }}
        >
          {t(`${NS.SPY_HUNT}.agentsSuspected`)}
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {players.map((p) => (
            <View key={p.id} style={{ width: '47%', flexGrow: 1 }}>
              <GameCard className="border-white/5 p-4">
                <View className="flex-row items-center gap-3">
                  <View className="bg-premium-red/50 h-2 w-2 rounded-full" />
                  <Text
                    numberOfLines={1}
                    className="text-sm font-black uppercase italic text-white"
                    style={{ letterSpacing: -0.3 }}
                  >
                    {p.name}
                  </Text>
                </View>
              </GameCard>
            </View>
          ))}
        </View>
      </View>

      <View className="pt-8">
        <PrimaryButton onClick={onReveal} icon={Skull} variant="red">
          {t(`${NS.SPY_HUNT}.reveal`)}
        </PrimaryButton>
      </View>
      </>
    );
  }
);

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({ players, timeLeft, onReveal }) => (
  <MotiView
    key="playing"
    from={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ type: 'timing', duration: 200 }}
    className="flex-1"
  >
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 24, gap: 24, maxWidth: 672, width: '100%', alignSelf: 'center' }}
    >
      <TimerDisplay timeLeft={timeLeft} />
      <GameBody players={players} onReveal={onReveal} />
    </ScrollView>
  </MotiView>
);
