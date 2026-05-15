import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, SkipForward, CheckCircle2, RotateCcw, Home, Brain, Zap, Trophy, Target, ArrowRight, Shuffle, ChevronRight, ChevronLeft } from 'lucide-react';
import { ALIAS_CATEGORIES, WordCategory, ALIAS_INSTRUCTIONS } from '../constants/aliasContent';

interface AliasGameProps {
  playerNames: string[];
  onBack: () => void;
}

interface Team {
  name: string;
  players: string[];
  score: number;
}

type AliasPhase = 'team_setup' | 'settings' | 'round_intro' | 'playing' | 'round_summary' | 'game_over';

export const AliasGame: React.FC<AliasGameProps> = ({ playerNames, onBack }) => {
  const [phase, setPhase] = useState<AliasPhase>('team_setup');
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Команда 1', players: [], score: 0 },
    { name: 'Команда 2', players: [], score: 0 }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<WordCategory>(ALIAS_CATEGORIES[0]);
  const [roundTime, setRoundTime] = useState(60);
  const [winningScore, setWinningScore] = useState(50);
  
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentExplainerIndex, setCurrentExplainerIndex] = useState<number[]>([0, 0]); // Index of explainer for each team
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showInstructions, setShowInstructions] = useState(false);

  // Initial random team assignment
  useEffect(() => {
    const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    setTeams([
      { name: 'Красные', players: shuffled.slice(0, mid), score: 0 },
      { name: 'Синие', players: shuffled.slice(mid), score: 0 },
    ]);
  }, [playerNames]);

  const movePlayer = (playerName: string, fromIdx: number) => {
    const toIdx = fromIdx === 0 ? 1 : 0;
    setTeams(prev => prev.map((team, i) => {
      if (i === fromIdx) return { ...team, players: team.players.filter(p => p !== playerName) };
      if (i === toIdx) return { ...team, players: [...team.players, playerName] };
      return team;
    }));
  };

  const reshuffleTeams = () => {
    const all = teams.flatMap(t => t.players).sort(() => Math.random() - 0.5);
    const mid = Math.ceil(all.length / 2);
    setTeams(prev => [
      { ...prev[0], players: all.slice(0, mid) },
      { ...prev[1], players: all.slice(mid) },
    ]);
  };

  useEffect(() => {
    let timer: number;
    if (phase === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && phase === 'playing') {
      finishRound();
    }
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const startNewRound = () => {
    const shuffled = [...selectedCategory.words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentWordIndex(0);
    setRoundScore(0);
    setTimeLeft(roundTime);
    setPhase('playing');
  };

  const handleWordAction = (isCorrect: boolean) => {
    if (isCorrect) setRoundScore(prev => prev + 1);
    
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      finishRound();
    }
  };

  const finishRound = () => {
    const updatedTeams = [...teams];
    updatedTeams[currentTeamIndex].score += roundScore;
    setTeams(updatedTeams);

    if (updatedTeams[currentTeamIndex].score >= winningScore) {
      setPhase('game_over');
    } else {
      setPhase('round_summary');
    }
  };

  const nextTeamRound = () => {
    // Increment explainer index for the team that just finished
    const newExplainerIndices = [...currentExplainerIndex];
    newExplainerIndices[currentTeamIndex] = (newExplainerIndices[currentTeamIndex] + 1) % teams[currentTeamIndex].players.length;
    setCurrentExplainerIndex(newExplainerIndices);
    
    // Switch to next team
    setCurrentTeamIndex((currentTeamIndex + 1) % teams.length);
    setPhase('round_intro');
  };

  const currentTeam = teams[currentTeamIndex];
  const currentExplainer = currentTeam.players[currentExplainerIndex[currentTeamIndex]];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#e5e7eb] font-sans selection:bg-sky-500/30 overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className={`absolute top-0 left-0 w-full h-full transition-colors duration-1000 ${
          phase === 'playing' ? 'bg-[radial-gradient(circle_at_50%_0%,#0c4a6e,transparent_50%)]' : 
          phase === 'game_over' ? 'bg-[radial-gradient(circle_at_50%_0%,#064e3b,transparent_50%)]' :
          'bg-[radial-gradient(circle_at_500%_0%,#450a0a,transparent_50%)]'
        }`} />
      </div>

      {/* Header */}
      <div className="p-4 sm:p-6 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
            <Brain className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">Alias <span className="text-sky-500">Pro</span></h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              Командный режим {phase !== 'team_setup' && phase !== 'settings' && `// Цель: ${winningScore}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           {phase !== 'playing' && (
             <button onClick={onBack} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                <Home className="w-5 h-5" />
             </button>
           )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative p-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'team_setup' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm space-y-6 z-10"
            >
              <div className="text-center space-y-1">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Команды</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Нажми на игрока чтобы переместить</p>
              </div>

              {/* Two-column team assignment */}
              <div className="grid grid-cols-2 gap-3">
                {teams.map((team, teamIdx) => (
                  <div
                    key={teamIdx}
                    className={`rounded-[2rem] border p-4 space-y-3 min-h-[140px] ${
                      teamIdx === 0
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-blue-500/5 border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-black italic uppercase tracking-tight ${teamIdx === 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {team.name}
                      </h4>
                      <span className={`text-[10px] font-black ${teamIdx === 0 ? 'text-red-500/50' : 'text-blue-500/50'}`}>
                        {team.players.length}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <AnimatePresence mode="popLayout">
                        {team.players.map(playerName => (
                          <motion.button
                            key={playerName}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => movePlayer(playerName, teamIdx)}
                            className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-1 text-xs font-bold transition-colors ${
                              teamIdx === 0
                                ? 'bg-red-500/10 text-red-200 active:bg-red-500/25 border border-red-500/15'
                                : 'bg-blue-500/10 text-blue-200 active:bg-blue-500/25 border border-blue-500/15'
                            }`}
                          >
                            <span className="truncate">{playerName}</span>
                            {teamIdx === 0
                              ? <ChevronRight className="w-3 h-3 shrink-0 opacity-40" />
                              : <ChevronLeft className="w-3 h-3 shrink-0 opacity-40" />
                            }
                          </motion.button>
                        ))}
                      </AnimatePresence>

                      {team.players.length === 0 && (
                        <p className="text-[10px] text-gray-700 text-center py-2 italic">пусто</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shuffle button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={reshuffleTeams}
                className="w-full py-3.5 border border-white/10 bg-white/5 active:bg-white/10 rounded-2xl flex items-center justify-center gap-2 text-gray-400 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Перемешать случайно</span>
              </motion.button>

              <button
                disabled={teams.some(t => t.players.length === 0)}
                onClick={() => setPhase('settings')}
                className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Далее</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {phase === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm space-y-8 z-10"
            >
              <div className="text-center space-y-2">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Настройки</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Выберите параметры игры</p>
              </div>

              <div className="space-y-4">
                {/* Round Time */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Timer className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Время</span>
                      </div>
                      <span className="text-sky-500 font-black">{roundTime}с</span>
                   </div>
                   <div className="flex gap-2">
                      {[30, 60, 90, 120].map(t => (
                        <button 
                          key={t}
                          onClick={() => setRoundTime(t)}
                          className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${roundTime === t ? 'bg-sky-500 text-white' : 'bg-white/5 text-gray-500'}`}
                        >
                          {t}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Winning Score */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Target className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Цель</span>
                      </div>
                      <span className="text-emerald-500 font-black">{winningScore}</span>
                   </div>
                   <div className="flex gap-2">
                      {[25, 50, 75, 100].map(s => (
                        <button 
                          key={s}
                          onClick={() => setWinningScore(s)}
                          className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${winningScore === s ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-500'}`}
                        >
                          {s}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-4">Категория</p>
                   <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {ALIAS_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full p-4 rounded-3xl border text-left transition-all ${selectedCategory.id === cat.id ? 'bg-sky-500/10 border-sky-500' : 'bg-white/5 border-white/10 opacity-60'}`}
                        >
                           <h5 className="font-black italic uppercase text-sm">{cat.name}</h5>
                           <p className="text-[10px] text-gray-500 mt-1">{cat.description}</p>
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              <button
                onClick={() => setPhase('round_intro')}
                className="w-full py-6 bg-white text-black rounded-4xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
              >
                <span>Начать игру</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {phase === 'round_intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="h-full flex flex-col items-center justify-center p-8 space-y-12 z-10 text-center"
            >
               <div className="space-y-6">
                  <div className={`inline-block px-4 py-1 rounded-full border ${currentTeamIndex === 0 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">Очередь команды: {currentTeam.name}</span>
                  </div>
                  <h3 className="text-6xl font-black italic tracking-tighter uppercase">{currentExplainer}</h3>
                  <p className="text-gray-400 max-w-xs mx-auto">Возьми телефон и подготовься объяснять слова своей команде!</p>
               </div>

               <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {teams.map((t, i) => (
                    <div key={i} className={`p-4 rounded-3xl border ${i === currentTeamIndex ? 'bg-white/10 border-white/20 scale-105' : 'bg-white/5 border-white/5 opacity-40 grayscale'} text-center`}>
                       <p className="text-[8px] font-black uppercase text-gray-500 mb-1">{t.name}</p>
                       <p className="text-2xl font-black italic">{t.score}</p>
                    </div>
                  ))}
               </div>

               <button
                  onClick={startNewRound}
                  className="w-full max-w-sm py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
                >
                  <Zap className="w-5 h-5" />
                  <span>Я готов!</span>
                </button>
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full md:max-w-xl flex flex-col items-center space-y-4 sm:space-y-8 z-10"
            >
              <div className="w-full flex justify-between items-center px-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-none mb-1">Счёт раунда</span>
                  <span className="text-3xl font-black text-sky-500 italic leading-none">{roundScore}</span>
                </div>
                <div className={`flex flex-col items-end ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-none mb-1">Осталось</span>
                  <div className="flex items-center space-x-2 leading-none">
                    <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'animate-pulse text-red-500' : 'text-sky-500'}`} />
                    <span className="text-3xl font-black italic leading-none">{timeLeft}</span>
                  </div>
                </div>
              </div>

              <div className="w-full min-h-75 max-h-[44vh] bg-white/5 border-2 border-white/10 rounded-4xl sm:rounded-[3rem] flex flex-col items-center justify-center p-6 sm:p-8 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]" />
                 <AnimatePresence mode="wait">
                    <motion.h2
                      key={currentWordIndex}
                      initial={{ y: 20, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -20, opacity: 0, scale: 1.1 }}
                      className="font-black text-white italic uppercase tracking-tighter z-10 wrap-break-word w-full leading-tight"
                      style={{ fontSize: 'clamp(1.75rem, 8vw, 3rem)' }}
                    >
                      {words[currentWordIndex]}
                    </motion.h2>
                 </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => handleWordAction(false)}
                  className="py-4 sm:py-6 bg-white/5 border border-white/10 text-gray-500 rounded-3xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2 active:bg-white/10 transition-all"
                >
                  <SkipForward className="w-5 h-5" />
                  <span className="text-xs italic">Пропуск</span>
                </button>
                <button
                  onClick={() => handleWordAction(true)}
                  className="py-4 sm:py-6 bg-sky-500 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-2xl shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs italic">Готово</span>
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'round_summary' && (
            <motion.div 
              key="round_summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm text-center space-y-12 z-10"
            >
               <div className="space-y-4">
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] mx-auto flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase">Раунд окончен!</h3>
                  <p className="text-gray-500">Команда <span className="text-white font-bold uppercase italic">{currentTeam.name}</span> набрала:</p>
                  <div className="text-7xl font-black text-emerald-500 italic leading-none">{roundScore}</div>
               </div>

               <div className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Общий счёт</p>
                  <div className="flex justify-around items-center">
                     {teams.map((t, idx) => (
                       <div key={idx} className="text-center">
                          <p className={`text-[10px] font-black uppercase ${idx === 0 ? 'text-red-500' : 'text-blue-500'}`}>{t.name}</p>
                          <p className="text-3xl font-black italic text-white">{t.score}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <button
                  onClick={nextTeamRound}
                  className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
                >
                  <span>Следующая команда</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
          )}

          {phase === 'game_over' && (
            <motion.div 
              key="game_over"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm text-center space-y-12 z-10"
            >
               <div className="space-y-6">
                <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] rotate-12">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase text-emerald-500 leading-tight">Победа за командой<br/>{currentTeam.name}!</h3>
                <p className="text-gray-500">Вы достигли лимита в {winningScore} очков</p>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Финальный счёт</p>
                  <div className="space-y-4">
                    {teams.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                         <span className={`text-lg font-black uppercase italic ${idx === 0 ? 'text-red-500' : 'text-blue-500'}`}>{t.name}</span>
                         <span className="text-3xl font-black text-white italic">{t.score}</span>
                      </div>
                    ))}
                  </div>
              </div>

               <div className="space-y-3">
                  <button
                    onClick={() => {
                      const resetTeams = teams.map(t => ({ ...t, score: 0 }));
                      setTeams(resetTeams);
                      setCurrentTeamIndex(0);
                      setCurrentExplainerIndex([0, 0]);
                      setPhase('settings');
                    }}
                    className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Реванш</span>
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-4 bg-white/5 text-gray-500 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-xs">В меню</span>
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
