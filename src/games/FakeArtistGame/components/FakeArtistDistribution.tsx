import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Ghost, EyeOff } from 'lucide-react';
import { Player } from '../../../types';
import { storageService } from '../../../services/storageService';
import { useGameSettings } from '../../../contexts/GameSettingsContext';
import { FAKE_ARTIST_DATA_BY_DIFFICULTY, FakeArtistDifficulty } from '../../../constants/fakeArtistContent';

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
    const staticPool = FAKE_ARTIST_DATA_BY_DIFFICULTY[diff] ?? FAKE_ARTIST_DATA_BY_DIFFICULTY['easy'];
    const custom = storageService.getCustomWords('fake_artist');
    const used = storageService.getUsedWords('fake_artist');

    const pool = [...staticPool, ...custom.map(w => ({ word: w, category: 'Своё' }))];
    let available = pool.filter(item => !used.includes(item.word));
    if (available.length === 0) {
      storageService.resetUsedWords('fake_artist');
      available = pool;
    }

    const item = available[Math.floor(Math.random() * available.length)];
    setWord(item.word);
    setCategory(item.category);
    storageService.markWordAsUsed('fake_artist', item.word);
  }, [difficulty]);

  const next = () => {
    if (currentIndex === players.length - 1) {
      onFinish(word, category, rounds ?? 2, timerSeconds ?? 0);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 text-gray-200 selection:bg-premium-green/30 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm text-center space-y-8"
        >
          <div className="space-y-1 text-center">
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Личный доступ</p>
            <h3 className="text-2xl font-black italic text-white/50 uppercase tracking-tighter">{players[currentIndex].name}</h3>
          </div>

          <div
            className="w-full aspect-[4/5] bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center cursor-pointer overflow-hidden relative shadow-2xl"
            onClick={() => setIsRevealed(true)}
          >
            <AnimatePresence mode="wait">
              {!isRevealed ? (
                <motion.div
                  key="hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6 px-10"
                >
                  <div className="w-24 h-24 bg-premium-green/10 rounded-full flex items-center justify-center border border-premium-green/20">
                    <EyeOff className="w-10 h-10 text-premium-green/40 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-black text-premium-green tracking-[0.2em]">Передай девайс</p>
                    <h4 className="text-3xl font-black text-white italic">{players[currentIndex].name}</h4>
                  </div>
                  <p className="text-white/30 font-bold uppercase text-[10px] tracking-widest leading-relaxed">Нажми, когда будешь один, чтобы увидеть роль</p>
                </motion.div>
              ) : (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-10 space-y-8 flex flex-col items-center w-full"
                >
                  {players[currentIndex].isSpy ? (
                    <div className="space-y-6 w-full">
                      <Ghost className="w-20 h-20 text-premium-red mx-auto" />
                      <div className="space-y-2">
                        <h4 className="text-4xl font-black text-premium-red italic uppercase leading-none">САМОЗВАНЕЦ</h4>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Тема: {category}</p>
                      </div>
                      <div className="p-4 bg-premium-red/5 rounded-2xl border border-premium-red/10">
                        <p className="text-xs text-premium-red font-bold uppercase">Слово неизвестно. Рисуй так, чтобы не выдать себя!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 w-full">
                      <Palette className="w-20 h-20 text-premium-sky mx-auto" />
                      <div className="space-y-2">
                        <p className="text-[10px] text-premium-sky font-black uppercase tracking-widest">Твое слово:</p>
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{word}</h2>
                      </div>
                      <p className="text-xs text-white/30 uppercase font-black italic tracking-widest">Тема: {category}</p>
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                  >
                    Понятно
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
