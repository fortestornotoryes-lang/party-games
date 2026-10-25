import { motion } from 'motion/react';
import React from 'react';

import { STATEMENT_MAX_LENGTH } from '../constants';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TextInput } from '@/shared/components/TextInput';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

/** Цвет рамки .glass-card — к нему карточка возвращается, когда ложь снята */
const IDLE_BORDER = 'rgba(255,255,255,0.08)';
const NO_GLOW = '0 0 0px rgba(0,0,0,0)';

interface WritingPhaseProps {
  roundNo: number;
  storyteller: string;
  statements: string[];
  lieIndex: number | null;
  ready: boolean;
  onChange: (index: number, value: string) => void;
  onMarkLie: (index: number) => void;
  onSubmit: () => void;
}

/** Рассказчик пишет три утверждения; красная плашка «Ложь» перелетает между карточками. */
export const WritingPhase: React.FC<WritingPhaseProps> = ({
  roundNo,
  storyteller,
  statements,
  lieIndex,
  ready,
  onChange,
  onMarkLie,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <motion.div variants={STAGGER_ITEM}>
        <Typography.Caption className="text-center tracking-[0.4em]">
          {t('common.roundN', { n: roundNo })} · {storyteller}
        </Typography.Caption>
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <Typography.Body align="center" color="faint">
          {t(`${NS.TWO_TRUTHS}.writeTitle`)}
        </Typography.Body>
      </motion.div>

      {statements.map((s, i) => {
        const isLie = lieIndex === i;
        return (
          // Каскад появления и подсветка лжи — на разных элементах: свой animate у элемента
          // отключает наследование вариантов от родителя
          <motion.div key={i} variants={STAGGER_ITEM}>
            <motion.div
              animate={{
                borderColor: isLie ? rgba('red', 0.55) : IDLE_BORDER,
                boxShadow: isLie ? `0 0 36px ${rgba('red', 0.22)}` : NO_GLOW,
              }}
              transition={{ duration: 0.35 }}
              className="glass-card rounded-premium-xl flex flex-col gap-3 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-micro font-black tracking-[0.3em] text-white/40 uppercase">
                  {t(`${NS.TWO_TRUTHS}.statementN`, { n: i + 1 })}
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onMarkLie(i);
                  }}
                  className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-black tracking-widest uppercase transition-colors ${
                    isLie ? 'text-white' : 'bg-white/5 text-white/40'
                  }`}
                >
                  {isLie ? (
                    <motion.span
                      layoutId="two-truths-lie-marker"
                      transition={SPRING.snappy}
                      className="bg-premium-red absolute inset-0 rounded-full"
                      style={{ boxShadow: `0 0 18px ${rgba('red', 0.5)}` }}
                    />
                  ) : null}
                  <span className="relative">
                    {isLie ? t(`${NS.TWO_TRUTHS}.markedLie`) : t(`${NS.TWO_TRUTHS}.markAsLie`)}
                  </span>
                </motion.button>
              </div>
              <TextInput
                value={s}
                maxLength={STATEMENT_MAX_LENGTH}
                placeholder={t(`${NS.TWO_TRUTHS}.statementPlaceholder`)}
                onChange={(e) => {
                  onChange(i, e.target.value);
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      <motion.div variants={STAGGER_ITEM} className="mt-2">
        <div className={ready ? 'animate-breathe-soft' : undefined}>
          <PrimaryButton onClick={onSubmit} disabled={!ready}>
            {t(`${NS.TWO_TRUTHS}.showAll`)}
          </PrimaryButton>
        </div>
      </motion.div>
    </>
  );
};
