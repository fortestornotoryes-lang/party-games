import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Snowflake, CheckCircle, ChevronRight } from 'lucide-react';
import { GameHeader } from '../../components/GameHeader';
import { PassPhoneCard } from '../../components/PassPhoneCard';
import { PrimaryButton } from '../../components/UI';
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
        themeColor="border-premium-red/30 text-premium-red"
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
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col p-5 gap-5"
            >
              <div className="flex flex-col items-center justify-center pt-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 mb-1">Игрок</p>
                <h2 className="text-[38px] font-black italic uppercase tracking-tighter text-white leading-none text-center">
                  {currentPlayer}
                </h2>
              </div>

              <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-white/20">
                Выбери своё испытание
              </p>

              <div className="flex-1 flex  gap-4 justify-center">
                {/* ПРАВДА */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleChoice('truth')}
                  className="w-full flex-1 max-h-50 rounded-[28px] flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(31,182,255,0.12) 0%, rgba(31,182,255,0.05) 100%)',
                    border: '1.5px solid rgba(31,182,255,0.22)',
                    boxShadow: '0 0 60px rgba(31,182,255,0.06)',
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(31,182,255,0.08),transparent_65%)]" />
                  <Snowflake className="w-12 h-12 text-premium-sky relative z-10" />
                  <div className="text-center relative z-10">
                    <div className="text-[38px] font-black italic uppercase tracking-tighter text-premium-sky leading-none">
                      ПРАВДА
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-sky/40 mt-1">
                      Ответь честно
                    </div>
                  </div>
                </motion.button>

                {/* ДЕЙСТВИЕ */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleChoice('dare')}
                  className="w-full flex-1 max-h-[200px] rounded-[28px] flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,46,77,0.12) 0%, rgba(255,46,77,0.05) 100%)',
                    border: '1.5px solid rgba(255,46,77,0.22)',
                    boxShadow: '0 0 60px rgba(255,46,77,0.06)',
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,46,77,0.08),transparent_65%)]" />
                  <Flame className="w-12 h-12 text-premium-red relative z-10" />
                  <div className="text-center relative z-10">
                    <div className="text-[38px] font-black italic uppercase tracking-tighter text-premium-red leading-none">
                      ДЕЙСТВИЕ
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-red/40 mt-1">
                      Выполни задание
                    </div>
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
                <div
                  className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                    choice === 'truth'
                      ? 'bg-premium-sky/10 border-premium-sky/25 text-premium-sky'
                      : 'bg-premium-red/10 border-premium-red/25 text-premium-red'
                  }`}
                >
                  {choice === 'truth' ? 'Правда' : 'Действие'}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                  {currentPlayer}
                </p>
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
                  <p className={`text-xl font-black leading-snug relative z-10 ${
                    choice === 'truth' ? 'text-white' : 'text-white'
                  }`}>
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
