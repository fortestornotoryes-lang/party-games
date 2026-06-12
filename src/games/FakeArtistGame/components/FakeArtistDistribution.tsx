import { EyeOff, Ghost, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { useFakeArtistContent } from '../model/useFakeArtistContent';

import { DistributionFlow } from '@/components/DistributionFlow';
import type { Player } from '@/entities/player/types';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface Props {
  players: Player[];
  onFinish: (word: string, category: string, rounds: number, timerSeconds: number) => void;
}

export const FakeArtistDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const { difficulty, rounds, timerSeconds } = useGameSettings();
  const { t } = useTranslation();
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const diff = difficulty ?? DIFFICULTY.EASY;
    const item = useFakeArtistContent(diff);
    setWord(item.word);
    setCategory(item.category);
  }, [difficulty]);

  return (
    <DistributionFlow
      players={players}
      onFinish={() => {
        onFinish(word, category, rounds ?? 2, timerSeconds ?? 0);
      }}
      activeColor="bg-premium-sky"
      passIcon={EyeOff}
      passAccentColor="sky"
      getCardStyle={(player) => ({
        className: 'aspect-3/4',
        style: {
          border: player.isSpy
            ? `1.5px solid ${rgba('red', 0.45)}`
            : `1.5px solid ${rgba('sky', 0.35)}`,
          boxShadow: player.isSpy
            ? `0 0 80px ${rgba('red', 0.22)}, var(--shadow-card), inset 0 1px 0 ${rgba('red', 0.12)}`
            : `0 0 70px ${rgba('sky', 0.15)}, var(--shadow-card), inset 0 1px 0 ${rgba('sky', 0.08)}`,
        },
      })}
      renderCard={(player, isLast, onNext) => (
        <>
          {/* Gradient bg */}
          <div
            className={`absolute inset-0 ${
              player.isSpy
                ? 'from-premium-red/[0.22] via-premium-red/[0.06] bg-gradient-to-b to-black/70'
                : 'from-premium-sky/[0.18] via-premium-sky/[0.05] bg-gradient-to-b to-black/70'
            }`}
          />

          {/* Top glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{ background: player.isSpy ? rgba('red', 0.28) : rgba('sky', 0.2) }}
          />

          <div className="relative z-10 flex flex-1 flex-col items-center p-7 text-center">
            {/* ── SPY ── */}
            {!!player.isSpy && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full flex-1 flex-col items-center justify-between"
              >
                <div>
                  <p className="text-micro text-premium-red/50 font-black tracking-[0.45em] uppercase">
                    {t(`${NS.FAKE_ARTIST}.secretRole`)}
                  </p>
                  <h4 className="mt-0.5 text-lg font-black text-white/50 italic">{player.name}</h4>
                </div>

                <div className="space-y-3">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Ghost
                      className="text-premium-red mx-auto h-[88px] w-[88px]"
                      style={{ filter: `drop-shadow(0 0 20px ${rgba('red', 0.5)})` }}
                    />
                  </motion.div>
                  <h3
                    className="text-premium-red text-5xl leading-none font-black tracking-tighter italic"
                    style={{ textShadow: `0 0 48px ${rgba('red', 0.45)}` }}
                  >
                    {t(`${NS.FAKE_ARTIST}.imposter`)}
                  </h3>
                  <div className="bg-premium-red/10 border-premium-red/20 rounded-premium-md border px-4 py-2">
                    <p className="text-micro text-premium-red/55 mb-0.5 font-black uppercase">
                      {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                    </p>
                    <p className="text-sm font-black text-white uppercase italic">{category}</p>
                  </div>
                  <p className="text-tag leading-relaxed whitespace-pre-line text-white/30">
                    {t(`${NS.FAKE_ARTIST}.imposterHint`)}
                  </p>
                </div>

                <button
                  onClick={onNext}
                  className="bg-premium-red rounded-premium-md w-full py-4 font-black tracking-[0.2em] text-white uppercase transition-transform active:scale-95"
                  style={{ boxShadow: `0 8px 32px ${rgba('red', 0.35)}` }}
                >
                  {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
                </button>
              </motion.div>
            )}

            {/* ── ARTIST ── */}
            {!player.isSpy && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full flex-1 flex-col items-center justify-between"
              >
                <div>
                  <p className="text-micro text-premium-sky/50 font-black tracking-[0.45em] uppercase">
                    {t(`${NS.FAKE_ARTIST}.artistRole`)}
                  </p>
                  <h4 className="mt-0.5 text-lg font-black text-white/50 italic">{player.name}</h4>
                </div>

                <div className="space-y-4">
                  <Palette
                    className="text-premium-sky mx-auto h-[72px] w-[72px]"
                    style={{ filter: `drop-shadow(0 0 16px ${rgba('sky', 0.45)})` }}
                  />
                  <div className="space-y-1">
                    <p className="text-micro text-premium-sky/50 font-black tracking-[0.35em] uppercase">
                      {t(`${NS.FAKE_ARTIST}.yourWord`)}
                    </p>
                    <h3
                      className="text-5xl leading-tight font-black tracking-tighter text-white uppercase italic"
                      style={{ textShadow: `0 0 32px ${rgba('sky', 0.25)}` }}
                    >
                      {word}
                    </h3>
                  </div>
                  <div className="bg-premium-sky/10 border-premium-sky/20 rounded-premium-md border px-4 py-3">
                    <p className="text-micro text-premium-sky/50 mb-1 font-black tracking-widest uppercase">
                      {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                    </p>
                    <p className="text-base font-black text-white uppercase italic">{category}</p>
                  </div>
                  <p className="text-tag text-white/[0.22]">{t(`${NS.FAKE_ARTIST}.artistHint`)}</p>
                </div>

                <button
                  onClick={onNext}
                  className="bg-premium-sky rounded-premium-md w-full py-4 font-black tracking-[0.2em] text-black uppercase transition-transform active:scale-95"
                  style={{ boxShadow: `0 8px 32px ${rgba('sky', 0.25)}` }}
                >
                  {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
                </button>
              </motion.div>
            )}
          </div>
        </>
      )}
    />
  );
};
