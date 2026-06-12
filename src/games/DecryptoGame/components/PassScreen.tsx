import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { tBadge, tBg, teamLabel, tGlow, tText } from '../helpers';
import type { TeamColor, TeamState } from '../types';

import { ScoreRow } from './ScoreRow';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
    >
      <div className={`rounded-premium-md p-8 ${tBg(team)} border shadow-2xl`}>
        <Icon className={`h-24 w-24 ${tText(team)} ${tGlow(team)}`} />
      </div>

      {children ?? (
        <span
          className={`rounded-full px-5 py-2 text-sm font-black tracking-widest uppercase ${tBadge(team)}`}
        >
          {t(`${NS.DECRYPTO}.teamToDative`, { name: teamLabel(team, t) })}
        </span>
      )}

      <ScoreRow red={red} blue={blue} />

      <div className="w-full space-y-3">
        <PrimaryButton
          onClick={onContinue}
          variant={team}
          className="h-16 w-full text-lg tracking-widest"
        >
          {buttonLabel}
        </PrimaryButton>
        <p className="text-tag animate-pulse font-bold text-white/25 uppercase">{subtitle}</p>
      </div>
    </motion.div>
  );
};
