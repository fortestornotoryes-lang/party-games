import { RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { CROCODILE_LEVELS, LEVEL_STYLES, REPLACE_PENALTY } from '../constants';
import { formatTime } from '../helpers';
import type { WordOption } from '../types';

import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import type { Difficulty } from '@/shared/types';

const LEVEL_LABEL_KEY: Record<Difficulty, string> = {
  easy: 'levelEasy',
  medium: 'levelMedium',
  hard: 'levelHard',
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

  return (
    <motion.div
      key="choose_word"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-4 overflow-y-auto p-6"
    >
      <div className="space-y-1 text-center">
        <Typography.Heading size="md" align="center">
          {t(`${NS.CROCODILE}.chooseWord`)}
        </Typography.Heading>
        <Typography.Caption color="dimmer" align="center">
          {t(`${NS.CROCODILE}.chooseHint`)}
        </Typography.Caption>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3">
        {options.map((option) => {
          const level = CROCODILE_LEVELS[option.difficulty];
          const style = LEVEL_STYLES[option.difficulty];
          return (
            <motion.button
              key={`${option.difficulty}-${option.word}`}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => { onChoose(option); }}
              className={`rounded-premium-lg flex min-h-24 flex-col items-center justify-center gap-2 border px-4 py-4 transition-all active:scale-[0.98] ${style.card}`}
            >
              <FitText as="p" className="text-3xl leading-tight font-black text-white uppercase">
                {option.word}
              </FitText>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span
                  className={`text-micro rounded-full border px-3 py-1 font-black tracking-[0.2em] uppercase ${style.chip}`}
                >
                  {t(`${NS.CROCODILE}.${LEVEL_LABEL_KEY[option.difficulty]}`)}
                </span>
                <span className="text-micro font-black tracking-[0.2em] text-white/50 uppercase">
                  {t(`${NS.CROCODILE}.pointsValue`, { n: level.points })} · {formatTime(level.time)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <PrimaryButton onClick={onReplace} icon={RefreshCw} variant="outline">
        {t(`${NS.CROCODILE}.replaceAll`, { n: REPLACE_PENALTY })}
      </PrimaryButton>
    </motion.div>
  );
};
