import React from 'react';
import { motion } from 'motion/react';
import { Shield, Skull } from 'lucide-react';
import { Player } from '../../../types';
import { DistributionFlow } from '../../../components/DistributionFlow';

interface Props {
  players: Player[];
  onFinish: () => void;
}

export const ResistanceDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const spyNames = players.filter(p => p.isSpy).map(p => p.name);

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
              boxShadow: '0 0 80px rgba(239,68,68,0.18), 0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(239,68,68,0.1)',
            }
          : {
              border: '1.5px solid rgba(59,130,246,0.35)',
              boxShadow: '0 0 70px rgba(63,123,255,0.15), 0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(59,130,246,0.08)',
            },
      })}
      renderCard={(player, isLast, onNext) => (
        <>
          {/* Gradient bg */}
          <div className={`absolute inset-0 ${
            player.isSpy
              ? 'bg-gradient-to-b from-premium-red/[0.20] via-premium-red/[0.05] to-black/70'
              : 'bg-gradient-to-b from-premium-blue/[0.18] via-premium-blue/[0.05] to-black/70'
          }`} />

          {/* Top glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-50"
            style={{
              background: player.isSpy
                ? 'rgba(239,68,68,0.25)'
                : 'rgba(63,123,255,0.2)',
            }}
          />

          <div className="relative z-10 flex flex-col flex-1 p-7 items-center text-center">
            {player.isSpy ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-between w-full">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.45em] text-premium-red/50">Секретная роль</p>
                  <h4 className="text-lg font-black italic text-white/50 mt-0.5">{player.name}</h4>
                </div>

                <div className="space-y-4 text-center">
                  <Skull className="w-[72px] h-[72px] text-premium-red mx-auto" style={{ filter: 'drop-shadow(0 0 18px rgba(239,68,68,0.5))' }} />
                  <h3 className="text-[52px] font-black italic text-premium-red tracking-tighter leading-none"
                    style={{ textShadow: '0 0 40px rgba(239,68,68,0.4)' }}>
                    ШПИОН
                  </h3>
                  <div className="px-4 py-3 bg-premium-red/10 border border-premium-red/20 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-premium-red/50 mb-1">Союзники</p>
                    <p className="text-sm font-black italic text-white">
                      {spyNames.filter(n => n !== player.name).join(', ') || 'Ты один'}
                    </p>
                  </div>
                  <p className="text-white/25 text-[10px] leading-relaxed">Срывай миссии, не раскрывая себя</p>
                </div>

                <button
                  onClick={onNext}
                  className="w-full py-4 bg-premium-red rounded-premium-md font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                  style={{ boxShadow: '0 8px 32px rgba(239,68,68,0.35)' }}
                >
                  {isLast ? 'НАЧАТЬ ИГРУ' : 'ЛАДУШКИ'}
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-between w-full">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.45em] text-premium-blue/50">Роль</p>
                  <h4 className="text-lg font-black italic text-white/50 mt-0.5">{player.name}</h4>
                </div>

                <div className="space-y-4 text-center">
                  <Shield className="w-[72px] h-[72px] text-premium-blue mx-auto" style={{ filter: 'drop-shadow(0 0 16px rgba(63,123,255,0.5))' }} />
                  <h3 className="text-[48px] font-black italic text-premium-blue tracking-tighter leading-none"
                    style={{ textShadow: '0 0 36px rgba(63,123,255,0.35)' }}>
                    СОПРО&shy;ТИВЛЕНИЕ
                  </h3>
                  <p className="text-white/25 text-[10px] leading-relaxed">Выполняй миссии — вычисли шпионов</p>
                </div>

                <button
                  onClick={onNext}
                  className="w-full py-4 bg-premium-blue rounded-premium-md font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                  style={{ boxShadow: '0 8px 32px rgba(63,123,255,0.35)' }}
                >
                  {isLast ? 'НАЧАТЬ ИГРУ' : 'ЛАДУШКИ'}
                </button>
              </motion.div>
            )}
          </div>
        </>
      )}
    />
  );
};
