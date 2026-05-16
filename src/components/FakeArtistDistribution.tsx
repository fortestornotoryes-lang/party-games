import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Ghost, Palette, ChevronRight } from 'lucide-react';
import { Player } from '../types';
import {
  FAKE_ARTIST_DATA_BY_DIFFICULTY,
  FAKE_ARTIST_DIFFICULTY_CONFIG,
  FakeArtistDifficulty,
} from '../constants/fakeArtistContent';

interface FakeArtistDistributionProps {
  players: Player[];
  onFinish: (word: string, category: string, rounds: number, timerSeconds: number) => void;
}

const ROUND_OPTIONS = [1, 2, 3];
const TIMER_OPTIONS = [
  { value: 0, label: 'Нет' },
  { value: 30, label: '30с' },
  { value: 60, label: '60с' },
  { value: 90, label: '90с' },
];

export const FakeArtistDistribution: React.FC<FakeArtistDistributionProps> = ({ players, onFinish }) => {
  const [phase, setPhase] = useState<'settings' | 'distributing'>('settings');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');

  const [selectedDifficulty, setSelectedDifficulty] = useState<FakeArtistDifficulty>('easy');
  const [selectedRounds, setSelectedRounds] = useState(2);
  const [selectedTimer, setSelectedTimer] = useState(0);

  const handleStart = () => {
    if (!selectedDifficulty) return;
    const pool = FAKE_ARTIST_DATA_BY_DIFFICULTY[selectedDifficulty];
    const gameObj = pool[Math.floor(Math.random() * pool.length)];
    setWord(gameObj.word);
    setCategory(gameObj.category);
    setPhase('distributing');
  };

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  const nextPlayer = () => {
    if (isLastPlayer) {
      onFinish(word, category, selectedRounds, selectedTimer);
    } else {
      setIsTransitioning(true);
      setIsRevealed(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      }, 400);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden select-none">
      <AnimatePresence mode="wait">

        {/* ── SETTINGS (difficulty + rounds + timer) ── */}
        {phase === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm flex flex-col gap-6"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-1">
                <Palette className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Настройки</h3>
              <p className="text-gray-500 text-sm">{players.length} игроков</p>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-1">Сложность</p>
              <div className="space-y-2">
                {(['easy', 'medium', 'hard'] as FakeArtistDifficulty[]).map(diff => {
                  const cfg = FAKE_ARTIST_DIFFICULTY_CONFIG[diff];
                  const isSelected = selectedDifficulty === diff;
                  return (
                    <motion.button
                      key={diff}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`w-full p-4 rounded-[1.5rem] border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? `${cfg.border} ${cfg.bg} opacity-100`
                          : 'border-white/10 bg-white/5 opacity-60'
                      }`}
                    >
                      <span className="text-2xl leading-none">{cfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-black uppercase italic ${isSelected ? cfg.text : 'text-gray-400'}`}>{cfg.label}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{cfg.desc}</p>
                      </div>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Rounds */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-1">Раундов</p>
              <div className="flex gap-2">
                {ROUND_OPTIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRounds(r)}
                    className={`flex-1 py-3 rounded-2xl font-black text-lg transition-all border ${
                      selectedRounds === r
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-gray-500'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-1">Таймер на ход</p>
              <div className="flex gap-2">
                {TIMER_OPTIONS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTimer(t.value)}
                    className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all border ${
                      selectedTimer === t.value
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-gray-500'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              disabled={!selectedDifficulty}
              className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl disabled:opacity-30 transition-all"
            >
              <span>Раздать роли</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* ── PLAYER DISTRIBUTION ── */}
        {phase === 'distributing' && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm space-y-4 sm:space-y-8 flex flex-col items-center relative z-10"
          >
            <div className={`fixed inset-0 transition-colors duration-1000 pointer-events-none opacity-20 ${isRevealed && currentPlayer.isSpy ? 'bg-red-900' : isRevealed ? 'bg-sky-900' : 'bg-transparent'}`} />

            <div className="text-center space-y-2">
              <p className="text-[10px] text-emerald-500 uppercase tracking-[0.3em] font-bold">Художественная мастерская</p>
              <h2 className="text-2xl font-light tracking-tight text-gray-400">Передайте устройство:</h2>
              <motion.h3 className="text-5xl font-black text-white mt-1 italic tracking-tighter">
                {currentPlayer.name}
              </motion.h3>
            </div>

            <div className="relative w-full aspect-[4/5] max-h-[58vh] [perspective:2000px]">
              <AnimatePresence mode="wait">
                {!isRevealed ? (
                  <motion.div
                    key="hidden"
                    initial={{ rotateY: -180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
                    whileHover={!isTransitioning ? { rotateY: 5, rotateX: -5 } : {}}
                    className="w-full h-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 cursor-pointer hover:border-emerald-500/40 transition-all group shadow-2xl relative overflow-hidden"
                    onClick={() => !isTransitioning && setIsRevealed(true)}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center animate-pulse border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Palette className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="uppercase text-[10px] font-black tracking-[0.4em] text-emerald-500">Засекречено</p>
                      <p className="text-xs font-bold text-gray-500 px-8">Нажмите, чтобы узнать тему</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="revealed"
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
                    className={`w-full h-full rounded-[2.5rem] p-8 flex flex-col items-center justify-between text-center border-2 shadow-2xl ${currentPlayer.isSpy ? 'bg-gradient-to-br from-red-950/40 to-black border-red-500' : 'bg-gradient-to-br from-sky-950/40 to-black border-sky-500'}`}
                  >
                    <div className="w-full flex-1 flex flex-col items-center justify-center py-4">
                      {currentPlayer.isSpy ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                          <div className="w-28 h-28 rounded-3xl bg-red-500 flex items-center justify-center mx-auto shadow-2xl shadow-red-500/40 rotate-12">
                            <Ghost className="w-14 h-14 text-white" />
                          </div>
                          <div>
                            <h4 className="text-4xl font-black uppercase tracking-tighter text-red-600 mb-2 italic leading-none">Самозванец</h4>
                            <div className="h-px w-12 bg-red-500/30 mx-auto mb-4" />
                            <p className="text-gray-400 text-sm leading-relaxed">
                              Слово неизвестно. Тема: <span className="text-white font-bold">{category}</span>.<br />Подстраивайся и пытайся не выдать себя!
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                          <div className="space-y-2">
                            <div className="w-20 h-20 rounded-3xl bg-sky-500/20 flex items-center justify-center mx-auto mb-4 border border-sky-500/30">
                              <Palette className="w-10 h-10 text-sky-500" />
                            </div>
                            <p className="text-[10px] text-sky-500 uppercase font-black tracking-[0.3em]">Задание получено</p>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-tight">{word}</h2>
                            <p className="text-[10px] text-gray-500 uppercase font-bold italic">Тема: {category}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextPlayer}
                      className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-xl"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-xs">Понятно</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center px-8 leading-relaxed">
              За игру каждый делает ровно {selectedRounds === 1 ? 'одну линию' : `${selectedRounds} линии`} · {selectedTimer > 0 ? `таймер ${selectedTimer}с` : 'без таймера'}
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
