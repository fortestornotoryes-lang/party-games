import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Snowflake, CheckCircle, ChevronRight } from 'lucide-react';
import { GameHeader } from '../../components/GameHeader';
import { PassPhoneCard } from '../../components/PassPhoneCard';
import { PrimaryButton } from '../../components/UI';
import { Typography } from '../../components/Typography';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { contentService } from '../../services/contentService';
import { TruthOrDarePhase, ChoiceType } from './types';

interface TruthOrDareGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ playerNames, onBack }) => {
  const { difficulty } = useGameSettings();
  const [phase, setPhase] = useState<TruthOrDarePhase>(TruthOrDarePhase.Pass);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [choice, setChoice] = useState<ChoiceType | null>(null);
  const [content, setContent] = useState('');

  const currentPlayer = playerNames[currentPlayerIdx];

  const handleChoice = (type: ChoiceType) => {
    const text = contentService.getTruthOrDareQuestion(type, difficulty);
    setChoice(type);
    setContent(text);
    setPhase(TruthOrDarePhase.Action);
  };

  const handleDone = () => {
    const next = (currentPlayerIdx + 1) % playerNames.length;
    setCurrentPlayerIdx(next);
    setChoice(null);
    setContent('');
    setPhase(TruthOrDarePhase.Pass);
  };

