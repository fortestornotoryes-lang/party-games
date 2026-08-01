import { Shield, Skull } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import {
  RoleRevealButton,
  RoleRevealCard,
  RoleRevealPanel,
} from '@/features/role-distribution/components/RoleRevealCard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  players: Player[];
  onFinish: () => void;
}

// Цвета ролей: шпионы — красный #ef4444, сопротивление — синий (PREMIUM blue)
const SPY_RGB = '239,68,68';
const RES_RGB = '63,123,255';

export const ResistanceDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const { t } = useTranslation();
  const spyNames = players.filter((p) => p.isSpy).map((p) => p.name);

  return (
    <DistributionFlow
      players={players}
      onFinish={onFinish}
      activeColor="bg-premium-blue"
      passAccentColor="blue"
      getCardStyle={(player) => {
        const rgb = player.isSpy ? SPY_RGB : RES_RGB;
        return {
          style: {
            minHeight: 448,
            borderWidth: 1.5,
            borderColor: `rgba(${rgb},${player.isSpy ? 0.4 : 0.35})`,
            shadowColor: `rgba(${rgb},0.4)`,
            shadowOpacity: 1,
            shadowRadius: 40,
            shadowOffset: { width: 0, height: 0 },
            elevation: 12,
          },
        };
      }}
      renderCard={(player, isLast, onNext) => (
        <RoleRevealCard
          gradientColors={
            player.isSpy
              ? [`rgba(${SPY_RGB},0.2)`, `rgba(${SPY_RGB},0.05)`, 'rgba(0,0,0,0.7)']
              : [`rgba(${RES_RGB},0.18)`, `rgba(${RES_RGB},0.05)`, 'rgba(0,0,0,0.7)']
          }
          glowColor={player.isSpy ? `rgba(${SPY_RGB},0.25)` : `rgba(${RES_RGB},0.2)`}
        >
          {player.isSpy ? (
            <RoleRevealPanel>
              <View className="items-center">
                <Text
                  className="text-micro text-premium-red/50 font-black uppercase"
                  style={{ letterSpacing: 3.6 }}
                >
                  {t(`${NS.RESISTANCE}.secretRole`)}
                </Text>
                <Text className="mt-0.5 text-lg font-black italic text-white/50">
                  {player.name}
                </Text>
              </View>

              <View className="items-center gap-4">
                <Skull size={72} color={`rgba(${SPY_RGB},1)`} />
                <Text
                  className="text-premium-red text-center font-black italic"
                  style={{
                    fontSize: 48,
                    lineHeight: 50,
                    letterSpacing: -1.9,
                    textShadowColor: `rgba(${SPY_RGB},0.4)`,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 20,
                  }}
                >
                  {t(`${NS.RESISTANCE}.spyRole`)}
                </Text>
                <View className="bg-premium-red/10 border-premium-red/20 rounded-premium-md items-center border px-4 py-3">
                  <Text className="text-micro text-premium-red/50 mb-1 font-black uppercase">
                    {t(`${NS.RESISTANCE}.allies`)}
                  </Text>
                  <Text className="text-center text-sm font-black italic text-white">
                    {spyNames.filter((n) => n !== player.name).join(', ') ||
                      t(`${NS.RESISTANCE}.youAlone`)}
                  </Text>
                </View>
                <Text className="text-tag text-center text-white/25" style={{ lineHeight: 18 }}>
                  {t(`${NS.RESISTANCE}.spyHint`)}
                </Text>
              </View>

              <RoleRevealButton
                onClick={onNext}
                colorClassName="bg-premium-red"
                textClassName="text-white"
              >
                {isLast ? t(`${NS.RESISTANCE}.startGame`) : t(`${NS.RESISTANCE}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          ) : (
            <RoleRevealPanel>
              <View className="items-center">
                <Text
                  className="text-micro text-premium-blue/50 font-black uppercase"
                  style={{ letterSpacing: 3.6 }}
                >
                  {t(`${NS.RESISTANCE}.roleLabel`)}
                </Text>
                <Text className="mt-0.5 text-lg font-black italic text-white/50">
                  {player.name}
                </Text>
              </View>

              <View className="items-center gap-4">
                <Shield size={72} color={`rgba(${RES_RGB},1)`} />
                <Text
                  className="text-premium-blue text-center font-black italic"
                  style={{
                    fontSize: 48,
                    lineHeight: 50,
                    letterSpacing: -1.9,
                    textShadowColor: `rgba(${RES_RGB},0.35)`,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 18,
                  }}
                >
                  {t(`${NS.RESISTANCE}.resistanceRole`)}
                </Text>
                <Text className="text-tag text-center text-white/25" style={{ lineHeight: 18 }}>
                  {t(`${NS.RESISTANCE}.resistanceHint`)}
                </Text>
              </View>

              <RoleRevealButton
                onClick={onNext}
                colorClassName="bg-premium-blue"
                textClassName="text-white"
              >
                {isLast ? t(`${NS.RESISTANCE}.startGame`) : t(`${NS.RESISTANCE}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          )}
        </RoleRevealCard>
      )}
    />
  );
};
