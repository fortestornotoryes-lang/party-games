import { ArrowDown, ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { C4Action, type C4Player } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  show: boolean;
  action: C4Action;
  current: C4Player;
  onChange: (a: C4Action) => void;
}

export const PopOutToggle: React.FC<Props> = ({ show, action, current, onChange }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!!show && (
        <motion.div
          key="pop-toggle"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex gap-2"
        >
          <button
            onClick={() => {
              onChange(C4Action.Place);
            }}
            className={`rounded-premium-md text-label flex flex-1 items-center justify-center gap-1.5 border py-3 font-black tracking-wider uppercase transition-all ${
              action === C4Action.Place
                ? current === 1
                  ? 'bg-premium-red/15 border-premium-red/50 text-premium-red'
                  : 'bg-premium-yellow/15 border-premium-yellow/50 text-premium-yellow'
                : 'border-white/10 bg-white/5 text-white/30'
            }`}
          >
            <ArrowDown className="h-3.5 w-3.5" />
            {t(`${NS.CONNECT_FOUR}.place`)}
          </button>
          <button
            onClick={() => {
              onChange(C4Action.Pop);
            }}
            className={`rounded-premium-md text-label flex flex-1 items-center justify-center gap-1.5 border py-3 font-black tracking-wider uppercase transition-all ${
              action === C4Action.Pop
                ? 'border-white/35 bg-white/10 text-white'
                : 'border-white/10 bg-white/5 text-white/30'
            }`}
          >
            <ArrowUp className="h-3.5 w-3.5" />
            {t(`${NS.CONNECT_FOUR}.popOut`)}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
