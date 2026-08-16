import { Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface SetupPhaseProps {
  redCaptain: string;
  blueCaptain: string;
  redTeam: string[];
  blueTeam: string[];
  onPlay: () => void;
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  redCaptain,
  blueCaptain,
  redTeam,
  blueTeam,
  onPlay,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="setup"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 justify-center gap-6"
    >
      <Typography.Title align="center" color="green" className="mb-6">
        {t(`${NS.COMMON}.teams`)}
      </Typography.Title>

      <View className="justify-center gap-4">
        <View className="bg-premium-red/10 border-premium-red/30 rounded-premium-md items-center border p-4">
          <View className="mb-2 flex-row items-center gap-2">
            <Users size={20} color={rgba('red', 1)} />
            <Text className="text-xs font-bold uppercase text-white">
              {t(`${NS.CODENAMES}.redTeam`)}
            </Text>
          </View>
          <View className="border-premium-red/20 mb-2 w-full items-center border-b pb-2">
            <Text className="text-premium-red/50 text-xs uppercase">
              {t(`${NS.CODENAMES}.captain`)}
            </Text>
            <Text className="font-bold text-white">{redCaptain}</Text>
          </View>
          <Text className="text-premium-red/70 text-center text-sm opacity-80">
            {redTeam.join(', ')}
          </Text>
        </View>

        <Text className="text-center text-4xl font-black uppercase text-white/40">
          {t(`${NS.COMMON}.vs`)}
        </Text>

        <View className="bg-premium-blue/10 border-premium-blue/30 rounded-premium-md items-center border p-4">
          <View className="mb-2 flex-row items-center gap-2">
            <Users size={20} color={rgba('blue', 1)} />
            <Text className="text-xs font-bold uppercase text-white">
              {t(`${NS.CODENAMES}.blueTeam`)}
            </Text>
          </View>
          <View className="border-premium-blue/20 mb-2 w-full items-center border-b pb-2">
            <Text className="text-premium-blue/50 text-xs uppercase">
              {t(`${NS.CODENAMES}.captain`)}
            </Text>
            <Text className="font-bold text-white">{blueCaptain}</Text>
          </View>
          <Text className="text-premium-blue/70 text-center text-sm opacity-80">
            {blueTeam.join(', ')}
          </Text>
        </View>
      </View>

      <View className="mt-8">
        <PrimaryButton onClick={onPlay} variant="emerald">
          {t(`${NS.CODENAMES}.play`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
