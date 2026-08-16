import { Zap } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import type { Card, Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TextInput } from '@/shared/components/TextInput';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const CARD_COLOR_CLASS: Record<Card['color'], string> = {
  red: 'border-premium-red/80 bg-transparent',
  blue: 'border-premium-blue/80 bg-transparent',
  neutral: 'bg-stone-400/50 border-transparent',
  double_agent: 'border-premium-green/80 bg-transparent',
  assassin: 'border-red-900 bg-red-900',
};

interface CaptainPhaseProps {
  cards: Card[];
  turn: Team;
  currentCaptain: string;
  clueWord: string;
  clueCount: number;
  onClueWordChange: (word: string) => void;
  onClueCountChange: (count: number) => void;
  onSubmit: () => void;
}

/** Легенда цветов карточек */
const LegendDot: React.FC<{ className: string; label: string }> = ({ className, label }) => (
  <View className="flex-row items-center gap-1">
    <View className={`h-4 w-4 rounded-full border ${className}`} />
    <Text className="text-label font-black uppercase text-white">{label}</Text>
  </View>
);

export const CaptainPhase: React.FC<CaptainPhaseProps> = ({
  cards,
  turn,
  currentCaptain,
  clueWord,
  clueCount,
  onClueWordChange,
  onClueCountChange,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="captain"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-4"
    >
      <View className="items-center">
        <Text
          className={`text-sub-heading text-center font-black uppercase ${
            turn === 'red' ? 'text-premium-red' : 'text-premium-blue'
          }`}
        >
          {t(`${NS.CODENAMES}.captainTurn`, { name: currentCaptain })}
        </Text>
        <View className="mb-2 mt-3 flex-row flex-wrap justify-center gap-x-3 gap-y-1">
          <LegendDot className="border-premium-red bg-black" label={t(`${NS.CODENAMES}.redTeam`)} />
          <LegendDot
            className="border-premium-blue bg-black"
            label={t(`${NS.CODENAMES}.blueTeam`)}
          />
          <LegendDot className="border-white/20 bg-stone-400/50" label={t(`${NS.CODENAMES}.neutralEndTurn`)} />
          <LegendDot className="border-red-900 bg-red-900" label={t(`${NS.CODENAMES}.assassinDeath`)} />
        </View>
        <Text className="mt-1 text-xs text-white/40">{t(`${NS.CODENAMES}.makeClueHint`)}</Text>
      </View>

      <View className="mb-4 flex-row flex-wrap" style={{ margin: -3 }}>
        {cards.map((card) => (
          <View key={card.id} style={{ width: '20%', padding: 3 }}>
            <View
              className={`items-center justify-center rounded border p-1 ${CARD_COLOR_CLASS[card.color]}`}
              style={{ aspectRatio: 4 / 3, opacity: card.revealed ? 0.3 : 1 }}
            >
              <Text className="text-micro text-center font-bold uppercase text-white">
                {card.word}
              </Text>
              {card.color === 'double_agent' && (
                <View className="absolute right-1 top-1">
                  <Zap size={16} color="#fff" fill="#fff" />
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      <View className="mt-auto gap-4">
        <View className="flex-row gap-2">
          <TextInput
            value={clueWord}
            onChangeText={(text) => {
              onClueWordChange(text.replace(/ /g, ''));
            }}
            placeholder={t(`${NS.CODENAMES}.oneWord`)}
            className="h-12 flex-1 text-center uppercase"
            autoCapitalize="characters"
          />
          <TextInput
            value={clueCount === 0 ? '' : String(clueCount)}
            onChangeText={(text) => {
              onClueCountChange(parseInt(text.replace(/\D/g, ''), 10) || 0);
            }}
            keyboardType="number-pad"
            placeholder="0"
            className="h-12 w-20 text-center text-xl"
          />
        </View>
        <PrimaryButton
          onClick={onSubmit}
          variant={turn === 'red' ? 'red' : 'blue'}
          disabled={!clueWord || clueCount <= 0}
        >
          {t(`${NS.CODENAMES}.confirm`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
