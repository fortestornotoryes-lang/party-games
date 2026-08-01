import type { LucideIcon } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { tBadge, tBg, teamLabel, tText } from '../helpers';
import type { TeamColor, TeamState } from '../types';

import { ScoreRow } from './ScoreRow';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface PassScreenProps {
  icon: LucideIcon;
  team: TeamColor;
  subtitle: string;
  buttonLabel: string;
  onContinue: () => void;
  red: TeamState;
  blue: TeamState;
  children?: React.ReactNode;
}

export const PassScreen: React.FC<PassScreenProps> = ({
  icon: Icon,
  team,
  subtitle,
  buttonLabel,
  onContinue,
  red,
  blue,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex-1 items-center justify-center gap-6"
    >
      <View className={`rounded-premium-md items-center border p-8 ${tBg(team)}`}>
        <Icon size={96} color={rgba(team, 1)} />
      </View>

      {children ?? (
        <View className={`rounded-full px-5 py-2 ${tBadge(team)}`}>
          <Text className={`text-sm font-black uppercase ${tText(team)}`}>
            {t(`${NS.DECRYPTO}.teamToDative`, { name: teamLabel(team, t) })}
          </Text>
        </View>
      )}

      <ScoreRow red={red} blue={blue} />

      <View className="w-full gap-3">
        <PrimaryButton onClick={onContinue} variant={team} className="h-16">
          {buttonLabel}
        </PrimaryButton>
        <Text className="text-tag text-center font-bold uppercase text-white/25">{subtitle}</Text>
      </View>
    </MotiView>
  );
};
