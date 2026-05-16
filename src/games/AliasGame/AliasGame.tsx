import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Play, CheckCircle, XCircle, RotateCcw, Zap, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../../services/storageService';
import { feedbackService } from '../../services/feedbackService';
import { ALIAS_CATEGORIES } from '../../constants/aliasContent';
import { GameHeader } from '../../components/GameHeader';
import { useTimer } from '../../hooks/useTimer';
import { PrimaryButton, GameCard } from '../../components/UI';

interface Team {
  name: string;
  players: string[];
  score: number;
}

interface AliasGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const AliasGame: React.FC<AliasGameProps> = ({ playerNames, onBack }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [phase, setPhase] = useState<'start' | 'playing' | 'round_end' | 'game_over'>('start');
  const [currentWord, setCurrentWord] = useState('');
  const [roundScore, setRoundScore] = useState(0);

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer({
    initialTime: 60,
    onTimeUp: () => setPhase('round_end')
  });

  const getAvailableWords = () => {
    const staticWords = ALIAS_CATEGORIES.flatMap(c => c.words);
    const customWords = storageService.getCustomWords('alias');
    const used = storageService.getUsedWords('alias');
    const all = [...staticWords, ...customWords];
    let available = all.filter(w => !used.includes(w));
    
    if (available.length === 0) {
      storageService.resetUsedWords('alias');
      available = all;
    }
    return available;
  };

  useEffect(() => {
    const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    setTeams([
      { name: 'Красные', players: shuffled.slice(0, mid), score: 0 },
      { name: 'Синие', players: shuffled.slice(mid), score: 0 }
    ]);
  }, [playerNames]);

  const startRound = () => {
    resetTimer(60);
    setRoundScore(0);
    nextWord();
    setPhase('playing');
    startTimer();
  };

  const nextWord = () => {
    const available = getAvailableWords();
    const word = available[Math.floor(Math.random() * available.length)];
    setCurrentWord(word);
    storageService.markWordAsUsed('alias', word);
  };

  const handleCorrect = () => {
    feedbackService.playSound('success');
    feedbackService.vibrate(20);
    setRoundScore(s => s + 1);
    nextWord();
  };

  const handleSkip = () => {
    feedbackService.playSound('error');
    feedbackService.vibrate(50);
    setRoundScore(s => s - 1);
    nextWord();
  };

  const finishRound = () => {
    const newTeams = [...teams];
    newTeams[currentTeamIdx].score += roundScore;
    setTeams(newTeams);

    if (newTeams[currentTeamIdx].score >= 30) {
      setPhase('game_over');
    } else {
      setCurrentTeamIdx((currentTeamIdx + 1) % teams.length);
      setPhase('start');
    }
  };

  useEffect(() => {
    if (phase === 'game_over') {
      const settings = storageService.getSettings();
      feedbackService.playSound('success');
      feedbackService.vibrate([100, 50, 100]);
      
      if (settings.visualEffects) {
        confetti({
          particleCount: 200,
          spread: 80,
          origin: { y: 0.6 },
          colors: currentTeamIdx === 0 ? ['#ef4444', '#ffffff'] : ['#3b82f6', '#ffffff']
        });
      }
    }
  }, [phase, currentTeamIdx]);

  if (teams.length === 0) return null;

  return (
    <div className="flex flex-col h-screen bg-[#0a0502]">
      <GameHeader 
        title="ALIAS" 
        subtitle="Объясни быстрее" 
        icon={Brain} 
        themeColor="border-sky-500/50 text-sky-400"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {phase === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col p-6 space-y-8"
            >
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                <div className={`p-8 rounded-[40px] border-2 transition-all ${currentTeamIdx === 0 ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.1)]'}`}>
                  <Zap className={`w-16 h-16 mb-4 mx-auto ${currentTeamIdx === 0 ? 'text-red-500' : 'text-blue-500'}`} />
                  <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${currentTeamIdx === 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {teams[currentTeamIdx].name}
                  </h3>
                </div>
                <p className="text-xl font-bold text-white/40 uppercase tracking-widest">Твой черед объяснять!</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {teams.map((t, i) => (
                  <GameCard key={i} className={i === 0 ? 'bg-red-500/5 border-red-500/10' : 'bg-blue-500/5 border-blue-500/10'}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.name}</span>
                      <Trophy className={`w-3 h-3 ${t.score >= 20 ? 'text-yellow-500' : 'text-white/20'}`} />
                    </div>
                    <div className="text-3xl font-black italic mt-1">{t.score}</div>
                  </GameCard>
                ))}
              </div>

              <PrimaryButton onClick={startRound} icon={Play}>
                НАЧАТЬ РАУНД
              </PrimaryButton>
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col p-6"
            >
              <div className="flex justify-center mb-8">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className={timeLeft <= 10 ? 'text-red-500' : 'text-sky-500'} strokeDasharray={276} strokeDashoffset={276 - (276 * timeLeft) / 60} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-black tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {timeLeft}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                  key={currentWord}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="space-y-2"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500/50">Объясни слово</p>
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-tight break-words">
                    {currentWord}
                  </h2>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <GameCard onClick={handleSkip} className="flex flex-col items-center justify-center space-y-2 group active:bg-red-500/20 active:border-red-500/50 py-10">
                  <XCircle className="w-12 h-12 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Пропустить</span>
                </GameCard>
                <GameCard onClick={handleCorrect} className="flex flex-col items-center justify-center space-y-2 group active:bg-emerald-500/20 active:border-emerald-500/50 py-10">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Угадано</span>
                </GameCard>
              </div>
            </motion.div>
          )}

          {phase === 'round_end' && (
            <motion.div
              key="round_end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col p-6 items-center justify-center text-center space-y-12"
            >
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Время вышло</div>
                <div className="text-9xl font-black italic text-emerald-500 tracking-tighter">+{roundScore}</div>
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white/80">Очков за раунд</h3>
              </div>

              <PrimaryButton onClick={finishRound}>
                ПРОДОЛЖИТЬ
              </PrimaryButton>
            </motion.div>
          )}

          {phase === 'game_over' && (
            <motion.div
              key="game_over"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col p-6 items-center justify-center text-center space-y-12"
            >
              <div className="relative">
                <div className="absolute -inset-20 bg-emerald-500/20 blur-[100px] rounded-full" />
                <Trophy className="w-32 h-32 text-emerald-500 mx-auto mb-8 relative" />
                <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white mb-2 relative">
                  ПОБЕДА!
                </h2>
                <p className="text-xl font-bold text-emerald-500 uppercase tracking-widest relative">
                  Команда {teams[currentTeamIdx].name}
                </p>
              </div>

              <PrimaryButton onClick={onBack} icon={RotateCcw} variant="emerald">
                В ГЛАВНОЕ МЕНЮ
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