  return (
    <div className="flex flex-col h-screen">
      <GameHeader
        title={GAMES_REGISTRY.truth_or_dare.title}
        subtitle="Правда или Действие"
        icon={Flame}
        theme="red"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ── PASS ── */}
          {phase === TruthOrDarePhase.Pass && (
            <motion.div
              key="pass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.22 }}
              className="h-full flex flex-col p-5 gap-4"
            >
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-xs">
                  <PassPhoneCard
                    playerName={currentPlayer}
                    badge="Правда или Действие"
                    badgeColor="red"
                    accentColor="red"
                    icon={Flame}
                    instruction="Нажми чтобы продолжить"
                    onClick={() => setPhase(TruthOrDarePhase.Choice)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CHOICE ── */}
          {phase === TruthOrDarePhase.Choice && (
            <motion.div
              key="choice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col"
            >
              {/* Player name */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.2 }}
                className="flex flex-col items-center justify-center py-4 px-6"
              >
                <Typography.Label color="faint" className="mb-1.5">Выбирает</Typography.Label>
                <Typography.Display size="sm" className="text-center">{currentPlayer}</Typography.Display>
              </motion.div>

              {/* Cards */}
              <div className="flex-1 flex flex-col px-4 pb-5 gap-3">

                {/* ПРАВДА */}
                <motion.button
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 360, damping: 28 }}
                  whileTap={{ scale: 0.975, transition: { duration: 0.08 } }}
                  onClick={() => handleChoice('truth')}
                  className="flex-1 rounded-[32px] relative overflow-hidden flex flex-col items-center justify-center gap-4"
                  style={{
                    background: 'linear-gradient(160deg, rgba(31,182,255,0.17) 0%, rgba(11,9,21,0.5) 55%, rgba(31,182,255,0.05) 100%)',
                    border: '1px solid rgba(31,182,255,0.26)',
                    boxShadow: '0 30px 90px -15px rgba(31,182,255,0.18), inset 0 1px 0 rgba(31,182,255,0.18)',
                  }}
                >
                  <div className="absolute top-0 left-0 w-56 h-56 bg-[radial-gradient(circle_at_0%_0%,rgba(31,182,255,0.13),transparent_65%)] pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-[linear-gradient(to_top,rgba(31,182,255,0.07),transparent)] pointer-events-none" />

                  <motion.div
                    initial={{ scale: 0.3, opacity: 0, rotate: -25 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 380, damping: 20 }}
                    className="relative z-10"
                  >
                    <Snowflake
                      className="w-16 h-16 text-premium-sky"
                      style={{ filter: 'drop-shadow(0 0 22px rgba(31,182,255,0.6))' }}
                    />
                  </motion.div>

                  <div className="relative z-10 text-center px-6">
                    <div
                      className="font-black italic uppercase tracking-tighter leading-none text-premium-sky"
                      style={{ fontSize: 52, textShadow: '0 0 40px rgba(31,182,255,0.4)' }}
                    >
                      ПРАВДА
                    </div>
                    <Typography.Label color="sky" className="opacity-45 mt-2 tracking-[0.5em]" as="div">
                      Ответь честно
                    </Typography.Label>
                  </div>
                </motion.button>

                {/* ДЕЙСТВИЕ */}
                <motion.button
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.17, type: 'spring', stiffness: 360, damping: 28 }}
                  whileTap={{ scale: 0.975, transition: { duration: 0.08 } }}
                  onClick={() => handleChoice('dare')}
                  className="flex-1 rounded-[32px] relative overflow-hidden flex flex-col items-center justify-center gap-4"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,46,77,0.17) 0%, rgba(11,9,21,0.5) 55%, rgba(255,46,77,0.05) 100%)',
                    border: '1px solid rgba(255,46,77,0.26)',
                    boxShadow: '0 30px 90px -15px rgba(255,46,77,0.18), inset 0 1px 0 rgba(255,46,77,0.18)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-56 h-56 bg-[radial-gradient(circle_at_100%_0%,rgba(255,46,77,0.13),transparent_65%)] pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-[linear-gradient(to_top,rgba(255,46,77,0.07),transparent)] pointer-events-none" />

                  <motion.div
                    initial={{ scale: 0.3, opacity: 0, rotate: 25 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.27, type: 'spring', stiffness: 380, damping: 20 }}
                    className="relative z-10"
                  >
                    <Flame
                      className="w-16 h-16 text-premium-red"
                      style={{ filter: 'drop-shadow(0 0 22px rgba(255,46,77,0.6))' }}
                    />
                  </motion.div>

                  <div className="relative z-10 text-center px-6">
                    <div
                      className="font-black italic uppercase tracking-tighter leading-none text-premium-red"
                      style={{ fontSize: 52, textShadow: '0 0 40px rgba(255,46,77,0.4)' }}
                    >
                      ДЕЙСТВИЕ
                    </div>
                    <Typography.Label color="red" className="opacity-45 mt-2 tracking-[0.5em]" as="div">
                      Выполни задание
                    </Typography.Label>
                  </div>
                </motion.button>

              </div>
            </motion.div>
          )}

          {/* ── ACTION ── */}
          {phase === TruthOrDarePhase.Action && (
            <motion.div
              key="action"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="h-full flex flex-col p-5 gap-6"
            >
              <div className="flex flex-col items-center gap-2 pt-2">
                <div className={`px-4 py-1.5 rounded-full border ${
                  choice === 'truth'
                    ? 'bg-premium-sky/10 border-premium-sky/25'
                    : 'bg-premium-red/10 border-premium-red/25'
                }`}>
                  <Typography.Label color={choice === 'truth' ? 'sky' : 'red'} as="span">
                    {choice === 'truth' ? 'Правда' : 'Действие'}
                  </Typography.Label>
                </div>

                <Typography.Title className="text-center">{currentPlayer}</Typography.Title>
              </div>

              <div className="flex-1 flex items-center justify-center px-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
                  className="w-full rounded-[28px] p-8 text-center relative overflow-hidden"
                  style={{
                    background: choice === 'truth'
                      ? 'linear-gradient(145deg, rgba(31,182,255,0.1) 0%, rgba(31,182,255,0.04) 100%)'
                      : 'linear-gradient(145deg, rgba(255,46,77,0.1) 0%, rgba(255,46,77,0.04) 100%)',
                    border: choice === 'truth'
                      ? '1.5px solid rgba(31,182,255,0.2)'
                      : '1.5px solid rgba(255,46,77,0.2)',
                    boxShadow: choice === 'truth'
                      ? '0 0 80px rgba(31,182,255,0.07)'
                      : '0 0 80px rgba(255,46,77,0.07)',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 28px)',
                    }}
                  />
                  <p className="text-xl font-black leading-snug relative z-10 text-white">
                    {content}
                  </p>
                </motion.div>
              </div>

              <PrimaryButton
                onClick={handleDone}
                icon={CheckCircle}
                variant={choice === 'truth' ? 'blue' : 'red'}
              >
                ВЫПОЛНЕНО
              </PrimaryButton>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
