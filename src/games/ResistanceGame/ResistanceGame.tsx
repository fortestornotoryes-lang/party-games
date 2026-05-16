import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Skull, CheckCircle2, XCircle, Users, ArrowRight, Home, HelpCircle, X, ChevronRight } from 'lucide-react';
import { Player } from '../../types';
import { RESISTANCE_INSTRUCTIONS, MISSION_SIZES } from '../../constants/resistanceContent';
import { InstructionsModal } from '../../components/InstructionsModal';

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
  const [failedVotesCount, setFailedVotesCount] = useState(0);
  const [phase, setPhase] = useState<'proposing' | 'teamVoting' | 'missionVoting' | 'missionResult' | 'voteResult'>('proposing');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [teamVotes, setTeamVotes] = useState<Record<string, boolean>>({});
  const [missionVotes, setMissionVotes] = useState<boolean[]>([]);
  const [lastMissionSuccess, setLastMissionSuccess] = useState<boolean | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [secretVoteIndex, setSecretVoteIndex] = useState(0);

  const missionSize = (MISSION_SIZES as any)[players.length]?.[missionIndex] || 2;
  const currentLeader = players[leaderIndex % players.length];
  const shuffledMissionVotes = useMemo(
    () => [...missionVotes].sort(() => Math.random() - 0.5),
    [missionVotes.length] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleTogglePlayer = (id: string) => {
    if (phase !== 'proposing') return;
    setSelectedTeam(prev => {
      if (prev.includes(id)) return prev.filter(pId => pId !== id);
      if (prev.length < missionSize) return [...prev, id];
      return prev;
    });
  };

  const startTeamVoting = () => {
    setPhase('teamVoting');
    setTeamVotes({});
  };

  const handleTeamVote = (vote: boolean) => {
    // Current user voting (but in local game, we just simulate/ask each player)
    // For local simplified version, we'll collect all votes
    const currentPlayerToVote = players[Object.keys(teamVotes).length];
    const newVotes = { ...teamVotes, [currentPlayerToVote.id]: vote };
    setTeamVotes(newVotes);

    if (Object.keys(newVotes).length === players.length) {
      const yesVotes = Object.values(newVotes).filter(v => v).length;
      const approved = yesVotes > players.length / 2;
      
      setPhase('voteResult');
      
      if (approved) {
        setFailedVotesCount(0);
      } else {
        const newFailedCount = failedVotesCount + 1;
        setFailedVotesCount(newFailedCount);
        if (newFailedCount >= 5) {
          onFinish('spies');
        }
      }
    }
  };

  const proceedFromVoteResult = () => {
    const yesVotes = Object.values(teamVotes).filter(v => v).length;
    const approved = yesVotes > players.length / 2;

    if (approved) {
      setPhase('missionVoting');
      setMissionVotes([]);
      setSecretVoteIndex(0);
    } else {
      setLeaderIndex(prev => prev + 1);
      setPhase('proposing');
      setSelectedTeam([]);
    }
  };

  const handleMissionVote = (success: boolean) => {
    const newVotes = [...missionVotes, success];
    setMissionVotes(newVotes);
    
    if (newVotes.length === selectedTeam.length) {
      const anyFail = newVotes.includes(false);
      // Logic for 7+ players 4th mission requires 2 fails usually, but we'll stick to 1 fail for simplicity or check rules
      const failed = anyFail;

      setLastMissionSuccess(!failed);
      setPhase('missionResult');

      if (failed) {
        const newSpiesScore = spiesScore + 1;
        setSpiesScore(newSpiesScore);
        if (newSpiesScore >= 3) onFinish('spies');
      } else {
        const newResScore = resistanceScore + 1;
        setResistanceScore(newResScore);
        if (newResScore >= 3) onFinish('resistance');
      }
    } else {
      setSecretVoteIndex(prev => prev + 1);
    }
  };

  const nextMission = () => {
    setMissionIndex(prev => prev + 1);
    setLeaderIndex(prev => prev + 1);
    setPhase('proposing');
    setSelectedTeam([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0502] text-[#e5e7eb] font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-[#0a0502]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">The <span className="text-blue-500">Resistance</span></h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Миссия {missionIndex + 1} // Провалов в сенате: {failedVotesCount}/5</p>
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-md mx-auto space-y-6 pb-20">
          
          {/* Mission Status Track */}
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-[2rem] border border-white/10">
             <div className="flex space-x-2">
               {[...Array(5)].map((_, i) => (
                 <div 
                   key={i} 
                   className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                     i < missionIndex 
                       ? 'opacity-100' 
                       : i === missionIndex 
                         ? 'border-blue-500 bg-blue-500/10 animate-pulse' 
                         : 'border-white/10 opacity-30'
                   }`}
                 >
                   {i + 1}
                 </div>
               ))}
             </div>
             <div className="flex space-x-4">
               <div className="text-center">
                 <p className="text-[8px] uppercase font-black tracking-widest text-blue-500">Синие</p>
                 <p className="text-xl font-black">{resistanceScore}</p>
               </div>
               <div className="text-center">
                 <p className="text-[8px] uppercase font-black tracking-widest text-red-500">Красные</p>
                 <p className="text-xl font-black">{spiesScore}</p>
               </div>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'proposing' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <p className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Лидер миссии</p>
                  </div>
                  <h3 className="text-3xl font-black italic">{currentLeader.name}</h3>
                  <p className="text-gray-500 text-xs">Выбери {missionSize} игроков для выполнения миссии</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {players.map(player => (
                    <button
                      key={player.id}
                      onClick={() => handleTogglePlayer(player.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        selectedTeam.includes(player.id)
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-white/5 border-white/5 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                         <div className={`w-2 h-2 rounded-full ${selectedTeam.includes(player.id) ? 'bg-blue-500 animate-ping' : 'bg-transparent'}`} />
                         <span className="font-bold">{player.name}</span>
                      </div>
                      {player.id === currentLeader.id && <span className="text-[8px] uppercase font-black bg-blue-500 text-white px-2 py-1 rounded-md">Ты</span>}
                    </button>
                  ))}
                </div>

                <button
                  disabled={selectedTeam.length !== missionSize}
                  onClick={startTeamVoting}
                  className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-2xl disabled:opacity-20 transition-all"
                >
                  <Users className="w-5 h-5" />
                  <span>Предложить состав</span>
                </button>
              </motion.div>
            )}

            {phase === 'teamVoting' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-10">
                <div className="text-center space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em]">Голосование за команду</p>
                  <h3 className="text-2xl font-light text-gray-400">Голосует:</h3>
                  <p className="text-4xl font-black">{players[Object.keys(teamVotes).length].name}</p>
                </div>

                <div className="flex gap-4">
                   <button 
                    onClick={() => handleTeamVote(true)}
                    className="flex-1 aspect-square rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-500 hover:text-white group transition-all"
                   >
                     <CheckCircle2 className="w-12 h-12 text-emerald-500 group-hover:text-white" />
                     <span className="text-xs font-black uppercase tracking-widest">Одобрить</span>
                   </button>
                   <button 
                    onClick={() => handleTeamVote(false)}
                    className="flex-1 aspect-square rounded-[2rem] bg-red-500/10 border-2 border-red-500/30 flex flex-col items-center justify-center space-y-2 hover:bg-red-500 hover:text-white group transition-all"
                   >
                     <XCircle className="w-12 h-12 text-red-500 group-hover:text-white" />
                     <span className="text-xs font-black uppercase tracking-widest">Отклонить</span>
                   </button>
                </div>
              </motion.div>
            )}

            {phase === 'voteResult' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                   <h3 className="text-3xl font-black italic">
                     {Object.values(teamVotes).filter(v => v).length > players.length / 2 
                       ? 'Состав Одобрен' 
                       : 'Состав Отклонен'}
                   </h3>
                   <p className="text-gray-500 text-xs">Все голоса были подсчитаны</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   {players.map(p => (
                     <div key={p.id} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                        <span className="text-sm font-bold text-gray-400 truncate mr-2">{p.name}</span>
                        {teamVotes[p.id] ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                     </div>
                   ))}
                </div>

                <button
                  onClick={proceedFromVoteResult}
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
                >
                  <span>Продолжить</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {phase === 'missionVoting' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-10">
                <div className="text-center space-y-2">
                  <div className="inline-block px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full">
                    <p className="text-[9px] text-red-500 uppercase font-black tracking-widest">Секретная операция</p>
                  </div>
                  <h3 className="text-2xl font-light text-gray-400">Действует:</h3>
                  <p className="text-4xl font-black">{players.find(p => p.id === selectedTeam[secretVoteIndex])?.name}</p>
                  <p className="text-xs text-gray-600 px-10">Выбери карту успеха или провала миссии. Твой голос будет скрыт.</p>
                </div>

                <div className="flex gap-4">
                   <button 
                    onClick={() => handleMissionVote(true)}
                    className="flex-1 py-10 rounded-[2rem] bg-blue-600 border-2 border-blue-400/30 flex flex-col items-center justify-center space-y-4 shadow-2xl"
                   >
                     <Shield className="w-16 h-16 text-white" />
                     <div className="text-center">
                        <span className="block text-sm font-black uppercase tracking-widest">УСПЕХ</span>
                        <span className="text-[8px] text-blue-200 uppercase opacity-50">Миссия выполнена</span>
                     </div>
                   </button>
                   <button 
                    onClick={() => handleMissionVote(false)}
                    className="flex-1 py-10 rounded-[2rem] bg-red-600 border-2 border-red-400/30 flex flex-col items-center justify-center space-y-4 shadow-2xl"
                   >
                     <Skull className="w-16 h-16 text-white" />
                     <div className="text-center">
                        <span className="block text-sm font-black uppercase tracking-widest">ПРОВАЛ</span>
                        <span className="text-[8px] text-red-200 uppercase opacity-50">Саботаж</span>
                     </div>
                   </button>
                </div>
              </motion.div>
            )}

            {phase === 'missionResult' && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 py-10">
                 <div className="text-center space-y-4">
                    <div className={`w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl ${lastMissionSuccess ? 'bg-blue-600' : 'bg-red-600'}`}>
                      {lastMissionSuccess ? <Shield className="w-12 h-12 text-white" /> : <Skull className="w-12 h-12 text-white" />}
                    </div>
                    <div className="space-y-1">
                      <h3 className={`text-4xl font-black uppercase tracking-tighter italic ${lastMissionSuccess ? 'text-blue-500' : 'text-red-500'}`}>
                        Миссия {lastMissionSuccess ? 'Удачна' : 'Провалена'}
                      </h3>
                      <p className="text-gray-500 text-xs">
                         {missionVotes.filter(v => !v).length} саботажа зафиксировано
                      </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-5 gap-2 justify-center">
                    {shuffledMissionVotes.map((v, i) => (
                      <div key={i} className={`h-1.5 rounded-full ${v ? 'bg-blue-500' : 'bg-red-500'}`} />
                    ))}
                 </div>

                 <button
                  onClick={nextMission}
                  className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center"
                >
                  Следующая миссия
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <InstructionsModal
        open={showInstructions}
        instructions={RESISTANCE_INSTRUCTIONS}
        onClose={() => setShowInstructions(false)}
        theme="blue"
      />
    </div>
  );
};
