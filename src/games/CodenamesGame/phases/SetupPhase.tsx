import { Users } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-1 flex-col justify-center space-y-6"
    >
      <Typography.Title
        className="mb-6 text-center text-2xl font-black tracking-widest uppercase"
        color="green"
      >
        {t(`${NS.COMMON}.teams`)}
      </Typography.Title>

      <div className="flex flex-col justify-center gap-4">
        <div className="bg-premium-red/10 border-premium-red/30 rounded-premium-md border p-4 text-center">
          <Typography.Heading className="mb-2 flex items-center gap-2 text-xs font-bold uppercase">
            <Users className="text-premium-red h-5 w-5" /> {t(`${NS.CODENAMES}.redTeam`)}
          </Typography.Heading>
          <p className="border-premium-red/20 mb-2 border-b pb-2 font-bold">
            <span className="text-premium-red/50 block text-xs uppercase">
              {t(`${NS.CODENAMES}.captain`)}
            </span>
            {redCaptain}
          </p>
          <p className="text-premium-red/70 text-sm opacity-80">{redTeam.join(', ')}</p>
        </div>

        <div className="animate-pulse bg-linear-to-b from-amber-300 via-orange-500 to-red-600 bg-clip-text text-center text-5xl font-black tracking-wider text-transparent uppercase drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
          {t(`${NS.COMMON}.vs`)}
        </div>

        <div className="bg-premium-blue/10 border-premium-blue/30 rounded-premium-md border p-4 text-center">
          <Typography.Heading className="mb-2 flex items-center gap-2 text-xs font-bold uppercase">
            <Users className="text-premium-blue h-5 w-5" /> {t(`${NS.CODENAMES}.blueTeam`)}
          </Typography.Heading>
          <p className="border-premium-blue/20 mb-2 border-b pb-2 font-bold">
            <span className="text-premium-blue/50 block text-xs uppercase">
              {t(`${NS.CODENAMES}.captain`)}
            </span>
            {blueCaptain}
          </p>
          <p className="text-premium-blue/70 text-sm opacity-80">{blueTeam.join(', ')}</p>
        </div>
      </div>

      <PrimaryButton onClick={onPlay} variant="emerald" className="mt-8">
        {t(`${NS.CODENAMES}.play`)}
      </PrimaryButton>
    </motion.div>
  );
};
