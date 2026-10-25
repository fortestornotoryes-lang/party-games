import { motion } from 'motion/react';
import React from 'react';

import { FitText } from '@/shared/components/FitText';
import { SecretWordCard } from '@/shared/components/SecretWordCard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  currentPlayer: string;
  shuffledPlayers: string[];
  currentWord: string;
  onReady: () => void;
}

export const TelestrationsStart: React.FC<Props> = ({
  currentPlayer,
  shuffledPlayers,
  currentWord,
  onReady,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-y-auto p-6"
    >
      <div className="space-y-3 text-center">
        <div className="bg-premium-orange/10 border-premium-orange/20 inline-block rounded-full border px-4 py-1">
          <span className="text-tag text-premium-orange font-bold tracking-widest uppercase">
            {t(`${NS.TELESTRATIONS}.firstDraws`)}
          </span>
        </div>
        <FitText as="h3" className="text-4xl font-black italic">
          {currentPlayer}
        </FitText>
        <p className="text-sm text-white/30">{t(`${NS.TELESTRATIONS}.rememberAndDraw`)}</p>
      </div>

      <div className="rounded-premium-md w-full max-w-sm border border-white/5 bg-white/5 p-4">
        <p className="text-micro mb-3 text-center font-black tracking-widest text-white/25 uppercase">
          {t(`${NS.TELESTRATIONS}.gameOrder`)}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {shuffledPlayers.map((name, i) => (
            <div
              key={i}
              className={`text-tag flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-bold ${
                i % 2 === 0
                  ? 'bg-premium-orange/10 border-premium-orange/20 text-premium-orange'
                  : 'border-white/10 bg-white/5 text-white/40'
              }`}
            >
              <span className="opacity-50">{i + 1}.</span>
              <span>{name}</span>
              <span className="opacity-60">{i % 2 === 0 ? '✏️' : '💬'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Слово видно, только пока палец на карточке — как при раздаче ролей */}
      <div className="w-full max-w-sm">
        <SecretWordCard
          label={t(`${NS.TELESTRATIONS}.yourSecretWord`)}
          word={currentWord}
          accent="orange"
          doneLabel={t(`${NS.TELESTRATIONS}.readyToDraw`)}
          onDone={onReady}
        />
      </div>
    </motion.div>
  );
};
