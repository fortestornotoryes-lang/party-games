import { EyeOff, Ghost, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';

import { getFakeArtistWord } from '../model/fakeArtistContent';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import {
  RoleRevealButton,
  RoleRevealCard,
  RoleRevealPanel,
} from '@/features/role-distribution/components/RoleRevealCard';
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
  const { word, category } = useMemo(
    () => getFakeArtistWord(difficulty || DIFFICULTY.EASY),
    [difficulty]
  );

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
          border: `1.5px solid ${rgba('sky', 0.25)}`,
          boxShadow: `0 0 80px ${rgba('sky', 0.22)}, var(--shadow-card), inset 0 1px 0 ${rgba('sky', 0.12)}`,
        },
      })}
      renderCard={(player, isLast, onNext) => (
        <RoleRevealCard
          gradientClassName="via-premium-green/25 bg-linear-to-b from-black/40 to-black/40"
          glowClassName="top-24 opacity-40"
          glowColor={player.isSpy ? rgba('red', 0.55) : rgba('sky', 0.55)}
        >
          {/* ── SPY ── */}
          {player?.isSpy && (
            <RoleRevealPanel>
              <div>
                <p className="text-micro font-black tracking-[0.45em] uppercase">
                  {t(`${NS.FAKE_ARTIST}.secretRole`)}
                </p>
                <h4 className="text-heading mt-0.5 font-black italic">{player.name}</h4>
              </div>

              <div className="space-y-3">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Ghost className="text-premium-red mx-auto h-[88px] w-[88px]" />
                </motion.div>
                <h3 className="text-3xl leading-none font-black tracking-tighter italic">
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

              <RoleRevealButton onClick={onNext} colorClassName="bg-premium-green text-white">
                {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          )}

          {/* ── ARTIST ── */}
          {!player.isSpy && (
            <RoleRevealPanel>
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
                <p className="text-tag text-white/22">{t(`${NS.FAKE_ARTIST}.artistHint`)}</p>
              </div>

              <RoleRevealButton
                onClick={onNext}
                colorClassName="bg-premium-sky text-black"
                style={{ boxShadow: `0 8px 32px ${rgba('sky', 0.25)}` }}
              >
                {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          )}
        </RoleRevealCard>
      )}
    />
  );
};
