import { Check, HelpCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect } from 'react';

import { REVEAL_TIMING } from '../constants';
import { getRevealDelays } from '../helpers';

import { FlipCard } from '@/shared/components/FlipCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';
import { SHAKE_X, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

/** Через сколько после старта переворота карточка уже «лицом» — момент звука и тряски, с */
const FLIP_LANDING = 0.3;
const VOTER_STAGGER = 0.08;

interface RevealPhaseProps {
  statements: string[];
  lieIndex: number;
  storyteller: string;
  voters: string[];
  guesses: Record<string, number>;
  isLastRound: boolean;
  onNext: () => void;
}

/** Раскрытие: правды переворачиваются по очереди, ложь — последней, со вспышкой и тряской. */
export const RevealPhase: React.FC<RevealPhaseProps> = ({
  statements,
  lieIndex,
  storyteller,
  voters,
  guesses,
  isLastRound,
  onNext,
}) => {
  const { t } = useTranslation();
  const delays = getRevealDelays(statements.length, lieIndex);
  const lieDelay = delays[lieIndex];
  const resultsDelay = lieDelay + REVEAL_TIMING.resultsAfterLie;
  const fooledCount = voters.filter((v) => guesses[v] !== lieIndex).length;

  // Звук синхронно с переворотами: тик на каждую правду, «бззз» и вибрация на ложь
  useEffect(() => {
    const timers = delays.map((delay, i) =>
      window.setTimeout(
        () => {
          if (i === lieIndex) {
            feedbackService.playSound('error');
            feedbackService.vibrate(VIBRATE.error);
          } else {
            feedbackService.playSound('tick');
          }
        },
        (delay + FLIP_LANDING) * 1000
      )
    );
    return () => {
      timers.forEach((id) => {
        window.clearTimeout(id);
      });
    };
    // Последовательность играет один раз при открытии экрана
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Красная вспышка в момент раскрытия лжи */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: `radial-gradient(ellipse at center, ${rgba('red', 0.35)} 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.7, delay: lieDelay + FLIP_LANDING - 0.1, times: [0, 0.25, 1] }}
      />

      <motion.div variants={STAGGER_ITEM}>
        <Typography.Display size="md" align="center">
          {t(`${NS.TWO_TRUTHS}.revealTitle`)}
        </Typography.Display>
      </motion.div>

      {statements.map((s, i) => {
        const isLie = i === lieIndex;
        return (
          <motion.div
            key={i}
            animate={isLie ? { x: SHAKE_X } : undefined}
            transition={{ duration: 0.5, delay: lieDelay + FLIP_LANDING }}
          >
            <FlipCard
              revealDelay={delays[i]}
              back={
                <div className="rounded-premium-xl flex h-full items-start gap-3 border border-white/10 bg-white/[0.04] p-4">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-white/30" />
                  <p className="min-w-0 wrap-anywhere text-white/40">{s}</p>
                </div>
              }
              front={
                <div
                  className={`rounded-premium-xl h-full p-4 ${
                    isLie
                      ? 'border-premium-red bg-premium-red/10 border-2'
                      : 'border-premium-green/30 bg-premium-green/[0.06] border'
                  }`}
                  style={isLie ? { boxShadow: `0 0 40px ${rgba('red', 0.35)}` } : undefined}
                >
                  <span
                    className={`text-micro font-black tracking-[0.3em] uppercase ${
                      isLie ? 'text-premium-red' : 'text-premium-green'
                    }`}
                  >
                    {isLie ? t(`${NS.TWO_TRUTHS}.lieLabel`) : t(`${NS.TWO_TRUTHS}.truthLabel`)}
                  </span>
                  <p className="mt-1 wrap-anywhere">{s}</p>
                </div>
              }
            />
          </motion.div>
        );
      })}

      <motion.div
        className="glass-card rounded-premium-xl space-y-2 p-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: resultsDelay }}
      >
        {voters.map((v, i) => {
          const right = guesses[v] === lieIndex;
          const delay = resultsDelay + 0.1 + i * VOTER_STAGGER;
          return (
            <motion.div
              key={v}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING.soft, delay }}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="min-w-0 wrap-anywhere">{v}</span>
              <span
                className={`flex shrink-0 items-center gap-1.5 font-bold ${
                  right ? 'text-premium-green' : 'text-premium-red'
                }`}
              >
                <motion.span
                  className="flex"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ ...SPRING.pop, delay: delay + 0.1 }}
                >
                  {right ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </motion.span>
                {right ? t(`${NS.TWO_TRUTHS}.guessedRight`) : t(`${NS.TWO_TRUTHS}.guessedWrong`)}
              </span>
            </motion.div>
          );
        })}
        <motion.p
          className="pt-2 text-center text-sm text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: resultsDelay + 0.2 + voters.length * VOTER_STAGGER }}
        >
          {t(`${NS.TWO_TRUTHS}.fooledCount`, { name: storyteller, n: fooledCount })}
        </motion.p>
      </motion.div>

      <motion.div
        className="mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: resultsDelay + 0.3 + voters.length * VOTER_STAGGER }}
      >
        <PrimaryButton onClick={onNext}>
          {isLastRound ? t(`${NS.TWO_TRUTHS}.finishGame`) : t(`${NS.TWO_TRUTHS}.nextRound`)}
        </PrimaryButton>
      </motion.div>
    </>
  );
};
