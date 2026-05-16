import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, ChevronRight, Ghost, CheckCircle2, EyeOff } from 'lucide-react';
import { Player } from '../../../types';
import { storageService } from '../../../services/storageService';
import { FAKE_ARTIST_DATA_BY_DIFFICULTY, FakeArtistDifficulty, FAKE_ARTIST_DIFFICULTY_CONFIG } from '../../../constants/fakeArtistContent';

interface Props {
  players: Player[];
  onFinish: (word: string, category: string, rounds: number, timerSeconds: number) => void;
}

export const FakeArtistDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const [phase, setPhase] = useState<'settings' | 'distributing'>('settings');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [diff, setDiff] = useState<FakeArtistDifficulty>('easy');
  const [rounds, setRounds] = useState(2);
  const [timerInSeconds, setTimerInSeconds] = useState(0);

  const handleStart = () => {
    const staticPool = FAKE_ARTIST_DATA_BY_DIFFICULTY[diff];
    const custom = storageService.getCustomWords('fake_artist');
    const used = storageService.getUsedWords('fake_artist');
    
    const pool = [
      ...staticPool,
      ...custom.map(w => ({ word: w, category: 'Своё' }))
    ];

    let available = pool.filter(item => !used.includes(item.word));
    
    if (available.length === 0) {
      storageService.resetUsedWords('fake_artist');
      available = pool;
    }

    const item = available[Math.floor(Math.random() * available.length)];
    setWord(item.word);
    setCategory(item.category);
    storageService.markWordAsUsed('fake_artist', item.word);
    setPhase('distributing');
  };

  const next = () => {
    if (currentIndex === players.length - 1) onFinish(word, category, rounds, timerInSeconds);
    else {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0502] flex items-center justify-center p-6 text-gray-200 selection:bg-emerald-500/30 overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'settings' ? (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-sm space-y-6"
            >
              <div className="text-center">
                <Palette className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">РИСОВАЛЬЩИК</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Настройка параметров</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/80">Сложность</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as FakeArtistDifficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDiff(d)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${diff === d ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-500'}`}
                      >
                        {FAKE_ARTIST_DIFFICULTY_CONFIG[d].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/80">Раунды</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(r => (
                      <button
                        key={r}
                        onClick={() => setRounds(r)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${rounds === r ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-500'}`}
                      >
                        {r} {r === 1 ? 'круг' : 'круга'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/80">Таймер хода</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 15, 30].map(s => (
                      <button
                        key={s}
                        onClick={() => setTimerInSeconds(s)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${timerInSeconds === s ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-500'}`}
                      >
                        {s === 0 ? 'Без лимита' : `${s} сек`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleStart} className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)]">Раздать роли</button>
            </motion.div>
          ) : (
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
               
               <div className="w-full aspect-[4/5] bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center cursor-pointer overflow-hidden relative shadow-2xl" onClick={() => setIsRevealed(true)}>
                 <AnimatePresence mode="wait">
                   {!isRevealed ? (
                     <motion.div 
                       key="hidden"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="flex flex-col items-center gap-6 px-10"
                     >
                       <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                          <EyeOff className="w-10 h-10 text-emerald-500/40 animate-pulse" />
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] uppercase font-black text-emerald-500 tracking-[0.2em]">Передай девайс</p>
                          <h4 className="text-3xl font-black text-white italic">{players[currentIndex].name}</h4>
                       </div>
                       <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">Нажми, когда будешь один, чтобы увидеть роль</p>
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
                            <Ghost className="w-20 h-20 text-red-500 mx-auto" />
                            <div className="space-y-2">
                               <h4 className="text-4xl font-black text-red-600 italic uppercase leading-none">САМОЗВАНЕЦ</h4>
                               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Тема: {category}</p>
                            </div>
                            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                              <p className="text-xs text-red-400 font-bold uppercase">Слово неизвестно. Рисуй так, чтобы не выдать себя!</p>
                            </div>
                          </div>
                       ) : (
                          <div className="space-y-6 w-full">
                            <Palette className="w-20 h-20 text-sky-500 mx-auto" />
                            <div className="space-y-2">
                               <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest">Твое слово:</p>
                               <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{word}</h2>
                            </div>
                            <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Тема: {category}</p>
                          </div>
                       )}
                       <button onClick={(e) => { e.stopPropagation(); next(); }} className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Понятно</button>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};
