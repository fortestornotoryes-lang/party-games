import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Ghost, EyeOff } from 'lucide-react';
import { Player } from '../../../types';
import { contentService } from '../../../services/contentService';
import { useGameSettings } from '../../../contexts/GameSettingsContext';
import { FakeArtistDifficulty } from '../../../constants/fakeArtistContent';
import { PassPhoneCard } from '../../../components/PassPhoneCard';

interface Props {
  players: Player[];
  onFinish: (word: string, category: string, rounds: number, timerSeconds: number) => void;
}

export const FakeArtistDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const { difficulty, rounds, timerSeconds } = useGameSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const diff = (difficulty as FakeArtistDifficulty) ?? 'easy';
    const item = contentService.getFakeArtistWord(diff);
    setWord(item.word);
    setCategory(item.category);
  }, [difficulty]);

  const next = () => {
    if (currentIndex === players.length - 1) {
      onFinish(word, category, rounds ?? 2, timerSeconds ?? 0);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    }
  };

  const isSpy = players[currentIndex].isSpy;
  const isLastPlayer = currentIndex === players.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden select-none">

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
            className={`h-1.5 rounded-full ${i === currentIndex ? 'bg-premium-sky' : 'bg-white/20'}`}
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
                  playerName={players[currentIndex].name}
                  icon={EyeOff}
                  accentColor="sky"
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
                className="w-full aspect-3/4 rounded-[2.5rem] flex flex-col relative overflow-hidden"
                style={{
                  border: isSpy
                    ? '1.5px solid rgba(255,46,77,0.45)'
                    : '1.5px solid rgba(31,182,255,0.35)',
                  boxShadow: isSpy
                    ? '0 0 80px rgba(255,46,77,0.22), 0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,46,77,0.12)'
                    : '0 0 70px rgba(31,182,255,0.15), 0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(31,182,255,0.08)',
                }}
              >
                {/* Gradient bg */}
                <div className={`absolute inset-0 ${
                  isSpy
                    ? 'bg-gradient-to-b from-premium-red/[0.22] via-premium-red/[0.06] to-black/70'
                    : 'bg-gradient-to-b from-premium-sky/[0.18] via-premium-sky/[0.05] to-black/70'
                }`} />

                {/* Top glow */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-60"
                  style={{
                    background: isSpy
                      ? 'rgba(255,46,77,0.28)'
                      : 'rgba(31,182,255,0.2)',
                  }}
                />

                <div className="relative z-10 flex flex-col flex-1 p-7 items-center text-center">

                  {/* ── SPY ── */}
                  {isSpy && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col items-center justify-between w-full"
                    >
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.45em] text-premium-red/50">Секретная роль</p>
                        <h4 className="text-lg font-black italic text-white/50 mt-0.5">{players[currentIndex].name}</h4>
                      </div>

                      <div className="space-y-3">
                        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                          <Ghost
                            className="w-[88px] h-[88px] text-premium-red mx-auto"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(255,46,77,0.5))' }}
                          />
                        </motion.div>
                        <h3
                          className="text-[56px] font-black italic text-premium-red tracking-tighter leading-none"
                          style={{ textShadow: '0 0 48px rgba(255,46,77,0.45)' }}
                        >
                          САМО&shy;ЗВАНЕЦ
                        </h3>
                        <div className="px-4 py-2 bg-premium-red/10 border border-premium-red/20 rounded-2xl">
                          <p className="text-[8px] font-black uppercase text-premium-red/55 mb-0.5">Тема</p>
                          <p className="text-sm font-black italic text-white uppercase">{category}</p>
                        </div>
                        <p className="text-white/30 text-[10px] leading-relaxed">
                          Слово неизвестно — рисуй,<br />чтобы не выдать себя
                        </p>
                      </div>

                      <button
                        onClick={next}
                        className="w-full py-4 bg-premium-red rounded-[18px] font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                        style={{ boxShadow: '0 8px 32px rgba(255,46,77,0.35)' }}
                      >
                        {isLastPlayer ? 'НАЧАТЬ ИГРУ' : 'ПОНЯТНО'}
                      </button>
                    </motion.div>
                  )}

                  {/* ── ARTIST ── */}
                  {!isSpy && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col items-center justify-between w-full"
                    >
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.45em] text-premium-sky/50">Художник</p>
                        <h4 className="text-lg font-black italic text-white/50 mt-0.5">{players[currentIndex].name}</h4>
                      </div>

                      <div className="space-y-4">
                        <Palette
                          className="w-[72px] h-[72px] text-premium-sky mx-auto"
                          style={{ filter: 'drop-shadow(0 0 16px rgba(31,182,255,0.45))' }}
                        />
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-premium-sky/50">Твоё слово</p>
                          <h3
                            className="text-[46px] font-black italic text-white uppercase tracking-tighter leading-tight"
                            style={{ textShadow: '0 0 32px rgba(31,182,255,0.25)' }}
                          >
                            {word}
                          </h3>
                        </div>
                        <div className="px-4 py-3 bg-premium-sky/10 border border-premium-sky/20 rounded-2xl">
                          <p className="text-[8px] font-black uppercase text-premium-sky/50 tracking-widest mb-1">Тема</p>
                          <p className="text-base font-black italic text-white uppercase">{category}</p>
                        </div>
                        <p className="text-white/[0.22] text-[10px]">Рисуй, не раскрывая слово напрямую</p>
                      </div>

                      <button
                        onClick={next}
                        className="w-full py-4 bg-premium-sky rounded-[18px] font-black uppercase tracking-[0.2em] text-black active:scale-95 transition-transform"
                        style={{ boxShadow: '0 8px 32px rgba(31,182,255,0.25)' }}
                      >
                        {isLastPlayer ? 'НАЧАТЬ ИГРУ' : 'ПОНЯТНО'}
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
