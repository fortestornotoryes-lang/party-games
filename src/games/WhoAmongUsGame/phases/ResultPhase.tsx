import { Crown } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { RESULT_TIMING } from '../constants';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { EASE_OUT_EXPO, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

interface ResultPhaseProps {
  question: string;
  players: string[];
  counts: Record<string, number>;
  topPlayers: string[];
  onNext: () => void;
}

/** Итоги голосования: полосы растут по очереди, затем «впечатываются» лидеры с короной. */
export const ResultPhase: React.FC<ResultPhaseProps> = ({
  question,
  players,
  counts,
  topPlayers,
  onNext,
}) => {
  const { t } = useTranslation();
  const { barsStart, barStep, barDuration } = RESULT_TIMING;
  const maxCount = Math.max(1, ...Object.values(counts));
  const sortedByVotes = [...players].sort((a, b) => counts[b] - counts[a]);
  // Лидеры объявляются, когда дорастёт полоса первого места (она стартует первой)
  const leadersDelay = barsStart + barDuration * 0.7;
  const buttonDelay = barsStart + sortedByVotes.length * barStep + barDuration * 0.5;

  return (
    <>
      <div className="space-y-2 text-center">
        <motion.div variants={STAGGER_ITEM}>
          <Typography.Caption className="tracking-[0.3em]">{question}</Typography.Caption>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING.pop, delay: leadersDelay }}
        >
          <Typography.Display size="sm" align="center">
            {t(`${NS.WHO_AMONG_US}.topPlayers`)}: {topPlayers.join(', ') || '—'}
          </Typography.Display>
        </motion.div>
      </div>

      <motion.div variants={STAGGER_ITEM} className="glass-card rounded-premium-xl space-y-3 p-4">
        {sortedByVotes.map((p, i) => {
          const isTop = topPlayers.includes(p);
          const barDelay = barsStart + i * barStep;
          return (
            <div key={p} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-1.5">
                  {isTop ? (
                    <motion.span
                      className="flex shrink-0"
                      initial={{ scale: 0, rotate: -45, y: -10 }}
                      animate={{ scale: 1, rotate: 0, y: 0 }}
                      transition={{ ...SPRING.pop, delay: leadersDelay + 0.1 }}
                    >
                      <Crown className="text-premium-yellow h-4 w-4" />
                    </motion.span>
                  ) : null}
                  <span className={`min-w-0 wrap-anywhere ${isTop ? 'font-black text-white' : ''}`}>
                    {p}
                  </span>
                </span>
                <motion.span
                  className="shrink-0 font-bold"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING.soft, delay: barDelay + barDuration * 0.5 }}
                >
                  {t(`${NS.WHO_AMONG_US}.votesCount`, { n: counts[p] })}
                </motion.span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="bg-premium-pink relative h-2 overflow-hidden rounded-full"
                  style={isTop ? { boxShadow: `0 0 12px ${rgba('pink', 0.7)}` } : undefined}
                  initial={{ width: 0 }}
                  animate={{ width: `${(counts[p] / maxCount) * 100}%` }}
                  transition={{ duration: barDuration, delay: barDelay, ease: EASE_OUT_EXPO }}
                >
                  {/* Блик, пробегающий по полосе лидера */}
                  {isTop ? (
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 w-8"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                      }}
                      initial={{ left: '-30%' }}
                      animate={{ left: '120%' }}
                      transition={{
                        duration: 1.2,
                        delay: leadersDelay + 0.3,
                        repeat: Infinity,
                        repeatDelay: 1.6,
                      }}
                    />
                  ) : null}
                </motion.div>
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        className="mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: buttonDelay }}
      >
        <PrimaryButton onClick={onNext}>
          {t(`${NS.WHO_AMONG_US}.nextRound`)}
        </PrimaryButton>
      </motion.div>
    </>
  );
};
