import { Ghost, MapPin, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import {
  RoleRevealButton,
  RoleRevealCard,
  RoleRevealPanel,
} from '@/features/role-distribution/components/RoleRevealCard';
import { SPY_HUNT_ROLE_IDS } from '@/games/SpyHuntGame/constants.ts';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { ROLE_TOKENS } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface RoleDistributionProps {
  players: Player[];
  location: string;
  onFinish: () => void;
}

export const RoleDistribution: React.FC<RoleDistributionProps> = ({
  players,
  location,
  onFinish,
}) => {
  const { t } = useTranslation();
  const { difficulty } = useGameSettings();

  return (
    <DistributionFlow
      players={players}
      onFinish={onFinish}
      activeColor="bg-premium-green"
      getCardStyle={() => {
        return {
          className: 'min-h-[28rem]',
          style: {
            border: ROLE_TOKENS.agent.cardBorder,
            boxShadow: ROLE_TOKENS.agent.cardShadow,
          },
        };
      }}
      renderCard={(player, isLast, onNext) => {
        const roleType = player.isSpy
          ? 'spy'
          : player.role === SPY_HUNT_ROLE_IDS.TRAITOR
            ? 'traitor'
            : 'agent';
        return (
          <RoleRevealCard
            gradientClassName="from-premium-green/[0.15] via-premium-green/[0.05] bg-gradient-to-b to-black/70"
            glowClassName="-top-24 opacity-60"
            glowColor={ROLE_TOKENS.agent.topGlow}
          >
            {/* ── SPY ── */}
            {roleType === 'spy' && (
              <RoleRevealPanel>
                <div className="text-center">
                  <Typography.Caption color="green" className="tracking-[0.45em] opacity-50">
                    {t(`${NS.SPY_HUNT}.secretRole`)}
                  </Typography.Caption>
                  <Typography.Title color="muted" className="mt-0.5">
                    {player.name}
                  </Typography.Title>
                </div>

                <div className="space-y-3 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Ghost
                      className="text-premium-green mx-auto h-[88px] w-[88px]"
                      style={{ filter: ROLE_TOKENS.agent.iconFilter }}
                    />
                  </motion.div>
                  <Typography.Display size="lg" color="green" glow align="center">
                    {t(`${NS.SPY_HUNT}.spy`)}
                  </Typography.Display>
                  <Typography.Body size="xs" color="dimmer" align="center">
                    {t(`${NS.SPY_HUNT}.locationUnknown`)}
                    <br />
                    {t(`${NS.SPY_HUNT}.dontRevealFindLocation`)}
                  </Typography.Body>
                  {difficulty === DIFFICULTY.EASY && (
                    <div className="bg-premium-green/10 border-premium-green/20 rounded-premium-md border px-4 py-2">
                      <Typography.Caption size="xs" color="green" className="mb-0.5 opacity-55">
                        {t(`${NS.SPY_HUNT}.hintLabel`)}
                      </Typography.Caption>
                      <p className="text-premium-green text-xs font-black">
                        {t(`${NS.SPY_HUNT}.lettersInName`, { n: location.length })}
                      </p>
                    </div>
                  )}
                </div>

                <RoleRevealButton
                  onClick={onNext}
                  colorClassName="bg-premium-green text-black"
                  style={{ boxShadow: ROLE_TOKENS.agent.btnShadow }}
                >
                  {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                </RoleRevealButton>
              </RoleRevealPanel>
            )}

            {/* ── TRAITOR ── */}
            {roleType === 'traitor' && (
              <RoleRevealPanel>
                <div className="text-center">
                  <Typography.Caption color="green" className="tracking-[0.45em] opacity-50">
                    {t(`${NS.SPY_HUNT}.secretRole`)}
                  </Typography.Caption>
                  <Typography.Title color="muted" className="mt-0.5">
                    {player.name}
                  </Typography.Title>
                </div>

                <div className="space-y-4 text-center">
                  <Shield
                    className="text-premium-green mx-auto h-[72px] w-[72px]"
                    style={{ filter: ROLE_TOKENS.agent.iconFilter }}
                  />
                  <Typography.Display size="md" color="green" glow align="center">
                    {t(`${NS.SPY_HUNT}.traitor`)}
                  </Typography.Display>
                  <div className="bg-premium-green/10 border-premium-green/20 rounded-premium-md border px-4 py-3">
                    <Typography.Caption size="xs" color="dimmer" className="mb-1">
                      {t(`${NS.SPY_HUNT}.yourLocation`)}
                    </Typography.Caption>
                    <Typography.Heading size="sm" color="green" align="center">
                      {location}
                    </Typography.Heading>
                  </div>
                  <Typography.Caption color="dimmer">
                    {t(`${NS.SPY_HUNT}.helpSpyConfuseOthers`)}
                  </Typography.Caption>
                </div>

                <RoleRevealButton
                  onClick={onNext}
                  colorClassName="bg-premium-green text-black"
                  style={{ boxShadow: ROLE_TOKENS.agent.btnShadow }}
                >
                  {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                </RoleRevealButton>
              </RoleRevealPanel>
            )}

            {/* ── AGENT ── */}
            {roleType === 'agent' && (
              <RoleRevealPanel>
                <div className="text-center">
                  <Typography.Caption color="green" className="tracking-[0.45em] opacity-50">
                    {t(`${NS.SPY_HUNT}.agentLabel`)}
                  </Typography.Caption>
                  <Typography.Title color="muted" className="mt-0.5">
                    {player.name}
                  </Typography.Title>
                </div>

                <div className="space-y-4 text-center">
                  <MapPin
                    className="text-premium-green mx-auto h-[72px] w-[72px]"
                    style={{ filter: ROLE_TOKENS.agent.iconFilter }}
                  />
                  <div className="space-y-1">
                    <Typography.Caption color="green" className="tracking-[0.35em] opacity-50">
                      {t(`${NS.SPY_HUNT}.secretLocation`)}
                    </Typography.Caption>
                    <h3
                      className="leading-tight font-black tracking-tighter wrap-break-word text-white uppercase italic"
                      style={{
                        textShadow: ROLE_TOKENS.agent.textShadow,
                        fontSize: 'clamp(22px, 9vw, 40px)',
                      }}
                    >
                      {location}
                    </h3>
                  </div>
                  <div className="bg-premium-green/10 border-premium-green/20 rounded-premium-md border px-4 py-3">
                    <Typography.Caption size="xs" color="dimmer" className="mb-1">
                      {t(`${NS.SPY_HUNT}.yourRole`)}
                    </Typography.Caption>
                    <Typography.Heading size="sm" color="green">
                      {player.role}
                    </Typography.Heading>
                  </div>
                  <Typography.Caption color="dimmer">
                    {t(`${NS.SPY_HUNT}.findSpy`)}
                  </Typography.Caption>
                </div>

                <RoleRevealButton
                  onClick={onNext}
                  colorClassName="bg-premium-green text-black"
                  style={{ boxShadow: ROLE_TOKENS.agent.btnShadow }}
                >
                  {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                </RoleRevealButton>
              </RoleRevealPanel>
            )}
          </RoleRevealCard>
        );
      }}
    />
  );
};
