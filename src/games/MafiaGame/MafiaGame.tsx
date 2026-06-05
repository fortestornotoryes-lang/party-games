import React from 'react';
import { motion } from 'motion/react';
import { Users, Shield, Moon, Sun } from 'lucide-react';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';

interface Props {
  playerNames: string[];
  onBack: () => void;
}

export default function MafiaGame({ playerNames, onBack }: Props) {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center text-center space-y-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-premium-lg bg-premium-orange/20 border border-premium-orange/40 flex items-center justify-center text-premium-orange shadow-2xl"
      >
        <Users className="w-10 h-10" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
          {GAMES_REGISTRY.mafia.title}
        </h2>
        <p className="text-white/30 uppercase tracking-[0.2em] text-tag font-bold">
          Город засыпает...
        </p>
      </div>

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-premium-lg p-8 space-y-6">
        <div className="flex justify-center gap-4">
          <Sun className="w-6 h-6 text-premium-yellow" />
          <Moon className="w-6 h-6 text-premium-purple" />
          <Shield className="w-6 h-6 text-premium-blue" />
        </div>
        <p className="text-white/40 text-sm leading-relaxed">
          Этот режим игры находится в разработке. <br />
          Используйте это приложение как помощника для раздачи ролей или ведения игры.
        </p>
      </div>

      <button
        onClick={onBack}
        className="px-10 py-4 bg-white text-black rounded-premium-md font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl"
      >
        Вернуться
      </button>
    </div>
  );
}
