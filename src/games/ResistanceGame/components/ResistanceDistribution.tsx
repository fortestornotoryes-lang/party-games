import { Shield, Skull } from 'lucide-react';
import React from 'react';

import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import {
  RoleRevealButton,
  RoleRevealCard,
  RoleRevealPanel,
} from '@/features/role-distribution/components/RoleRevealCard';
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
        <RoleRevealCard
          gradientClassName={
            player.isSpy
              ? 'from-premium-red/[0.20] via-premium-red/[0.05] bg-gradient-to-b to-black/70'
              : 'from-premium-blue/[0.18] via-premium-blue/[0.05] bg-gradient-to-b to-black/70'
          }
          glowClassName="-top-24 opacity-50"
          glowColor={player.isSpy ? 'rgba(239,68,68,0.25)' : 'rgba(63,123,255,0.2)'}
        >
          {player.isSpy ? (
            <RoleRevealPanel>
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

              <RoleRevealButton
                onClick={onNext}
                colorClassName="bg-premium-red text-white"
                style={{ boxShadow: '0 8px 32px rgba(239,68,68,0.35)' }}
              >
                {isLast ? t(`${NS.RESISTANCE}.startGame`) : t(`${NS.RESISTANCE}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          ) : (
            <RoleRevealPanel>
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

              <RoleRevealButton
                onClick={onNext}
                colorClassName="bg-premium-blue text-white"
                style={{ boxShadow: '0 8px 32px rgba(63,123,255,0.35)' }}
              >
                {isLast ? t(`${NS.RESISTANCE}.startGame`) : t(`${NS.RESISTANCE}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          )}
        </RoleRevealCard>
      )}
    />
  );
};
