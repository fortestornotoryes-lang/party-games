import { Home, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { Step } from '../types';
import { STEP_TYPE } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  initialWord: string;
  steps: Step[];
  onNewGame: () => void;
  onBack: () => void;
}

export const TelestrationsGallery: React.FC<Props> = ({
  initialWord,
  steps,
  onNewGame,
  onBack,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 overflow-y-auto"
    >
      <div className="space-y-6 p-6 pb-40">
        <div className="space-y-1 text-center">
          <h3 className="text-3xl font-black tracking-tighter uppercase italic">
            {t(`${NS.TELESTRATIONS}.chainEnd`)}
          </h3>
          <p className="text-sm text-white/30">{t(`${NS.TELESTRATIONS}.seeHowWordChanged`)}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-premium-orange/10 border-premium-orange/20 text-micro text-premium-orange flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border font-black">
            START
          </div>
          <div className="bg-premium-orange/10 border-premium-orange/20 rounded-premium-md flex-1 border p-4">
            <p className="text-premium-orange mb-1 text-xs font-black tracking-widest uppercase">
              {t(`${NS.TELESTRATIONS}.originalWord`)}
            </p>
            <p className="text-xl font-bold italic">{initialWord}</p>
          </div>
        </div>

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border text-sm font-black ${
                  step.type === STEP_TYPE.Draw
                    ? 'bg-premium-orange/10 border-premium-orange/20 text-premium-orange'
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                {step.type === STEP_TYPE.Draw ? '✏️' : '💬'}
              </div>
              <p className="text-xs font-black tracking-widest text-white/30 uppercase">
                {step.author}
              </p>
            </div>
            <div className="rounded-premium-lg ml-14 overflow-hidden border border-white/5 bg-white/5 p-3">
              {step.type === STEP_TYPE.Draw ? (
                <img src={step.content} alt="Drawing" className="rounded-premium-sm w-full" />
              ) : (
                <div className="p-3 text-center">
                  <p className="text-xl font-black italic">{step.content}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none fixed right-0 bottom-0 left-0 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/95 to-transparent p-5">
        <div className="pointer-events-auto mx-auto flex max-w-sm flex-col gap-3">
          <button
            onClick={onNewGame}
            className="rounded-premium-md flex w-full items-center justify-center space-x-3 bg-white py-5 font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-transform active:scale-95"
          >
            <Shuffle className="h-5 w-5" />
            <span>{t(`${NS.TELESTRATIONS}.newGame`)}</span>
          </button>
          <button
            onClick={onBack}
            className="rounded-premium-md flex w-full items-center justify-center space-x-2 border border-white/10 bg-white/5 py-4 font-bold tracking-widest text-white/40 uppercase transition-transform active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">{t(`${NS.TELESTRATIONS}.toMenu`)}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
