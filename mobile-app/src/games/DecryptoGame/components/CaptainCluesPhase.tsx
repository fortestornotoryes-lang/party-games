import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { tBadge, tText } from '../helpers';
import type { TeamColor } from '../types';

import { WordGrid } from './WordGrid';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TextInput } from '@/shared/components/TextInput';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface CaptainCluesPhaseProps {
  words: string[];
  currentCode: number[];
  clues: string[];
  activeTeam: TeamColor;
  onChange: (clues: string[]) => void;
  onSubmit: () => void;
}

export const CaptainCluesPhase: React.FC<CaptainCluesPhaseProps> = ({
  words,
  currentCode,
  clues,
  activeTeam,
  onChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="captain_clues"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-6 pb-8"
    >
      <View className="items-center py-3">
        <Text
          className={`text-tag font-black uppercase ${tText(activeTeam)}`}
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.DECRYPTO}.encryptor`)}
        </Text>
        <Text
          className="text-center text-3xl font-black text-white"
          style={{ letterSpacing: 4 }}
        >
          {currentCode.join(' - ')}
        </Text>
      </View>

      <WordGrid words={words} cellHeight={80} />

      <View className="flex-1 gap-4">
        <Text className="text-center text-xs font-bold uppercase text-white/40">
          {t(`${NS.DECRYPTO}.writeAssociations`)}
        </Text>
        {currentCode.map((num, i) => (
          <View key={i} className="flex-row items-center gap-4">
            <View
              className={`rounded-premium-xs h-8 w-8 shrink-0 items-center justify-center ${tBadge(activeTeam)}`}
            >
              <Text className={`font-black ${tText(activeTeam)}`}>{num}</Text>
            </View>
            <TextInput
              value={clues[i]}
              onChangeText={(text) => {
                const c = [...clues];
                c[i] = text;
                onChange(c);
              }}
              placeholder={t(`${NS.DECRYPTO}.associationFor`, { word: words[num - 1] })}
              className="h-12 flex-1 text-sm"
            />
          </View>
        ))}
        <PrimaryButton
          onClick={onSubmit}
          variant={activeTeam}
          disabled={clues.some((c) => c.trim() === '')}
          className="mt-2"
        >
          {t(`${NS.DECRYPTO}.encrypt`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
