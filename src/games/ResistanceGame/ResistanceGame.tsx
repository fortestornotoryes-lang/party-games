import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Skull, CheckCircle2, XCircle, Users, ArrowRight, RotateCcw, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '../../types';
import { MISSION_SIZES } from '../../constants/resistanceContent';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton, GameCard } from '../../components/UI';

interface ResistanceGameProps {
  players: Player[];
  onBack: () => void;
  onFinish: (winner: 'resistance' | 'spies') => void;
}

export const ResistanceGame: React.FC<ResistanceGameProps> = ({ players, onBack, onFinish }) => {
  const [missionIndex, setMissionIndex] = useState(0);
  const [resistanceScore, setResistanceScore] = useState(0);
  const [spiesScore, setSpiesScore] = useState(0);
  const [leaderIndex, setLeaderIndex] = useState(0);
  const [phase, setPhase] = useState<'proposing' | 'missionVoting' | 'missionResult' | 'gameOver'>('proposing');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [missionVotes, setMissionVotes] = useState<boolean[]>([]);
  const [winner, setWinner] = useState<'resistance' | 'spies' | null>(null);

  const missionSize = (MISSION_SIZES as any)[players.length]?.[missionIndex] || 2;
  const currentLeader = players[leaderIndex % players.length];
  const currentVoterId = selectedTeam[missionVotes.length];
  const currentVoter = players.find(p => p.id === currentVoterId);

  const handleToggle = (id: string) => {
      if (selectedTeam.includes(id)) setSelectedTeam(selectedTeam.filter(pid => pid !== id));
      else if (selectedTeam.length < missionSize) setSelectedTeam([...selectedTeam, id]);
  };

  const handleMissionVote = (success: boolean) => {
      const nextVotes = [...missionVotes, success];
      setMissionVotes(nextVotes);
      if (nextVotes.length === selectedTeam.length) {
          const failed = nextVotes.includes(false);
          
          const nextSpiesScore = spiesScore + (failed ? 1 : 0);
          const nextResScore = resistanceScore + (failed ? 0 : 1);
          setSpiesScore(nextSpiesScore);
          setResistanceScore(nextResScore);
          
          if (nextSpiesScore >= 3 || nextResScore >= 3) {
            setWinner(nextSpiesScore >= 3 ? 'spies' : 'resistance');
            setPhase('gameOver');
          } else {
            setPhase('missionResult');
          }
      } else {
          setPhase('missionVoting');
      }
  };

  const nextMission = () => {
      setMissionIndex(missionIndex + 1);
      setLeaderIndex(leaderIndex + 1);
      setSelectedTeam([]);
      setMissionVotes([]);
      setPhase('proposing');
  };

  useEffect(() => {
    if (phase === 'gameOver' && winner) {
      const colors = winner === 'resistance' ? ['#3b82f6', '#ffffff'] : ['#ef4444', '#000000'];
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [phase, winner]);

  return (
    <div className="flex flex-col min-h-screen bg-[#060807] text-[#e5e7eb] font-sans pb-10">
       <GameHeader 
          title="RESISTANCE" 
          subtitle={`Миссия ${missionIndex + 1}`} 
          icon={Shield} 
          themeColor="border-blue-500/50 text-blue-400"
          onBack={onBack}
       />

       <div className="p-6 flex-1 flex flex-col max-w-sm mx-auto w-full gap-6">
          <div className="flex justify-between p-4 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
             <div className="text-center group">
                <p className="text-[10px] text-blue-500 font-black tracking-widest mb-1">ГРУППА</p>
                <div className="flex items-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < resistanceScore ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5 border border-white/10'}`} />
                  ))}
                </div>
             </div>
             <div className="text-center group">
                <p className="text-[10px] text-red-500 font-black tracking-widest mb-1">ШПИОНЫ</p>
                <div className="flex items-center gap-2 justify-end">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < spiesScore ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/5 border border-white/10'}`} />
                  ))}
                </div>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'proposing' && (
                <motion.div key="proposing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="text-center space-y-1">
                        <p className="text-[10px] text-white/80 font-black uppercase tracking-widest">Лидер миссии</p>
                        <h3 className="text-4xl font-black italic text-white uppercase">{currentLeader.name}</h3>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mt-2">Выбери {missionSize} чел. для операции</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {players.map(p => (
                          <button key={p.id} onClick={() => handleToggle(p.id)} className={`p-4 rounded-2xl border text-left flex items-center transition-all ${selectedTeam.includes(p.id)?'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10':'bg-white/5 border-white/5 opacity-60'}`}>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${selectedTeam.includes(p.id)?'bg-blue-500 border-blue-500':'border-white/20'}`}>
                                {selectedTeam.includes(p.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`font-black italic uppercase tracking-tight text-lg ${selectedTeam.includes(p.id)?'text-white':'text-gray-500'}`}>{p.name}</span>
                          </button>
                      ))}
                    </div>

                    <PrimaryButton 
                      disabled={selectedTeam.length !== missionSize} 
                      onClick={() => setPhase('missionVoting')} 
                      className="bg-white !text-black"
                      icon={ArrowRight}
                    >
                      НАЧАТЬ МИССИЮ
                    </PrimaryButton>
                </motion.div>
            )}

            {phase === 'missionVoting' && (
                <motion.div key="voting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Голосует</p>
                      <h4 className="text-4xl font-black italic text-white uppercase">{currentVoter?.name}</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4 w-full">
                        <button onClick={() => handleMissionVote(true)} className="group p-8 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] flex flex-col items-center gap-4 active:scale-95 transition-all">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            <span className="text-xl font-black italic text-emerald-500 uppercase tracking-widest">УСПЕХ</span>
                        </button>
                        <button onClick={() => handleMissionVote(false)} className="group p-8 bg-red-500/10 border-2 border-red-500/30 rounded-[2.5rem] flex flex-col items-center gap-4 active:scale-95 transition-all">
                            <XCircle className="w-12 h-12 text-red-500" />
                            <span className="text-xl font-black italic text-red-500 uppercase tracking-widest">ПРОВАЛ</span>
                        </button>
                    </div>
                </motion.div>
            )}

            {phase === 'missionResult' && (
                <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 text-center flex-1 flex flex-col items-center justify-center">
                    <div className={`p-12 rounded-[40px] w-full border-2 ${missionVotes.includes(false) ? 'bg-red-500/10 border-red-500/40' : 'bg-emerald-500/10 border-emerald-500/40'}`}>
                        <div className="mb-4 flex justify-center">
                          {missionVotes.includes(false) ? <Skull className="w-16 h-16 text-red-500" /> : <Activity className="w-16 h-16 text-emerald-500" />}
                        </div>
                        <h3 className={`text-5xl font-black italic uppercase leading-none ${missionVotes.includes(false) ? 'text-red-500' : 'text-emerald-500'}`}>
                          ОПЕРАЦИЯ<br/>{missionVotes.includes(false) ? 'ПРОВАЛЕНА' : 'УДАЧНА'}
                        </h3>
                    </div>
                    <PrimaryButton onClick={nextMission} variant="outline" icon={ArrowRight}>ДАЛЕЕ</PrimaryButton>
                </motion.div>
            )}

            {phase === 'gameOver' && (
                <motion.div key="over" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-12 text-center flex-1 flex flex-col items-center justify-center">
                    <div className={`p-12 rounded-[40px] w-full border-4 ${winner === 'resistance' ? 'bg-blue-500/10 border-blue-500/60 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'bg-red-500/10 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.3)]'}`}>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-60">ФИНАЛЬНЫЙ СЧЕТ</h2>
                        <h3 className={`text-6xl font-black italic uppercase italic leading-none ${winner === 'resistance' ? 'text-blue-500' : 'text-red-500'}`}>
                          {winner === 'resistance' ? 'ГРУППА' : 'ШПИОНЫ'}<br/>ПОБЕДИЛИ
                        </h3>
                    </div>

                    <div className="w-full space-y-3">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Агенты шпионажа</p>
                       <div className="grid grid-cols-2 gap-2">
                          {players.filter(p => p.isSpy).map(p => (
                            <div key={p.id} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl font-bold italic uppercase text-red-400">{p.name}</div>
                          ))}
                       </div>
                    </div>

                    <PrimaryButton onClick={() => onFinish(winner!)} icon={RotateCcw} variant="colored">ЗАНОВО</PrimaryButton>
                </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
};
