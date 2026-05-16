import React from 'react';
import { motion } from 'motion/react';
import { Users, Shield, Moon, Sun } from 'lucide-react';

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
        className="w-20 h-20 rounded-3xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-500 shadow-2xl"
      >
        <Users className="w-10 h-10" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">МАФИЯ</h2>
        <p className="text-gray-500 uppercase tracking-[0.2em] text-[10px] font-bold">Город засыпает...</p>
      </div>

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex justify-center gap-4">
           <Sun className="w-6 h-6 text-yellow-500" />
           <Moon className="w-6 h-6 text-purple-500" />
           <Shield className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Этот режим игры находится в разработке. <br />
          Используйте это приложение как помощника для раздачи ролей или ведения игры.
        </p>
      </div>

      <button
        onClick={onBack}
        className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl"
      >
        Вернуться
      </button>
    </div>
  );
}
