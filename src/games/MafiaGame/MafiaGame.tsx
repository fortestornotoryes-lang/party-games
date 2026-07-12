import { Moon, Shield, Sun, Users } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  playerNames: string[];
  onBack: () => void;
}

export default function MafiaGame({ playerNames, onBack }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-premium-lg bg-premium-orange/20 border-premium-orange/40 text-premium-orange flex h-20 w-20 items-center justify-center border shadow-2xl"
      >
        <Users className="h-10 w-10" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">
          {t('registry.games.mafia.title')}
        </h2>
        <p className="text-tag font-bold tracking-[0.2em] text-white/30 uppercase">
          {t(`${NS.MAFIA}.cityFallsAsleep`)}
        </p>
      </div>

      <div className="rounded-premium-lg w-full max-w-sm space-y-6 border border-white/10 bg-white/5 p-8">
        <div className="flex justify-center gap-4">
          <Sun className="text-premium-yellow h-6 w-6" />
          <Moon className="text-premium-purple h-6 w-6" />
          <Shield className="text-premium-blue h-6 w-6" />
        </div>
        <p className="text-sm leading-relaxed text-white/40">{t(`${NS.MAFIA}.inDevelopment`)}</p>
      </div>

      <button
        onClick={onBack}
        className="rounded-premium-md bg-white px-10 py-4 font-black tracking-widest text-black uppercase shadow-xl transition-all active:scale-95"
      >
        {t(`${NS.MAFIA}.goBack`)}
      </button>
    </div>
  );
}
