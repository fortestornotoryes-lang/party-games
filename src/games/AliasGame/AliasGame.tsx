import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Play, CheckCircle, XCircle, RotateCcw, Zap, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../../services/storageService';
import { feedbackService } from '../../services/feedbackService';
import { contentService } from '../../services/contentService';
import { ALIAS_DIFFICULTY_CONFIG, WIN_SCORE, TROPHY_THRESHOLD } from '../../constants/aliasContent';
import { GameKey } from '../../types/games';
import { GameHeader } from '../../components/GameHeader';
import { useTimer } from '../../hooks/useTimer';
import { PrimaryButton } from '../../components/UI';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { AliasPhase, Team } from './types';

interface AliasGameProps { playerNames: string[]; onBack: () => void; }

const TEAMS_CONFIG = [
  { name: 'Красные', color: 'red' as const },
  { name: 'Синие',   color: 'blue' as const },
] as const;

const CIRCUMFERENCE = 2 * Math.PI * 28;

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

export const AliasGame: React.FC<AliasGameProps> = ({ playerNames, onBack }) => {
  const { difficulty } = useGameSettings();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [phase, setPhase] = useState<AliasPhase>(AliasPhase.Start);
  const [currentWord, setCurrentWord] = useState('');
  const [roundScore, setRoundScore] = useState(0);

  const roundTime = ALIAS_DIFFICULTY_CONFIG[difficulty].roundTime;
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer({
    initialTime: roundTime,
    onTimeUp: () => setPhase(AliasPhase.RoundEnd),
  });

  useEffect(() => {
    const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    setTeams([
      { name: TEAMS_CONFIG[0].name, color: TEAMS_CONFIG[0].color, players: shuffled.slice(0, mid), score: 0 },
      { name: TEAMS_CONFIG[1].name, color: TEAMS_CONFIG[1].color, players: shuffled.slice(mid), score: 0 },
    ]);
  }, [playerNames]);

  const nextWord = () => {
    const available = contentService.getAliasWords(difficulty);
    const word = available[Math.floor(Math.random() * available.length)];
    setCurrentWord(word);
    storageService.markWordAsUsed(GameKey.Alias, word);
  };

  const startRound = () => {
    resetTimer(roundTime);
    setRoundScore(0);
    nextWord();
    setPhase(AliasPhase.Playing);
    startTimer();
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
    const updatedTeams = teams.map((t, i) =>
      i === currentTeamIdx ? { ...t, score: t.score + roundScore } : t
    );
    setTeams(updatedTeams);
    if (updatedTeams[currentTeamIdx].score >= WIN_SCORE) {
      setPhase(AliasPhase.GameOver);
    } else {
      setCurrentTeamIdx(i => (i + 1) % teams.length);
      setPhase(AliasPhase.Start);
    }
  };

  useEffect(() => {
    if (phase !== AliasPhase.GameOver) return;
    const settings = storageService.getSettings();
    feedbackService.playSound('success');
    feedbackService.vibrate([100, 50, 100]);
    if (settings.visualEffects) {
      confetti({
        particleCount: 200, spread: 80, origin: { y: 0.6 },
        colors: currentTeamIdx === 0 ? ['#FF2E4D', '#ffffff'] : ['#3F7BFF', '#ffffff'],
      });
    }
  }, [phase, currentTeamIdx]);

  if (teams.length === 0) return null;

  const currentTeam = teams[currentTeamIdx];
  const isRed = currentTeam.color === 'red';
  const teamColor = isRed ? 'text-premium-red' : 'text-premium-blue';
  const teamBg = isRed ? 'bg-premium-red/[0.07] border-premium-red/20' : 'bg-premium-blue/[0.07] border-premium-blue/20';

  return (
    <div className="flex flex-col h-screen">
      <GameHeader
        title={GAMES_REGISTRY.alias.title}
        subtitle="Объясни быстрее"
        icon={Brain}
        theme="blue"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ── START ── */}
          {phase === AliasPhase.Start && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
              className="h-full flex flex-col p-6 gap-5"
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-5">
                <motion.div
                  initial={{ scale: 0.82 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className={`w-full max-w-[220px] py-8 px-6 rounded-[32px] border-2 ${teamBg} flex flex-col items-center`}
                  style={{ boxShadow: isRed ? '0 0 60px rgba(255,46,77,0.12)' : '0 0 60px rgba(63,123,255,0.12)' }}
                >
                  <Zap className={`w-12 h-12 mb-3 ${teamColor}`} />
                  <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${teamColor}`}>
                    {currentTeam.name}
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mt-2">Твой черёд!</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {teams.map((t, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-[20px] border ${
                      i === 0 ? 'bg-premium-red/[0.05] border-premium-red/15' : 'bg-premium-blue/[0.05] border-premium-blue/15'
                    } ${i === currentTeamIdx ? 'ring-1 ring-white/10' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${i === 0 ? 'text-premium-red/50' : 'text-premium-blue/50'}`}>{t.name}</span>
                      <Trophy className={`w-3 h-3 ${t.score >= TROPHY_THRESHOLD ? 'text-premium-yellow' : 'text-white/10'}`} />
                    </div>
                    <div className={`text-4xl font-black italic ${i === 0 ? 'text-premium-red' : 'text-premium-blue'}`}>{t.score}</div>
                    <div className="text-[9px] text-white/15 font-black uppercase tracking-widest mt-0.5">/ {WIN_SCORE}</div>
                  </div>
                ))}
              </div>

              <PrimaryButton onClick={startRound} icon={Play}>НАЧАТЬ РАУНД</PrimaryButton>
            </motion.div>
          )}

          {/* ── PLAYING ── */}
          {phase === AliasPhase.Playing && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <div className="flex justify-center pt-5 pb-1">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" />
                    <circle
                      cx="32" cy="32" r="28"
                      stroke={timeLeft <= 10 ? '#FF2E4D' : '#1FB6FF'}
                      strokeWidth="3" fill="none"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / roundTime}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-black tabular-nums ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white'}`}>
                      {timeLeft}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWord}
                    initial={{ opacity: 0, y: 30, scale: 0.84 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                    className="space-y-2"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-sky/35">Объясни слово</p>
                    <h2 className="text-[58px] font-black italic uppercase tracking-tighter text-white leading-none break-words">
                      {currentWord}
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="text-center pb-3">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Очки: </span>
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'}`}>
                  {fmtScore(roundScore)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 px-5 pb-8">
                <button
                  onClick={handleSkip}
                  className="h-[86px] rounded-[22px] bg-premium-red/[0.07] border border-premium-red/20 flex flex-col items-center justify-center gap-2 active:scale-95 active:bg-premium-red/14 transition-all"
                >
                  <XCircle className="w-8 h-8 text-premium-red" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-premium-red/55">Пропустить</span>
                </button>
                <button
                  onClick={handleCorrect}
                  className="h-[86px] rounded-[22px] bg-premium-green/[0.07] border border-premium-green/20 flex flex-col items-center justify-center gap-2 active:scale-95 active:bg-premium-green/14 transition-all"
                >
                  <CheckCircle className="w-8 h-8 text-premium-green" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-premium-green/55">Угадано</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── ROUND END ── */}
          {phase === AliasPhase.RoundEnd && (
            <motion.div
              key="round_end"
              initial={{ opacity: 0, scale: 0.84 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="h-full flex flex-col p-6 items-center justify-center text-center gap-8"
            >
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Время вышло</p>
                <div className={`text-[96px] font-black italic tracking-tighter leading-none ${roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'}`}>
                  {fmtScore(roundScore)}
                </div>
                <h3 className="text-sm font-black uppercase italic tracking-tight text-white/45">Очков за раунд</h3>
              </div>
              <PrimaryButton onClick={finishRound}>ПРОДОЛЖИТЬ</PrimaryButton>
            </motion.div>
          )}

          {/* ── GAME OVER ── */}
          {phase === AliasPhase.GameOver && (
            <motion.div
              key="game_over"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col p-6 items-center justify-center text-center gap-10"
            >
              <div className="relative">
                <div className={`absolute -inset-16 blur-[70px] rounded-full ${isRed ? 'bg-premium-red/15' : 'bg-premium-blue/15'}`} />
                <Trophy className={`w-24 h-24 mx-auto mb-5 relative ${teamColor}`} />
                <h2 className="text-[70px] font-black italic uppercase tracking-tighter text-white mb-2 relative leading-none">
                  ПОБЕДА!
                </h2>
                <p className={`text-lg font-black uppercase tracking-[0.25em] relative ${teamColor}`}>
                  Команда {currentTeam.name}
                </p>
              </div>
              <PrimaryButton onClick={onBack} icon={RotateCcw} variant={isRed ? 'red' : 'blue'}>
                В ГЛАВНОЕ МЕНЮ
              </PrimaryButton>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
