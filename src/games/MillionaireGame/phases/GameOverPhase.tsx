import { CheckCircle, ChevronRight, Star, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GameOverPhaseProps {
  currentPlayer: string;
  questionIndex: number;
  correctAnswer: string | undefined;
  guaranteed: string;
  playerScores: Record<string, string>;
  onNextPlayer: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  currentPlayer,
  questionIndex,
  correctAnswer,
  guaranteed,
  playerScores,
  onNextPlayer,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="gameover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col items-center justify-between overflow-y-auto p-6"
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-5">
        {/* Error icon with shake */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.15, 1], x: [0, -8, 8, -8, 8, 0] }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div
            className="bg-premium-red/12 border-premium-red/40 flex h-24 w-24 items-center justify-center rounded-full border-2"
            style={{ boxShadow: '0 0 40px rgba(255,46,77,0.2)' }}
          >
            <XCircle className="text-premium-red h-12 w-12" />
          </div>
        </motion.div>

        {/* Result info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="space-y-1 text-center"
        >
          <p className="text-tag text-premium-red/70 font-black tracking-[0.3em] uppercase">
            {t(`${NS.MILLIONAIRE}.wrong`)}
          </p>
          <p className="text-label font-bold text-white/65">{currentPlayer}</p>
          <p className="text-label text-white/30">
            {t(`${NS.MILLIONAIRE}.questionOf15`, { n: questionIndex + 1 })}
          </p>
        </motion.div>

        {/* Correct answer */}
        {!!correctAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="glass-card rounded-premium-lg w-full overflow-hidden"
            style={{ borderColor: 'rgba(0,216,138,0.25)' }}
          >
            <div className="via-premium-green/40 h-px bg-gradient-to-r from-transparent to-transparent" />
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle className="text-premium-green h-4 w-4" />
                <span className="text-tag text-premium-green font-black tracking-widest uppercase">
                  {t(`${NS.MILLIONAIRE}.correctAnswer`)}
                </span>
              </div>
              <p className="text-label text-center font-bold text-white">{correctAnswer}</p>
            </div>
          </motion.div>
        )}

        {/* Guaranteed amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="glass-card rounded-premium-lg w-full p-4 text-center"
        >
          <p className="text-tag mb-1 font-black tracking-[0.22em] text-white/30 uppercase">
            {t(`${NS.MILLIONAIRE}.guaranteedAmount`)}
          </p>
          <p className="font-display text-4xl leading-none font-black tracking-tighter text-white/55 italic">
            {guaranteed === '0' ? '0' : guaranteed}
          </p>
          {guaranteed === '0' && (
            <p className="text-tag mt-1 font-black tracking-wider text-white/20 uppercase">
              {t(`${NS.MILLIONAIRE}.nothingEarned`)}
            </p>
          )}
        </motion.div>

        {/* Scoreboard */}
        {Object.keys(playerScores).length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
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
                          name === currentPlayer ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {name}
                      </span>
                    </div>
                    <span
                      className={`text-label font-black ${
                        name === currentPlayer ? 'text-white/55' : 'text-white/35'
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
        transition={{ delay: 0.52 }}
        className="w-full pt-4"
      >
        <PrimaryButton variant="white" icon={ChevronRight} onClick={onNextPlayer}>
          {t(`${NS.MILLIONAIRE}.nextPlayer`)}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
