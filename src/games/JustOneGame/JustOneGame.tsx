import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../../services/storageService';
import { feedbackService } from '../../services/feedbackService';
import { JUST_ONE_DATA_BY_DIFFICULTY } from '../../constants/justOneContent';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton, GameCard } from '../../components/UI';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { useGameSettings } from '../../contexts/GameSettingsContext';

interface JustOneGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const JustOneGame: React.FC<JustOneGameProps> = ({ playerNames, onBack }) => {
  const { difficulty } = useGameSettings();
  const [guesserIdx, setGuesserIdx] = useState(0);
  const [word, setWord] = useState('');
  const [hints, setHints] = useState<{ [playerName: string]: string }>({});
  const [phase, setPhase] = useState<'pass' | 'hinting' | 'guessing' | 'result'>('pass');
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [visibleHints, setVisibleHints] = useState<string[]>([]);
  const [localHints, setLocalHints] = useState<{ [playerName: string]: string }>({});

  useEffect(() => {
    generateNewWord();
  }, [guesserIdx]);

  const generateNewWord = () => {
    const custom = storageService.getCustomWords('just_one');
    const used = storageService.getUsedWords('just_one');
    const difficultyWords = JUST_ONE_DATA_BY_DIFFICULTY[difficulty] ?? JUST_ONE_DATA_BY_DIFFICULTY.medium;
    const allWords = [...difficultyWords, ...custom];
    
    let available = allWords.filter(w => !used.includes(w));
    
    if (available.length === 0) {
      storageService.resetUsedWords('just_one');
      available = allWords;
    }
    
    const newWord = available[Math.floor(Math.random() * available.length)];
    setWord(newWord);
    storageService.markWordAsUsed('just_one', newWord);

    setHints({});
    setLocalHints({});
    setGuess('');
    setPhase('pass');
  };

  const submitHint = (player: string, hint: string) => {
    if (!hint.trim()) return;
    setHints(prev => ({ ...prev, [player]: hint.trim().toLowerCase() }));
  };

  const startGuessing = () => {
    const hintCounts: { [hint: string]: number } = {};
    const hintValues = Object.values(hints) as string[];
    hintValues.forEach(h => {
      hintCounts[h] = (hintCounts[h] || 0) + 1;
    });
    const unique = hintValues.filter(h => hintCounts[h] === 1);
    setVisibleHints(unique);
    setPhase('guessing');
  };

