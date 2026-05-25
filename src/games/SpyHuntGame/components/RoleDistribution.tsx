import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Ghost, Shield } from 'lucide-react';
import { Player } from '../../../types';
import { useGameSettings } from '../../../contexts/GameSettingsContext';
import { PassPhoneCard } from '../../../components/PassPhoneCard';
import { ROLE_TOKENS } from '../../../theme/colors';
import { Typography } from '../../../components/Typography';

interface RoleDistributionProps {
  players: Player[];
  location: string;
  onFinish: () => void;
}

export const RoleDistribution: React.FC<RoleDistributionProps> = ({ players, location, onFinish }) => {
  const { difficulty } = useGameSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;
  const roleType = currentPlayer.isSpy ? 'spy' : currentPlayer.role === 'Предатель' ? 'traitor' : 'agent';

  const nextPlayer = () => {
    if (isLastPlayer) onFinish();
    else {
      setCurrentIndex(i => i + 1);
      setIsRevealed(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 overflow-y-auto select-none">

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {players.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === currentIndex ? 24 : 6,
              opacity: i < currentIndex ? 0.2 : i === currentIndex ? 1 : 0.35,
            }}
            transition={{ duration: 0.3 }}
            className={`h-1.5 rounded-full ${i === currentIndex ? 'bg-premium-red' : 'bg-white/20'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="w-full max-w-sm"
        >
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              /* ── LOCKED ── */
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              >
                <PassPhoneCard
                  playerName={currentPlayer.name}
                  instruction="Нажми чтобы увидеть роль"
                  onClick={() => setIsRevealed(true)}
                />
              </motion.div>
            ) : (
              /* ── REVEALED ── */
              <motion.div
                key="revealed"
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="w-full min-h-[28rem] rounded-[2.5rem] flex flex-col relative overflow-hidden"
                style={{
                  border: ROLE_TOKENS[roleType].cardBorder,
                  boxShadow: ROLE_TOKENS[roleType].cardShadow,
                }}
              >
                {/* Gradient bg */}
                <div className={`absolute inset-0 ${
                  roleType === 'spy' ? 'bg-gradient-to-b from-premium-red/[0.22] via-premium-red/[0.06] to-black/70'
                  : roleType === 'traitor' ? 'bg-gradient-to-b from-premium-orange/20 via-premium-orange/[0.05] to-black/70'
                  : 'bg-gradient-to-b from-premium-green/[0.15] via-premium-green/[0.05] to-black/70'
                }`} />

                {/* Top glow */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-60"
                  style={{ background: ROLE_TOKENS[roleType].topGlow }}
                />

                <div className="relative z-10 flex flex-col flex-1 p-7 items-center text-center">

                  {/* ── SPY ── */}
                  {roleType === 'spy' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-between w-full">
                      <div className="text-center">
                        <Typography.Caption color="red" className="opacity-50 tracking-[0.45em]">Секретная роль</Typography.Caption>
                        <Typography.Title color="muted" className="mt-0.5">{currentPlayer.name}</Typography.Title>
                      </div>

                      <div className="space-y-3 text-center">
                        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                          <Ghost className="w-[88px] h-[88px] text-premium-red mx-auto" style={{ filter: ROLE_TOKENS.spy.iconFilter }} />
                        </motion.div>
                        <Typography.Display size="lg" color="red" glow align="center">ШПИОН</Typography.Display>
                        <Typography.Body size="xs" color="faint" align="center">
                          Локация неизвестна.<br />Не выдай себя — узнай место.
                        </Typography.Body>
                        {difficulty === 'easy' && (
                          <div className="px-4 py-2 bg-premium-red/10 border border-premium-red/20 rounded-2xl">
                            <Typography.Caption size="xs" color="red" className="opacity-55 mb-0.5">Подсказка</Typography.Caption>
                            <p className="text-xs text-premium-red font-black">Букв в названии: {location.length}</p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={nextPlayer}
                        className="w-full py-4 bg-premium-red rounded-premium-md font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                        style={{ boxShadow: ROLE_TOKENS.spy.btnShadow }}
                      >
                        {isLastPlayer ? 'НАЧАТЬ ИГРУ' : 'ЛАДУШКИ'}
                      </button>
                    </motion.div>
                  )}

                  {/* ── TRAITOR ── */}
                  {roleType === 'traitor' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-between w-full">
                      <div className="text-center">
                        <Typography.Caption color="orange" className="opacity-50 tracking-[0.45em]">Секретная роль</Typography.Caption>
                        <Typography.Title color="muted" className="mt-0.5">{currentPlayer.name}</Typography.Title>
                      </div>

                      <div className="space-y-4 text-center">
                        <Shield className="w-[72px] h-[72px] text-premium-orange mx-auto" style={{ filter: ROLE_TOKENS.traitor.iconFilter }} />
                        <Typography.Display size="md" color="orange" glow align="center">ПРЕДАТЕЛЬ</Typography.Display>
                        <div className="px-4 py-3 bg-premium-orange/10 border border-premium-orange/20 rounded-2xl">
                          <Typography.Caption size="xs" color="orange" className="opacity-50 mb-1">Твоя локация</Typography.Caption>
                          <Typography.Heading size="sm" align="center">{location}</Typography.Heading>
                        </div>
                        <Typography.Caption color="faint">Помогай шпиону, запутывай остальных</Typography.Caption>
                      </div>

                      <button
                        onClick={nextPlayer}
                        className="w-full py-4 bg-premium-orange rounded-premium-md font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                        style={{ boxShadow: ROLE_TOKENS.traitor.btnShadow }}
                      >
                        {isLastPlayer ? 'НАЧАТЬ ИГРУ' : 'ЛАДУШКИ'}
                      </button>
                    </motion.div>
                  )}

                  {/* ── AGENT ── */}
                  {roleType === 'agent' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-between w-full">
                      <div className="text-center">
                        <Typography.Caption color="green" className="opacity-50 tracking-[0.45em]">Агент</Typography.Caption>
                        <Typography.Title color="muted" className="mt-0.5">{currentPlayer.name}</Typography.Title>
                      </div>

                      <div className="space-y-4 text-center">
                        <MapPin className="w-[72px] h-[72px] text-premium-green mx-auto" style={{ filter: ROLE_TOKENS.agent.iconFilter }} />
                        <div className="space-y-1">
                          <Typography.Caption color="green" className="opacity-50 tracking-[0.35em]">Секретная локация</Typography.Caption>
                          <h3
                            className="font-black italic text-white uppercase tracking-tighter leading-tight wrap-break-word"
                            style={{ textShadow: ROLE_TOKENS.agent.textShadow, fontSize: 'clamp(22px, 9vw, 40px)' }}
                          >
                            {location}
                          </h3>
                        </div>
                        <div className="px-4 py-3 bg-premium-green/10 border border-premium-green/20 rounded-2xl">
                          <Typography.Caption size="xs" color="dimmer" className="mb-1">Твоя роль</Typography.Caption>
                          <Typography.Heading size="sm" color="green">{currentPlayer.role}</Typography.Heading>
                        </div>
                        <Typography.Caption color="dimmer">Вычисли шпиона, не раскрывая локацию</Typography.Caption>
                      </div>

                      <button
                        onClick={nextPlayer}
                        className="w-full py-4 bg-premium-green rounded-premium-md font-black uppercase tracking-[0.2em] text-black active:scale-95 transition-transform"
                        style={{ boxShadow: ROLE_TOKENS.agent.btnShadow }}
                      >
                        {isLastPlayer ? 'НАЧАТЬ ИГРУ' : 'ЛАДУШКИ'}
                      </button>
                    </motion.div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
