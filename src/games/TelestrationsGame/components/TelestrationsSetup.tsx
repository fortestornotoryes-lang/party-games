import React from 'react';
import { motion } from 'motion/react';
import { Pencil, ArrowRight } from 'lucide-react';
import { DIFFICULTY_CONFIG, Difficulty } from '@/constants/telestrationsContent';

interface Props {
  playerCount: number;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStart: () => void;
}

export const TelestrationsSetup: React.FC<Props> = ({
  playerCount,
  difficulty,
  onDifficultyChange,
  onStart,
}) => (
  <motion.div
    key="setup"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.25 }}
    className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-6"
  >
    <div className="text-center space-y-2">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-premium-orange/10 border border-premium-orange/20 mb-1">
        <Pencil className="w-7 h-7 text-premium-orange" />
      </div>
      <h3 className="text-3xl font-black italic uppercase tracking-tighter">Настройки</h3>
      <p className="text-white/30 text-sm">{playerCount} игроков</p>
    </div>

    <div className="w-full max-w-sm space-y-3">
      <p className="text-[9px] text-white/25 uppercase font-black tracking-widest mb-3 text-center">
        Сложность
      </p>
      {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
        const cfg = DIFFICULTY_CONFIG[diff];
        const isSelected = difficulty === diff;
        return (
          <motion.button
            key={diff}
            whileTap={{ scale: 0.97 }}
            onClick={() => onDifficultyChange(diff)}
            className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
              isSelected ? `${cfg.border} ${cfg.bg}` : 'border-white/10 bg-white/5 opacity-50'
            }`}
          >
            <span className="text-2xl leading-none">{cfg.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4
                className={`text-base font-black uppercase italic ${isSelected ? cfg.text : 'text-white/40'}`}
              >
                {cfg.label}
              </h4>
              <p className="text-xs text-white/30 mt-0.5 leading-tight">{cfg.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={`text-base font-black tabular-nums ${isSelected ? cfg.text : 'text-white/25'}`}
              >
                {cfg.drawTime}с
              </p>
              <p className="text-[9px] text-white/25 uppercase font-bold tracking-widest">
                рисунок
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>

    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onStart}
      className="w-full max-w-sm py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl"
    >
      <span>Начать</span>
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  </motion.div>
);