  const handleGuess = () => {
    const correct = guess.trim().toLowerCase() === word.toLowerCase();
    setIsCorrect(correct);
    
    const settings = storageService.getSettings();

    if (correct) {
      feedbackService.playSound('success');
      feedbackService.vibrate([50, 30, 50]);
      if (settings.visualEffects) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#eab308', '#ffffff', '#ffffff']
        });
      }
    } else {
      feedbackService.playSound('error');
      feedbackService.vibrate(100);
    }
    setPhase('result');
  };

  const nextRound = () => {
    setGuesserIdx((guesserIdx + 1) % playerNames.length);
  };

  const guesser = playerNames[guesserIdx];
  const hinters = playerNames.filter((_, i) => i !== guesserIdx);

  return (
    <div className="flex flex-col h-screen bg-[#07050a]">
      <GameHeader 
        title={GAMES_REGISTRY.just_one.title}
        subtitle="Пойми намек" 
        icon={Lightbulb} 
        themeColor="border-yellow-500/50 text-yellow-500"
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {phase === 'pass' && (
            <motion.div key="pass" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center space-y-10 text-center">
               <div className="space-y-4">
                  <p className="text-[10px] text-white/80 font-black uppercase tracking-[0.3em]">Новый раунд</p>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white/60">Отгадывающий:</h3>
                  <h2 className="text-5xl font-black italic uppercase text-yellow-500 tracking-tighter leading-none">{guesser}</h2>
               </div>
               <div className="p-8 bg-yellow-500/5 border-2 border-yellow-500/10 rounded-[40px] text-sm text-gray-500 max-w-xs transition-all">
                  {guesser}, передай телефон остальным игрокам. Только вы должны видеть загаданное слово!
               </div>
               <PrimaryButton onClick={() => setPhase('hinting')} className="bg-yellow-500">МЫ ВЗЯЛИ ТЕЛЕФОН</PrimaryButton>
            </motion.div>
          )}

          {phase === 'hinting' && (
            <motion.div key="hinting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="text-center space-y-4">
                 <div className="space-y-1">
                    <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Загаданное слово</p>
                    <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter">{word}</h2>
                 </div>
              </div>

              <GameCard className="text-center bg-white/[0.02]">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-1">Отгадывает</p>
                <h3 className="text-2xl font-black italic uppercase text-yellow-500">{guesser}</h3>
              </GameCard>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="text-sm font-bold uppercase tracking-widest text-white/60">Подсказки:</h4>
                   <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-full text-white/50">{Object.keys(hints).length}/{hinters.length}</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {hinters.map(player => (
                    <div key={player} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <span className="font-bold shrink-0 min-w-[80px]">{player}</span>
                      {hints[player] ? (
                        <div className="flex items-center gap-2 text-emerald-500">
                           <span className="text-sm font-black italic uppercase italic tracking-tighter opacity-70">{hints[player]}</span>
                           <CheckCircle className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="flex flex-1 items-center gap-2">
                           <input 
                              type="text" 
                              value={localHints[player] || ''}
                              onChange={(e) => setLocalHints(prev => ({ ...prev, [player]: e.target.value }))}
                              placeholder="Твой намек..."
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-yellow-500/50 outline-none transition-colors"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') submitHint(player, localHints[player] || '');
                              }}
                           />
                           <button 
                             onClick={() => submitHint(player, localHints[player] || '')}
                             className="w-10 h-10 shrink-0 bg-yellow-500 text-black rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                           >
                              <CheckCircle className="w-5 h-5" />
                           </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {Object.keys(hints).length === hinters.length && (
                <PrimaryButton onClick={startGuessing}>
                  ГОТОВО! ПОКАЗАТЬ {guesser.toUpperCase()}
                </PrimaryButton>
              )}
            </motion.div>
          )}

          {phase === 'guessing' && (
            <motion.div key="guessing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center">
              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase italic tracking-tighter">{guesser}, твой черед!</h3>
                <p className="text-gray-400 font-medium">Используй эти подсказки, чтобы угадать слово</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {visibleHints.map((hint, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-8 py-5 bg-white/5 border border-white/10 rounded-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                  >
                    <span className="text-2xl font-black italic uppercase tracking-tight">{hint}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 space-y-4">
                <input 
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Твоя догадка..."
                  className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-center text-3xl font-black italic uppercase outline-none focus:border-yellow-500/50 transition-all"
                />
                <PrimaryButton onClick={handleGuess} disabled={!guess} className="bg-yellow-500">
                  ОТВЕТИТЬ
                </PrimaryButton>
              </div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10">
              <div className="space-y-4">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto" />
                    <h2 className="text-6xl font-black italic uppercase tracking-tighter text-emerald-500">ПРАВИЛЬНО!</h2>
                  </>
                ) : (
                  <>
                    <XCircle className="w-24 h-24 text-red-500 mx-auto" />
                    <h2 className="text-6xl font-black italic uppercase tracking-tighter text-red-500">ОШИБКА</h2>
                  </>
                )}
                <p className="text-xl font-bold uppercase tracking-widest text-white/80">Загаданное слово:</p>
                <div className="text-5xl font-black italic uppercase tracking-tighter">{word}</div>
                {!isCorrect && <p className="text-xl font-bold uppercase tracking-widest text-red-400/60">Твой ответ: {guess}</p>}
              </div>

              <PrimaryButton onClick={nextRound} icon={RotateCcw}>
                СЛЕДУЮЩИЙ РАУНД
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
