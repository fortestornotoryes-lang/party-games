import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { TeamColor, TeamState } from '../types';
import { tText, tBg, tBadge, tGlow, teamLabel } from '../helpers';
import { ScoreRow } from './ScoreRow';
import { useTranslation } from '@/i18n';
import { NS } from '@/i18n/keys';

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
      className="flex-1 flex flex-col items-center justify-center text-center gap-6"
    >
      <div className={`p-8 rounded-premium-md ${tBg(team)} border shadow-2xl`}>
        <Icon className={`w-24 h-24 ${tText(team)} ${tGlow(team)}`} />
      </div>

      {children ?? (
        <span
          className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest ${tBadge(team)}`}
        >
          {t(`${NS.DECRYPTO}.teamToDative`, { name: teamLabel(team, t) })}
        </span>
      )}

      <ScoreRow red={red} blue={blue} />

      <div className="w-full space-y-3">
        <PrimaryButton
          onClick={onContinue}
          variant={team}
          className="w-full h-16 text-lg tracking-widest"
        >
          {buttonLabel}
        </PrimaryButton>
        <p className="text-tag text-white/25 font-bold uppercase animate-pulse">{subtitle}</p>
      </div>
    </motion.div>
  );
};
