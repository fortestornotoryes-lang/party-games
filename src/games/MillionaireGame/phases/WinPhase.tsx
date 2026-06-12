import confetti from 'canvas-confetti';
import { ChevronRight, Star, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect } from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface WinPhaseProps {
  currentPlayer: string;
  prize: string;
  playerScores: Record<string, string>;
  onNextPlayer: () => void;
}

export const WinPhase: React.FC<WinPhaseProps> = ({
  currentPlayer,
  prize,
  playerScores,
  onNextPlayer,
}) => {
  const { t } = useTranslation();
  const isMillion = prize === '1 000 000';

  useEffect(() => {
    if (isMillion) {
      const shoot = () =>
        confetti({
          particleCount: 120,
          spread: 110,
          origin: { y: 0.2 },
          colors: ['#FFCC1F', '#FFD700', '#fff', '#FFA500'],
          gravity: 0.9,
        });
      shoot();
      const t1 = setTimeout(shoot, 400);
      const t2 = setTimeout(shoot, 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.25 },
        colors: ['#00D88A', '#FFCC1F', '#fff'],
        gravity: 1.1,
      });
    }
  }, [isMillion]);

  return (
    <motion.div
      key="win"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col items-center justify-between overflow-y-auto p-6"
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-5">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative"
        >
          <div
            className={`flex h-28 w-28 items-center justify-center rounded-full border-2 ${
              isMillion
                ? 'bg-premium-yellow/20 border-premium-yellow/50'
                : 'bg-premium-green/12 border-premium-green/40'
            }`}
            style={{
              boxShadow: isMillion
                ? '0 0 60px rgba(255,204,31,0.4)'
                : '0 0 40px rgba(0,216,138,0.3)',
            }}
          >
            <Trophy
              className={`h-14 w-14 ${isMillion ? 'text-premium-yellow' : 'text-premium-green'}`}
            />
          </div>

          {/* Expanding rings for million */}
          {!!isMillion &&
            [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{ duration: 1.4, delay: i * 0.3, repeat: Infinity }}
                className="border-premium-yellow/25 absolute inset-0 rounded-full border"
              />
            ))}
        </motion.div>

        {/* Prize display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <p className="text-tag mb-1 font-black tracking-[0.3em] text-white/35 uppercase">
            {isMillion ? t(`${NS.MILLIONAIRE}.millionaireLabel`) : t(`${NS.MILLIONAIRE}.wonLabel`)}
          </p>
          <p className="text-label mb-2 font-bold text-white/65">{currentPlayer}</p>
          <p
            className={`font-display leading-none font-black tracking-tighter italic ${
              isMillion ? 'text-premium-yellow text-5xl' : 'text-premium-green text-5xl'
            }`}
            style={{
              textShadow: isMillion
                ? '0 0 50px rgba(255,204,31,0.55)'
                : '0 0 30px rgba(0,216,138,0.4)',
            }}
          >
            {prize}
          </p>
          {!!isMillion && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-label text-premium-yellow/50 mt-2 font-black tracking-[0.3em] uppercase"
            >
              {t(`${NS.MILLIONAIRE}.congratulations`)}
            </motion.p>
          )}
        </motion.div>

        {/* Scoreboard */}
        {Object.keys(playerScores).length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card rounded-premium-lg w-full p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <Star className="text-premium-yellow h-3.5 w-3.5" />
              <span className="text-tag font-black tracking-[0.22em] text-white/35 uppercase">
                {t(`${NS.COMMON}.score`)}
              </span>
            </div>
            <div className="space-y-2">
              {Object.entries(playerScores)
                .sort(
                  (a, b) =>
                    parseFloat(b[1].replace(/\D/g, '')) - parseFloat(a[1].replace(/\D/g, ''))
                )
                .map(([name, score], i) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-tag w-4 font-black text-white/20">{i + 1}</span>
                      <span
                        className={`text-label font-semibold ${
                          name === currentPlayer ? 'text-premium-yellow' : 'text-white/60'
                        }`}
                      >
                        {name}
                      </span>
                    </div>
                    <span
                      className={`text-label font-black ${
                        name === currentPlayer ? 'text-premium-yellow' : 'text-white/40'
                      }`}
                    >
                      {score}
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Next player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full pt-4"
      >
        <PrimaryButton variant="white" icon={ChevronRight} onClick={onNextPlayer}>
          {t(`${NS.MILLIONAIRE}.nextPlayer`)}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
