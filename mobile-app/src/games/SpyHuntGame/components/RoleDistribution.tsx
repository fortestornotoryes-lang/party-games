import { Ghost, MapPin, Shield } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import {
  RoleRevealButton,
  RoleRevealCard,
  RoleRevealPanel,
} from '@/features/role-distribution/components/RoleRevealCard';
import { SPY_HUNT_ROLE_IDS } from '@/games/SpyHuntGame/constants';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface RoleDistributionProps {
  players: Player[];
  location: string;
  onFinish: () => void;
}

/** Шапка карточки роли: подпись + имя игрока */
const RoleHeader: React.FC<{ caption: string; name: string }> = ({ caption, name }) => (
  <View className="items-center">
    <Typography.Caption color="green" className="opacity-50" style={{ letterSpacing: 3.6 }}>
      {caption}
    </Typography.Caption>
    <Typography.Title color="muted" className="mt-0.5">
      {name}
    </Typography.Title>
  </View>
);

export const RoleDistribution: React.FC<RoleDistributionProps> = ({
  players,
  location,
  onFinish,
}) => {
  const { t } = useTranslation();
  const { difficulty } = useGameConfig();

  const nextLabel = (isLast: boolean) =>
    isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`);

  return (
    <DistributionFlow
      players={players}
      onFinish={onFinish}
      activeColor="bg-premium-green"
      getCardStyle={() => ({
        style: {
          minHeight: 448,
          borderWidth: 1.5,
          borderColor: rgba('green', 0.32),
          shadowColor: rgba('green', 0.4),
          shadowOpacity: 1,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: 0 },
          elevation: 12,
        },
      })}
      renderCard={(player, isLast, onNext) => {
        const roleType = player.isSpy
          ? 'spy'
          : player.role === SPY_HUNT_ROLE_IDS.TRAITOR
            ? 'traitor'
            : 'agent';
        return (
          <RoleRevealCard
            gradientColors={[rgba('green', 0.15), rgba('green', 0.05), 'rgba(0,0,0,0.7)']}
            glowColor={rgba('green', 0.18)}
          >
            {/* ── ШПИОН ── */}
            {roleType === 'spy' && (
              <RoleRevealPanel>
                <RoleHeader caption={t(`${NS.SPY_HUNT}.secretRole`)} name={player.name} />

                <View className="items-center gap-3">
                  <MotiView
                    from={{ scale: 1 }}
                    animate={{ scale: 1.06 }}
                    transition={{ type: 'timing', duration: 1250, loop: true }}
                  >
                    <Ghost size={88} color={rgba('green', 1)} />
                  </MotiView>
                  <Typography.Display size="lg" color="green" glow align="center">
                    {t(`${NS.SPY_HUNT}.spy`)}
                  </Typography.Display>
                  <Typography.Body size="xs" color="dimmer" align="center">
                    {t(`${NS.SPY_HUNT}.locationUnknown`)}
                    {'\n'}
                    {t(`${NS.SPY_HUNT}.dontRevealFindLocation`)}
                  </Typography.Body>
                  {difficulty === DIFFICULTY.EASY && (
                    <View className="bg-premium-green/10 border-premium-green/20 rounded-premium-md items-center border px-4 py-2">
                      <Typography.Caption size="xs" color="green" className="mb-0.5 opacity-55">
                        {t(`${NS.SPY_HUNT}.hintLabel`)}
                      </Typography.Caption>
                      <Text className="text-premium-green text-xs font-black">
                        {t(`${NS.SPY_HUNT}.lettersInName`, { n: location.length })}
                      </Text>
                    </View>
                  )}
                </View>

                <RoleRevealButton onClick={onNext} colorClassName="bg-premium-green">
                  {nextLabel(isLast)}
                </RoleRevealButton>
              </RoleRevealPanel>
            )}

            {/* ── КРОТ ── */}
            {roleType === 'traitor' && (
              <RoleRevealPanel>
                <RoleHeader caption={t(`${NS.SPY_HUNT}.secretRole`)} name={player.name} />

                <View className="items-center gap-4">
                  <Shield size={72} color={rgba('green', 1)} />
                  <Typography.Display size="md" color="green" glow align="center">
                    {t(`${NS.SPY_HUNT}.traitor`)}
                  </Typography.Display>
                  <View className="bg-premium-green/10 border-premium-green/20 rounded-premium-md items-center border px-4 py-3">
                    <Typography.Caption size="xs" color="dimmer" className="mb-1">
                      {t(`${NS.SPY_HUNT}.yourLocation`)}
                    </Typography.Caption>
                    <Typography.Heading size="sm" color="green" align="center">
                      {location}
                    </Typography.Heading>
                  </View>
                  <Typography.Caption color="dimmer" align="center">
                    {t(`${NS.SPY_HUNT}.helpSpyConfuseOthers`)}
                  </Typography.Caption>
                </View>

                <RoleRevealButton onClick={onNext} colorClassName="bg-premium-green">
                  {nextLabel(isLast)}
                </RoleRevealButton>
              </RoleRevealPanel>
            )}

            {/* ── АГЕНТ ── */}
            {roleType === 'agent' && (
              <RoleRevealPanel>
                <RoleHeader caption={t(`${NS.SPY_HUNT}.agentLabel`)} name={player.name} />

                <View className="items-center gap-4">
                  <MapPin size={72} color={rgba('green', 1)} />
                  <View className="items-center gap-1">
                    <Typography.Caption color="green" className="opacity-50" style={{ letterSpacing: 2.8 }}>
                      {t(`${NS.SPY_HUNT}.secretLocation`)}
                    </Typography.Caption>
                    <Text
                      className="text-center font-black uppercase italic text-white"
                      style={{ fontSize: 32, lineHeight: 37, letterSpacing: -1.3 }}
                    >
                      {location}
                    </Text>
                  </View>
                  <View className="bg-premium-green/10 border-premium-green/20 rounded-premium-md items-center border px-4 py-3">
                    <Typography.Caption size="xs" color="dimmer" className="mb-1">
                      {t(`${NS.SPY_HUNT}.yourRole`)}
                    </Typography.Caption>
                    <Typography.Heading size="sm" color="green">
                      {player.role}
                    </Typography.Heading>
                  </View>
                  <Typography.Caption color="dimmer" align="center">
                    {t(`${NS.SPY_HUNT}.findSpy`)}
                  </Typography.Caption>
                </View>

                <RoleRevealButton onClick={onNext} colorClassName="bg-premium-green">
                  {nextLabel(isLast)}
                </RoleRevealButton>
              </RoleRevealPanel>
            )}
          </RoleRevealCard>
        );
      }}
    />
  );
};
