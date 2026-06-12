import { Shield, Skull } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { DistributionFlow } from '@/components/DistributionFlow';
import type { Player } from '@/entities/player/types';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  players: Player[];
  onFinish: () => void;
}

export const ResistanceDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const { t } = useTranslation();
  const spyNames = players.filter((p) => p.isSpy).map((p) => p.name);

  return (
    <DistributionFlow
      players={players}
      onFinish={onFinish}
      activeColor="bg-premium-blue"
      passAccentColor="blue"
      getCardStyle={(player) => ({
        className: 'min-h-[28rem]',
        style: player.isSpy
          ? {
              border: '1.5px solid rgba(239,68,68,0.4)',
              boxShadow:
                '0 0 80px rgba(239,68,68,0.18), var(--shadow-card), inset 0 1px 0 rgba(239,68,68,0.1)',
            }
          : {
              border: '1.5px solid rgba(59,130,246,0.35)',
              boxShadow:
                '0 0 70px rgba(63,123,255,0.15), var(--shadow-card), inset 0 1px 0 rgba(59,130,246,0.08)',
            },
      })}
      renderCard={(player, isLast, onNext) => (
        <>
          {/* Gradient bg */}
          <div
            className={`absolute inset-0 ${
              player.isSpy
                ? 'from-premium-red/[0.20] via-premium-red/[0.05] bg-gradient-to-b to-black/70'
                : 'from-premium-blue/[0.18] via-premium-blue/[0.05] bg-gradient-to-b to-black/70'
            }`}
          />

          {/* Top glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
            style={{
              background: player.isSpy ? 'rgba(239,68,68,0.25)' : 'rgba(63,123,255,0.2)',
            }}
          />

          <div className="relative z-10 flex flex-1 flex-col items-center p-7 text-center">
            {player.isSpy ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full flex-1 flex-col items-center justify-between"
              >
                <div>
                  <p className="text-micro text-premium-red/50 font-black tracking-[0.45em] uppercase">
                    {t(`${NS.RESISTANCE}.secretRole`)}
                  </p>
                  <h4 className="mt-0.5 text-lg font-black text-white/50 italic">{player.name}</h4>
                </div>

                <div className="space-y-4 text-center">
                  <Skull
                    className="text-premium-red mx-auto h-[72px] w-[72px]"
                    style={{ filter: 'drop-shadow(0 0 18px rgba(239,68,68,0.5))' }}
                  />
                  <h3
                    className="text-premium-red text-5xl leading-none font-black tracking-tighter italic"
                    style={{ textShadow: '0 0 40px rgba(239,68,68,0.4)' }}
                  >
                    {t(`${NS.RESISTANCE}.spyRole`)}
                  </h3>
                  <div className="bg-premium-red/10 border-premium-red/20 rounded-premium-md border px-4 py-3">
                    <p className="text-micro text-premium-red/50 mb-1 font-black uppercase">
                      {t(`${NS.RESISTANCE}.allies`)}
                    </p>
                    <p className="text-sm font-black text-white italic">
                      {spyNames.filter((n) => n !== player.name).join(', ') ||
                        t(`${NS.RESISTANCE}.youAlone`)}
                    </p>
                  </div>
                  <p className="text-tag leading-relaxed text-white/25">
                    {t(`${NS.RESISTANCE}.spyHint`)}
                  </p>
                </div>

                <button
                  onClick={onNext}
                  className="bg-premium-red rounded-premium-md w-full py-4 font-black tracking-[0.2em] text-white uppercase transition-transform active:scale-95"
                  style={{ boxShadow: '0 8px 32px rgba(239,68,68,0.35)' }}
                >
                  {isLast ? t(`${NS.RESISTANCE}.startGame`) : t(`${NS.RESISTANCE}.gotIt`)}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full flex-1 flex-col items-center justify-between"
              >
                <div>
                  <p className="text-micro text-premium-blue/50 font-black tracking-[0.45em] uppercase">
                    {t(`${NS.RESISTANCE}.roleLabel`)}
                  </p>
                  <h4 className="mt-0.5 text-lg font-black text-white/50 italic">{player.name}</h4>
                </div>

                <div className="space-y-4 text-center">
                  <Shield
                    className="text-premium-blue mx-auto h-[72px] w-[72px]"
                    style={{ filter: 'drop-shadow(0 0 16px rgba(63,123,255,0.5))' }}
                  />
                  <h3
                    className="text-premium-blue text-5xl leading-none font-black tracking-tighter italic"
                    style={{ textShadow: '0 0 36px rgba(63,123,255,0.35)' }}
                  >
                    {t(`${NS.RESISTANCE}.resistanceRole`)}
                  </h3>
                  <p className="text-tag leading-relaxed text-white/25">
                    {t(`${NS.RESISTANCE}.resistanceHint`)}
                  </p>
                </div>

                <button
                  onClick={onNext}
                  className="bg-premium-blue rounded-premium-md w-full py-4 font-black tracking-[0.2em] text-white uppercase transition-transform active:scale-95"
                  style={{ boxShadow: '0 8px 32px rgba(63,123,255,0.35)' }}
                >
                  {isLast ? t(`${NS.RESISTANCE}.startGame`) : t(`${NS.RESISTANCE}.gotIt`)}
                </button>
              </motion.div>
            )}
          </div>
        </>
      )}
    />
  );
};
