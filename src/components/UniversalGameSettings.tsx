import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionLabel } from './UI';
import { Difficulty, GameMode } from '../types';
import { Shield, Zap, Target, LucideIcon } from 'lucide-react';
import { contentService } from '../services/contentService';

import { GameModeOption } from '../types';

interface UniversalGameSettingsProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  currentGameId?: string;
  mode?: GameMode;
  setMode?: (m: GameMode) => void;
  rounds?: number;
  setRounds?: (r: number) => void;
  timerSeconds?: number;
  setTimerSeconds?: (s: number) => void;
  modes?: GameModeOption[];
  difficultyLabel?: string;
  modeLabel?: string;
}

export const UniversalGameSettings: React.FC<UniversalGameSettingsProps> = ({
  difficulty,
  setDifficulty,
  currentGameId,
  mode,
  setMode,
  rounds,
  setRounds,
  timerSeconds,
  setTimerSeconds,
  modes = [],
  difficultyLabel = 'Сложность',
  modeLabel = 'Режим игры'
}) => {
  const getDiffExtraInfo = (d: Difficulty) => {
    switch (currentGameId) {
      case 'telestrations':
        if (d === 'easy') return '90с / 45с';
        if (d === 'medium') return '60с / 30с';
        return '45с / 25с';
      case 'spy':
        if (d === 'easy') return '10 мин';
        if (d === 'medium') return '8 мин';
        return '5 мин';
      case 'alias':
        if (d === 'easy') return '90 сек';
        if (d === 'medium') return '60 сек';
        return '40 сек';
      default: return null;
    }
  };

  const getRemainingCount = (d: Difficulty) => {
    if (!currentGameId || currentGameId === 'spy') return null;
    return contentService.getRemainingWordsCount(currentGameId, d);
  };

  return (
    <div className="space-y-12 mb-10">
      <div>
        <div className="flex items-center gap-3 mb-6 px-1">
           <Target className="w-4 h-4 text-white/20" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">{difficultyLabel}</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
            const extra = getDiffExtraInfo(d);
            const isActive = difficulty === d;
            
            return (
              <motion.button
                key={d}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(d)}
                className={`flex flex-col items-center justify-center py-6 rounded-premium-md transition-all relative overflow-hidden h-24 ${
                  isActive
                    ? d === 'easy' ? 'bg-premium-green/10 border-premium-green/40 text-premium-green shadow-[0_0_30px_rgba(0,216,138,0.15)] border' :
                      d === 'medium' ? 'bg-premium-sky/10 border-premium-sky/40 text-premium-sky shadow-[0_0_30px_rgba(31,182,255,0.15)] border' :
                      'bg-premium-red/10 border-premium-red/40 text-premium-red shadow-[0_0_30px_rgba(255,46,77,0.15)] border'
                    : 'glass-card border-white/5 opacity-60 hover:opacity-60 border'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-diff-bg"
                    className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
                  />
                )}
                <span className={`text-[13px] font-black italic uppercase tracking-tighter mb-0.5 ${isActive ? '' : 'text-white/40'}`}>
                  {d === 'easy' ? 'ЛЕГКО' : d === 'medium' ? 'НОРМА' : 'ПРОФИ'}
                </span>
                {extra && (
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'opacity-80' : 'text-white/20'}`}>
                    {extra}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {modes.length > 0 && setMode && (
        <div>
           <div className="flex items-center gap-3 mb-6 px-1">
              <Zap className="w-4 h-4 text-white/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">{modeLabel}</span>
           </div>
          <div className="flex flex-col gap-4">
            {modes.map((m) => {
              const isActive = mode === m.id;
              
              return (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode(m.id)}
                  className={`p-6 rounded-premium-lg border transition-all text-left flex items-center gap-6 relative overflow-hidden ${
                    isActive
                      ? 'bg-premium-red/10 border-premium-red/40 text-white shadow-[0_0_30px_rgba(255,46,77,0.15)]'
                      : 'glass-card border-white/5 text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-14 h-14 shrink-0 rounded-[18px] flex items-center justify-center transition-all ${
                    isActive ? 'bg-premium-red text-white shadow-xl shadow-premium-red/20' : 'bg-white/5 text-white/20'
                  }`}>
                    <m.icon className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-[17px] font-black italic uppercase tracking-tight mb-1 text-white opacity-90">{m.name}</div>
                    <div className="text-[12px] font-medium leading-tight opacity-60 italic">{m.desc}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {currentGameId === 'fake_artist' && setRounds && setTimerSeconds && (
        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
               <Shield className="w-4 h-4 text-white/20" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Раунды</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(r => (
                <button
                  key={r}
                  onClick={() => setRounds(r)}
                  className={`py-6 rounded-premium-md text-[11px] font-black uppercase tracking-[0.2em] italic border transition-all ${rounds === r ? 'bg-premium-green/10 border-premium-green/40 text-premium-green shadow-[0_0_30px_rgba(0,216,138,0.15)]' : 'glass-card border-white/5 text-white/20 opacity-60'}`}
                >
                  {r} {r === 1 ? 'КРУГ' : 'КРУГА'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
               <Zap className="w-4 h-4 text-white/20" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Таймер хода</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[0, 15, 30].map(s => (
                <button
                  key={s}
                  onClick={() => setTimerSeconds(s)}
                  className={`py-6 rounded-premium-md text-[11px] font-black uppercase tracking-[0.2em] italic border transition-all h-16 flex items-center justify-center ${timerSeconds === s ? 'bg-premium-green/10 border-premium-green/40 text-premium-green shadow-[0_0_30px_rgba(0,216,138,0.15)]' : 'glass-card border-white/5 text-white/20 opacity-60'}`}
                >
                  {s === 0 ? '∞' : `${s} СЕК`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
