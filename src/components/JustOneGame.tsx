import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ArrowRight, RotateCcw, Home, HelpCircle, X, CheckCircle2, ShieldAlert, Users, Brain } from 'lucide-react';
import { JUST_ONE_INSTRUCTIONS, JUST_ONE_WORDS } from '../constants/justOneContent';

interface JustOneGameProps {
  playerNames: string[];
  onBack: () => void;
}

interface Clue {
  author: string;
  word: string;
  isDuplicate: boolean;
}

export const JustOneGame: React.FC<JustOneGameProps> = ({ playerNames, onBack }) => {
  const [guesserIndex, setGuesserIndex] = useState(0);
  const [phase, setPhase] = useState<'setup_rounds' | 'start' | 'clues' | 'reveal_clues' | 'guess_result' | 'game_over'>('setup_rounds');
  const [maxRounds, setMaxRounds] = useState(13);
  const [secretWord, setSecretWord] = useState('');
  const [clues, setClues] = useState<Clue[]>([]);
  const [currentClueGiverIndex, setCurrentClueGiverIndex] = useState(0);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);

  const clueGiverIndices = playerNames
    .map((_, i) => i)
    .filter(i => i !== guesserIndex);

  const guesser = playerNames[guesserIndex];

  useEffect(() => {
    if (phase === 'start') {
      setSecretWord(JUST_ONE_WORDS[Math.floor(Math.random() * JUST_ONE_WORDS.length)]);
      setClues([]);
      setCurrentClueGiverIndex(0);
      setGuess('');
    }
  }, [phase, guesserIndex]);

  const handleClueSubmit = () => {
    if (!currentInputValue.trim()) return;

    const newClue: Clue = {
      author: playerNames[clueGiverIndices[currentClueGiverIndex]],
      word: currentInputValue.trim().toLowerCase(),
      isDuplicate: false
    };

    const newClues = [...clues, newClue];
    setClues(newClues);
    setCurrentInputValue('');

    if (currentClueGiverIndex === clueGiverIndices.length - 1) {
      // Process duplicates
      const processedClues = newClues.map(clue => {
        const isDup = newClues.some(other => 
          other !== clue && 
          (other.word === clue.word || 
           other.word.includes(clue.word) && clue.word.length > 3 || 
           clue.word.includes(other.word) && other.word.length > 3)
        );
        return { ...clue, isDuplicate: isDup };
      });
      setClues(processedClues);
      setPhase('reveal_clues');
    } else {
      setCurrentClueGiverIndex(prev => prev + 1);
    }
  };

  const handleGuessSubmit = () => {
    const newTotalRounds = totalRounds + 1;
    setTotalRounds(newTotalRounds);
    
    let currentCorrect = false;
    if (guess.toLowerCase().trim() === secretWord.toLowerCase().trim()) {
      setScore(prev => prev + 1);
      currentCorrect = true;
    }
    setPhase('guess_result');
  };

  const nextRound = () => {
    if (maxRounds !== -1 && totalRounds >= maxRounds) {
      setPhase('game_over');
    } else {
      setGuesserIndex((guesserIndex + 1) % playerNames.length);
      setPhase('start');
    }
  };

  const getRank = () => {
    const ratio = score / totalRounds;
    if (ratio >= 0.9) return "Мастера Телепатии";
    if (ratio >= 0.7) return "Профессиональные Намекатели";
    if (ratio >= 0.5) return "Крепкая Команда";
    return "Новички в Мире Намеков";
  };

  const validClues = clues.filter(c => !c.isDuplicate);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#e5e7eb] font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Brain className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">Just <span className="text-emerald-500">One</span></h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              Кооператив // Счёт: {score}/{maxRounds === -1 ? totalRounds : maxRounds}
              {maxRounds !== -1 && ` [${totalRounds}/${maxRounds}]`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowInstructions(true)} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button onClick={onBack} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#064e3b,transparent_50%)] opacity-20" />
        
        <AnimatePresence mode="wait">
          {phase === 'setup_rounds' && (
            <motion.div
              key="setup_rounds"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="h-full flex flex-col items-center justify-center p-8 space-y-12 relative z-10"
            >
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase">Сколько слов разгадаем?</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Выберите количество раундов для этой партии</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {[5, 10, 13, -1].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setMaxRounds(val);
                      setPhase('start');
                    }}
                    className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center space-y-2 ${maxRounds === val ? 'bg-emerald-500 border-emerald-500 text-black scale-105 shadow-xl shadow-emerald-500/20' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                  >
                    <span className="text-3xl font-black">{val === -1 ? '∞' : val}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {val === -1 ? 'Бесконечно' : 'Раундов'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col items-center justify-center p-8 space-y-12 relative z-10"
            >
              <div className="text-center space-y-6">
                <div className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Ведущий</span>
                </div>
                <h3 className="text-5xl font-black italic tracking-tighter text-white">{guesser}</h3>
                <p className="text-gray-400 max-w-xs mx-auto">Отдай телефон остальным. Ты не должен видеть секретное слово!</p>
              </div>

              <div className="w-full max-w-sm p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-4 group">
                <div className="w-16 h-1 bg-emerald-500/30 rounded-full mx-auto" />
                <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-none">Сложите телефон экраном вниз</p>
                <div className="relative overflow-hidden py-4">
                   <h4 className="text-3xl font-black text-emerald-400 blur-md group-hover:blur-0 transition-all duration-500">{secretWord}</h4>
                   <p className="absolute inset-0 flex items-center justify-center text-xs font-black uppercase text-white/20 group-hover:opacity-0 transition-opacity">Наведи, чтобы увидеть</p>
                </div>
              </div>

              <button
                onClick={() => setPhase('clues')}
                className="w-full max-w-sm py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
              >
                <span>Мы готовы подсказывать</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {phase === 'clues' && (
            <motion.div 
              key="clues"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col p-6 space-y-8 relative z-10"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Подсказывает</p>
                  <h3 className="text-3xl font-black italic">{playerNames[clueGiverIndices[currentClueGiverIndex]]}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Слово</p>
                  <p className="text-xl font-bold text-white uppercase">{secretWord}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                 <div className="w-full max-w-sm space-y-4">
                    <p className="text-center text-gray-500 text-sm font-medium">Напиши ОДНО слово, которое поможет <span className="text-white font-bold">{guesser}</span> угадать секретное слово.</p>
                    <input 
                      type="text"
                      autoFocus
                      value={currentInputValue}
                      onChange={(e) => setCurrentInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleClueSubmit()}
                      placeholder="Твой вариант..."
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-2xl font-black text-center placeholder:text-gray-800 focus:border-emerald-500 focus:bg-emerald-500/5 transition-all outline-none"
                    />
                    <button
                      disabled={!currentInputValue.trim()}
                      onClick={handleClueSubmit}
                      className="w-full py-6 bg-emerald-500 text-black rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 disabled:opacity-20 transition-all shadow-xl"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Подтвердить</span>
                    </button>
                    
                    <div className="flex justify-center space-x-2 pt-4">
                      {clueGiverIndices.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === currentClueGiverIndex ? 'w-8 bg-emerald-500' : i < currentClueGiverIndex ? 'w-4 bg-emerald-500/40' : 'w-4 bg-white/10'}`}
                        />
                      ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {phase === 'reveal_clues' && (
            <motion.div 
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col p-6 space-y-12 relative z-10"
            >
              <div className="text-center space-y-2">
                <div className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Момент истины</span>
                </div>
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">{guesser}, твой выход!</h3>
                <p className="text-gray-500">Вот что осталось после удаления дубликатов</p>
              </div>

              <div className="flex-1 flex flex-col space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clues.map((clue, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-6 rounded-3xl border flex items-center justify-between relative overflow-hidden ${clue.isDuplicate ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10 shadow-lg'}`}
                    >
                      {clue.isDuplicate ? (
                        <>
                          <div className="absolute inset-0 bg-red-500/5 backdrop-blur-[2px]" />
                          <p className="text-xl font-bold line-through text-red-500/40 relative z-10">{clue.word}</p>
                          <ShieldAlert className="w-5 h-5 text-red-500/40 relative z-10" />
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-black uppercase text-white relative z-10">{clue.word}</p>
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 relative z-10">
                            <span className="text-[8px] font-black text-emerald-500">{clue.author[0]}</span>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                  {validClues.length === 0 && (
                     <div className="col-span-full p-12 text-center bg-red-500/10 rounded-[3rem] border border-red-500/20 space-y-4">
                        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto opacity-50" />
                        <h4 className="text-xl font-black text-red-500 uppercase">Ой! Все подсказки удалены</h4>
                        <p className="text-gray-500 text-sm">Вы написали слишком много одинаковых слов. <span className="text-white">{guesser}</span> придется гадать вслепую!</p>
                     </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <input 
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Твой ответ..."
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-2xl font-black text-center focus:border-emerald-500 transition-all outline-none"
                />
                <button
                  disabled={!guess.trim()}
                  onClick={handleGuessSubmit}
                  className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-2xl active:scale-95 transition-transform"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Ответить</span>
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'guess_result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center p-8 space-y-12 relative z-10"
            >
              <div className="text-center space-y-4">
                {guess.toLowerCase().trim() === secretWord.toLowerCase().trim() ? (
                  <>
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-12 h-12 text-black" />
                    </div>
                    <h3 className="text-5xl font-black uppercase italic tracking-tighter text-emerald-500">В ТОЧКУ!</h3>
                    <p className="text-gray-400">Великолепная работа команды</p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                      <X className="w-12 h-12 text-black" />
                    </div>
                    <h3 className="text-5xl font-black uppercase italic tracking-tighter text-red-500">МИМО...</h3>
                    <p className="text-gray-400">Было близко, но нет</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Слово было</p>
                  <p className="text-xl font-black text-white uppercase">{secretWord}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Ваш ответ</p>
                  <p className="text-xl font-black text-white uppercase">{guess}</p>
                </div>
              </div>

              <button
                onClick={nextRound}
                className="w-full max-w-sm py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{maxRounds !== -1 && totalRounds >= maxRounds ? "Завершить игру" : "Следующий раунд"}</span>
              </button>
            </motion.div>
          )}

          {phase === 'game_over' && (
            <motion.div 
              key="game_over"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center p-8 space-y-12 relative z-10"
            >
               <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-10 h-10 text-emerald-500" />
                </div>
                <p className="text-[10px] text-emerald-500 uppercase font-black tracking-[0.3em]">Игра завершена</p>
                <h3 className="text-6xl font-black italic tracking-tighter text-white uppercase">{score} / {totalRounds}</h3>
                <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full inline-block">
                  <p className="text-sm font-bold text-gray-400">{getRank()}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 w-full max-w-sm">
                <button
                  onClick={() => {
                    setScore(0);
                    setTotalRounds(0);
                    setPhase('setup_rounds');
                  }}
                  className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Сыграть еще раз</span>
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-6 bg-white/5 text-white/50 border border-white/10 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 active:scale-95 transition-transform"
                >
                  <Home className="w-5 h-5" />
                  <span>В меню</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#120a0a] border border-emerald-500/20 p-8 rounded-[2.5rem] max-w-lg w-full relative">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowInstructions(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Инструкции</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                  {JUST_ONE_INSTRUCTIONS.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.content}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowInstructions(false)} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest">
                  Все понятно
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
