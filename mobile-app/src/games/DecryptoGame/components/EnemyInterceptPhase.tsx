import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { teamLabel, tText } from '../helpers';
import type { RoundData, TeamColor } from '../types';

import { CodeInput } from './CodeInput';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface EnemyInterceptPhaseProps {
  enemyHistory: RoundData[];
  clues: string[];
  interceptGuess: (number | '')[];
  wordCount: number;
  enemyColor: TeamColor;
  onChange: (v: (number | '')[]) => void;
  onSubmit: () => void;
}

export const EnemyInterceptPhase: React.FC<EnemyInterceptPhaseProps> = ({
  enemyHistory,
  clues,
  interceptGuess,
  wordCount,
  enemyColor,
  onChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="enemy_intercept"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 gap-4"
    >
      <Text
        className={`text-tag text-center font-black uppercase ${tText(enemyColor)}`}
        style={{ letterSpacing: 2 }}
      >
        {t(`${NS.DECRYPTO}.interceptTime`, { name: teamLabel(enemyColor, t) })}
      </Text>

      <View className="rounded-premium-sm border border-white/10 bg-white/5 p-4">
        <Text className="mb-2 text-xs font-bold uppercase text-white/30">
          {t(`${NS.DECRYPTO}.enemyCurrentClues`)}
        </Text>
        <View className="gap-1">
          {clues.map((c, i) => (
            <Text key={i} className="font-bold text-white">
              {i + 1}. {c}
            </Text>
          ))}
        </View>
      </View>

      {enemyHistory.length > 0 && (
        <View className="rounded-premium-sm border border-white/10 bg-white/5 p-4">
          <Text className="mb-2 text-xs font-bold uppercase text-white/30">
            {t(`${NS.DECRYPTO}.enemyHistory`)}
          </Text>
          <View className="gap-2">
            {enemyHistory.map((h, i) => (
              <Text key={i} className="text-xs text-white">
                <Text className="text-premium-purple font-bold">
                  {t(`${NS.DECRYPTO}.codeLabel`, { code: h.code.join('-') })}
                </Text>
                : {h.clues.join(', ')}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View className="mt-2 flex-1 gap-4">
        <Text className="text-tag text-center font-bold uppercase text-white/40">
          {t(`${NS.DECRYPTO}.enterInterceptedCode`)}
        </Text>
        <CodeInput value={interceptGuess} onChange={onChange} max={wordCount} team={enemyColor} />
        <PrimaryButton onClick={onSubmit} variant={enemyColor}>
          {t(`${NS.DECRYPTO}.confirmIntercept`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
