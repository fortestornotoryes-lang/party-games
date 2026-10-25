import { RefreshCw } from 'lucide-react';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { CROCODILE_LEVELS, LEVEL_COLOR, REPLACE_PENALTY } from '../constants';
import { formatTime } from '../helpers';
import type { WordOption } from '../types';

import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';
import type { Difficulty } from '@/shared/types';

const LEVEL_LABEL_KEY: Record<Difficulty, string> = {
  easy: 'levelEasy',
  medium: 'levelMedium',
  hard: 'levelHard',
};

/** Пауза между выбором карточки и стартом раунда — успевает сыграть анимация выбора, мс */
const PICK_DELAY_MS = 380;
const DISPLAY = 'font-black italic uppercase tracking-tighter';

const optionKey = (option: WordOption) => `${option.difficulty}-${option.word}`;

// Набор из трёх плит: при замене старые переворачиваются «от себя», новые раздаются заново
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
      className="flex h-full flex-col gap-5 overflow-x-hidden overflow-y-auto p-6"
    >
      <motion.div variants={STAGGER_ITEM} className="space-y-2">
        <Typography.Title color="white" as="h2">
          {t(`${NS.CROCODILE}.chooseWord`)}
        </Typography.Title>
        <Typography.Body size="sm" color="muted">
          {t(`${NS.CROCODILE}.chooseHint`)}
        </Typography.Body>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={options.map(optionKey).join('|')}
            variants={batchVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-5 perspective-distant"
          >
            {options.map((option) => {
              const level = CROCODILE_LEVELS[option.difficulty];
              const color = LEVEL_COLOR[option.difficulty];
              const isPicked = picked !== null && optionKey(picked) === optionKey(option);
              const isDimmed = picked !== null && !isPicked;
              return (
                // Раздача — на кнопке, реакция на выбор — на вложенном слое (см. gotchas.md)
                <motion.button
                  key={optionKey(option)}
                  type="button"
                  variants={cardVariants}
                  onClick={() => {
                    if (!picked) setPicked(option);
                  }}
                  className="block w-full text-left transition-[translate] duration-75 active:translate-y-1"
                >
                  <motion.span
                    className="rounded-premium-lg relative flex w-full items-center gap-4 p-3 pr-5"
                    style={{
                      background: `linear-gradient(135deg, ${rgba(color, 0.14)} 0%, rgba(255,255,255,0.02) 100%)`,
                      border: `1.5px solid ${rgba(color, 0.45)}`,
                      boxShadow: `0 6px 0 ${rgba(color, 0.25)}, 0 0 30px ${rgba(color, 0.12)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
                    }}
                    animate={{
                      scale: isPicked ? 1.04 : isDimmed ? 0.96 : 1,
                      opacity: isDimmed ? 0.2 : 1,
                    }}
                    transition={SPRING.pop}
                  >
                    {/* Вспышка выбранной плиты: анимируется opacity готовой тени */}
                    <motion.span
                      aria-hidden
                      className="rounded-premium-lg pointer-events-none absolute -inset-px"
                      style={{
                        boxShadow: `0 0 50px ${rgba(color, 0.65)}, inset 0 0 24px ${rgba(color, 0.25)}`,
                      }}
                      initial={false}
                      animate={{ opacity: isPicked ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                    <span
                      className={`rounded-premium-md flex h-16 w-16 shrink-0 items-center justify-center text-[26px] ${DISPLAY}`}
                      style={{
                        background: rgba(color, 0.14),
                        border: `1.5px solid ${rgba(color, 0.55)}`,
                        color: rgba(color, 1),
                        textShadow: `0 0 24px ${rgba(color, 0.8)}`,
                      }}
                    >
                      +{level.points}
                    </span>
                    <span className="min-w-0 flex-1">
                      <FitText
                        as="span"
                        minFontSize={14}
                        className={`text-[26px] leading-tight text-white ${DISPLAY}`}
                      >
                        {option.word}
                      </FitText>
                      <span className="mt-1 block text-xs font-bold text-white/45">
                        {t(`${NS.CROCODILE}.${LEVEL_LABEL_KEY[option.difficulty]}`)},{' '}
                        {formatTime(level.time)}
                      </span>
                    </span>
                  </motion.span>
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
          disabled={picked !== null}
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
