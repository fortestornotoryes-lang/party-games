import { Ghost, MapPin, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { DistributionFlow } from '@/components/DistributionFlow';
import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { Player } from '@/entities/player/types';
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
      activeColor="bg-premium-red"
      getCardStyle={(player) => {
        const roleType = player.isSpy
          ? 'spy'
          : player.role === SPY_HUNT_ROLE_IDS.TRAITOR
            ? 'traitor'
            : 'agent';
        return {
          className: 'min-h-[28rem]',
          style: {
            border: ROLE_TOKENS[roleType].cardBorder,
            boxShadow: ROLE_TOKENS[roleType].cardShadow,
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
          <>
            {/* Gradient bg */}
            <div
              className={`absolute inset-0 ${
                roleType === 'spy'
                  ? 'from-premium-red/[0.22] via-premium-red/[0.06] bg-gradient-to-b to-black/70'
                  : roleType === 'traitor'
                    ? 'from-premium-orange/20 via-premium-orange/[0.05] bg-gradient-to-b to-black/70'
                    : 'from-premium-green/[0.15] via-premium-green/[0.05] bg-gradient-to-b to-black/70'
              }`}
            />

            {/* Top glow */}
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
              style={{ background: ROLE_TOKENS[roleType].topGlow }}
            />

            <div className="relative z-10 flex flex-1 flex-col items-center p-7 text-center">
              {/* ── SPY ── */}
              {roleType === 'spy' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-full flex-1 flex-col items-center justify-between"
                >
                  <div className="text-center">
                    <Typography.Caption color="red" className="tracking-[0.45em] opacity-50">
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
                        className="text-premium-red mx-auto h-[88px] w-[88px]"
                        style={{ filter: ROLE_TOKENS.spy.iconFilter }}
                      />
                    </motion.div>
                    <Typography.Display size="lg" color="red" glow align="center">
                      {t(`${NS.SPY_HUNT}.spy`)}
                    </Typography.Display>
                    <Typography.Body size="xs" color="faint" align="center">
                      {t(`${NS.SPY_HUNT}.locationUnknown`)}
                      <br />
                      {t(`${NS.SPY_HUNT}.dontRevealFindLocation`)}
                    </Typography.Body>
                    {difficulty === DIFFICULTY.EASY && (
                      <div className="bg-premium-red/10 border-premium-red/20 rounded-premium-md border px-4 py-2">
                        <Typography.Caption size="xs" color="red" className="mb-0.5 opacity-55">
                          {t(`${NS.SPY_HUNT}.hintLabel`)}
                        </Typography.Caption>
                        <p className="text-premium-red text-xs font-black">
                          {t(`${NS.SPY_HUNT}.lettersInName`, { n: location.length })}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onNext}
                    className="bg-premium-red rounded-premium-md w-full py-4 font-black tracking-[0.2em] text-white uppercase transition-transform active:scale-95"
                    style={{ boxShadow: ROLE_TOKENS.spy.btnShadow }}
                  >
                    {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                  </button>
                </motion.div>
              )}

              {/* ── TRAITOR ── */}
              {roleType === 'traitor' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-full flex-1 flex-col items-center justify-between"
                >
                  <div className="text-center">
                    <Typography.Caption color="orange" className="tracking-[0.45em] opacity-50">
                      {t(`${NS.SPY_HUNT}.secretRole`)}
                    </Typography.Caption>
                    <Typography.Title color="muted" className="mt-0.5">
                      {player.name}
                    </Typography.Title>
                  </div>

                  <div className="space-y-4 text-center">
                    <Shield
                      className="text-premium-orange mx-auto h-[72px] w-[72px]"
                      style={{ filter: ROLE_TOKENS.traitor.iconFilter }}
                    />
                    <Typography.Display size="md" color="orange" glow align="center">
                      {t(`${NS.SPY_HUNT}.traitor`)}
                    </Typography.Display>
                    <div className="bg-premium-orange/10 border-premium-orange/20 rounded-premium-md border px-4 py-3">
                      <Typography.Caption size="xs" color="orange" className="mb-1 opacity-50">
                        {t(`${NS.SPY_HUNT}.yourLocation`)}
                      </Typography.Caption>
                      <Typography.Heading size="sm" align="center">
                        {location}
                      </Typography.Heading>
                    </div>
                    <Typography.Caption color="faint">
                      {t(`${NS.SPY_HUNT}.helpSpyConfuseOthers`)}
                    </Typography.Caption>
                  </div>

                  <button
                    onClick={onNext}
                    className="bg-premium-orange rounded-premium-md w-full py-4 font-black tracking-[0.2em] text-white uppercase transition-transform active:scale-95"
                    style={{ boxShadow: ROLE_TOKENS.traitor.btnShadow }}
                  >
                    {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                  </button>
                </motion.div>
              )}

              {/* ── AGENT ── */}
              {roleType === 'agent' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-full flex-1 flex-col items-center justify-between"
                >
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

                  <button
                    onClick={onNext}
                    className="bg-premium-green rounded-premium-md w-full py-4 font-black tracking-[0.2em] text-black uppercase transition-transform active:scale-95"
                    style={{ boxShadow: ROLE_TOKENS.agent.btnShadow }}
                  >
                    {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                  </button>
                </motion.div>
              )}
            </div>
          </>
        );
      }}
    />
  );
};
