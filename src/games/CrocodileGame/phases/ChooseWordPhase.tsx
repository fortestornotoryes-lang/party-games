import { RefreshCw } from 'lucide-react';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { CROCODILE_LEVELS, LEVEL_STYLES, REPLACE_PENALTY } from '../constants';
import { formatTime } from '../helpers';
import type { WordOption } from '../types';

import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { PHASE_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';
import type { Difficulty } from '@/shared/types';

const LEVEL_LABEL_KEY: Record<Difficulty, string> = {
  easy: 'levelEasy',
  medium: 'levelMedium',
  hard: 'levelHard',
};

/** Пауза между выбором карточки и стартом раунда — успевает сыграть анимация выбора, мс */
const PICK_DELAY_MS = 380;

const optionKey = (option: WordOption) => `${option.difficulty}-${option.word}`;

// Набор из трёх карточек: при замене старые переворачиваются «от себя», новые раздаются заново
const batchVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.04 } },
};

const cardVariants: Variants = {
  initial: { opacity: 0, rotateX: -75, y: 40, scale: 0.92 },
  animate: { opacity: 1, rotateX: 0, y: 0, scale: 1, transition: SPRING.soft },
  exit: { opacity: 0, rotateX: 75, y: -24, transition: { duration: 0.2, ease: 'easeIn' } },
};

interface ChooseWordPhaseProps {
  options: WordOption[];
  onChoose: (option: WordOption) => void;
  onReplace: () => void;
}

export const ChooseWordPhase: React.FC<ChooseWordPhaseProps> = ({
  options,
  onChoose,
  onReplace,
}) => {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<WordOption | null>(null);
  // Сколько раз заменяли слова — ключ всплывающего штрафа
  const [replaces, setReplaces] = useState(0);

  useEffect(() => {
    if (!picked) return;
    const id = window.setTimeout(() => {
      onChoose(picked);
    }, PICK_DELAY_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [picked, onChoose]);

  const replace = () => {
    if (picked) return;
    setReplaces((n) => n + 1);
    onReplace();
  };

  return (
    <motion.div
      key="choose_word"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col gap-4 overflow-x-hidden overflow-y-auto p-6"
    >
      <motion.div variants={STAGGER_ITEM} className="space-y-1 text-center">
        <Typography.Heading size="md" align="center">
          {t(`${NS.CROCODILE}.chooseWord`)}
        </Typography.Heading>
        <Typography.Caption color="dimmer" align="center">
          {t(`${NS.CROCODILE}.chooseHint`)}
        </Typography.Caption>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={options.map(optionKey).join('|')}
            variants={batchVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-3 perspective-distant"
          >
            {options.map((option) => {
              const level = CROCODILE_LEVELS[option.difficulty];
              const style = LEVEL_STYLES[option.difficulty];
              const isPicked = picked !== null && optionKey(picked) === optionKey(option);
              const isDimmed = picked !== null && !isPicked;
              return (
                <motion.button
                  key={optionKey(option)}
                  type="button"
                  variants={cardVariants}
                  whileTap={picked ? undefined : { scale: 0.96 }}
                  onClick={() => {
                    if (!picked) setPicked(option);
                  }}
                  className={`rounded-premium-lg flex min-h-24 flex-col items-center justify-center gap-2 border px-4 py-4 transition-colors ${style.card}`}
                >
                  <motion.div
                    className="flex w-full flex-col items-center gap-2"
                    animate={{
                      scale: isPicked ? 1.06 : isDimmed ? 0.94 : 1,
                      opacity: isDimmed ? 0.25 : 1,
                    }}
                    transition={SPRING.pop}
                  >
                    <FitText
                      as="p"
                      className="text-3xl leading-tight font-black text-white uppercase"
                    >
                      {option.word}
                    </FitText>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span
                        className={`text-micro rounded-full border px-3 py-1 font-black tracking-[0.2em] uppercase ${style.chip}`}
                      >
                        {t(`${NS.CROCODILE}.${LEVEL_LABEL_KEY[option.difficulty]}`)}
                      </span>
                      <span className="text-micro font-black tracking-[0.2em] text-white/50 uppercase">
                        {t(`${NS.CROCODILE}.pointsValue`, { n: level.points })} ·{' '}
                        {formatTime(level.time)}
                      </span>
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div variants={STAGGER_ITEM} className="relative">
        {replaces > 0 && (
          <motion.span
            key={replaces}
            aria-hidden
            className="text-premium-red pointer-events-none absolute -top-2 right-6 text-2xl font-black italic"
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -44, scale: 1.2 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            −{REPLACE_PENALTY}
          </motion.span>
        )}
        <PrimaryButton
          onClick={replace}
          iconElement={
            <motion.span
              className="relative z-10 flex"
              animate={{ rotate: replaces * 360 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <RefreshCw className="h-6 w-6" />
            </motion.span>
          }
          variant="outline"
        >
          {t(`${NS.CROCODILE}.replaceAll`, { n: REPLACE_PENALTY })}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
