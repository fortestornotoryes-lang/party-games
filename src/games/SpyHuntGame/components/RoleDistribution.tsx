import React from 'react';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import { SPY_HUNT_ROLE_IDS } from '@/games/SpyHuntGame/constants.ts';
import { SecretDetail, SecretWordCard } from '@/shared/components/SecretWordCard';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { DIFFICULTY } from '@/shared/types';

interface RoleDistributionProps {
  players: Player[];
  location: string;
  onFinish: () => void;
}

/** Цвет раздачи — один для всех ролей, чтобы экран не выдавал шпиона */
const ACCENT = 'green';

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
      passAccentColor={ACCENT}
      getCardStyle={() => ({ bare: true })}
      renderCard={(player, isLast, onNext) => {
        const roleType = player.isSpy
          ? 'spy'
          : player.role === SPY_HUNT_ROLE_IDS.TRAITOR
            ? 'traitor'
            : 'agent';
        const doneLabel = isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`);

        // Все роли — одна и та же карточка «держи палец»: отличается только скрытое содержимое
        const secret = {
          spy: {
            word: t(`${NS.SPY_HUNT}.spy`),
            details: (
              <div className="space-y-3">
                <Typography.Body size="sm" color="muted">
                  {t(`${NS.SPY_HUNT}.locationUnknown`)} {t(`${NS.SPY_HUNT}.dontRevealFindLocation`)}
                </Typography.Body>
                {difficulty === DIFFICULTY.EASY && (
                  <SecretDetail
                    label={t(`${NS.SPY_HUNT}.hintLabel`)}
                    value={t(`${NS.SPY_HUNT}.lettersInName`, { n: location.length })}
                    accent={ACCENT}
                  />
                )}
              </div>
            ),
          },
          traitor: {
            word: t(`${NS.SPY_HUNT}.traitor`),
            details: (
              <div className="space-y-3">
                <SecretDetail
                  label={t(`${NS.SPY_HUNT}.yourLocation`)}
                  value={location}
                  accent={ACCENT}
                />
                <Typography.Body size="sm" color="muted">
                  {t(`${NS.SPY_HUNT}.helpSpyConfuseOthers`)}
                </Typography.Body>
              </div>
            ),
          },
          agent: {
            word: location,
            details: (
              <div className="space-y-3">
                <SecretDetail
                  label={t(`${NS.SPY_HUNT}.yourRole`)}
                  value={player.role}
                  accent={ACCENT}
                />
                <Typography.Body size="sm" color="muted">
                  {t(`${NS.SPY_HUNT}.findSpy`)}
                </Typography.Body>
              </div>
            ),
          },
        }[roleType];

        return (
          <SecretWordCard
            playerName={player.name}
            label={t(`${NS.COMMON}.secretCard`)}
            word={secret.word}
            details={secret.details}
            accent={ACCENT}
            doneLabel={doneLabel}
            onDone={onNext}
          />
        );
      }}
    />
  );
};
