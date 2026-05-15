import React from 'react';
import { motion } from 'motion/react';
import { Shield, LayoutGrid, Zap, Users, Brain, Palette, RotateCcw, Pencil, Lightbulb } from 'lucide-react';

interface MainMenuProps {
  onSelectGame: (gameId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 sm:p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#450a0a,transparent_50%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 sm:space-y-12 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="inline-block p-4 rounded-3xl bg-red-600/20 border border-red-500/30 mb-2"
          >
            <LayoutGrid className="w-12 h-12 text-red-500" />
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter uppercase leading-none">
            PARTY <br/><span className="text-red-500 non-italic">HUB</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">Игры для компании</p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame('spy')}
            className="w-full p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight italic">Найти Шпиона</h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  <Users className="w-3 h-3" />
                  <span>4-7 Игроков</span>
                </div>
              </div>
            </div>
            <Zap className="w-6 h-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame('alias')}
            className="w-full p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-sky-500/50 hover:bg-sky-500/5 transition-all text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 -rotate-3 group-hover:rotate-0 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight italic">Alias Rapid</h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  <Users className="w-3 h-3" />
                  <span>2+ Игрока</span>
                </div>
              </div>
            </div>
            <Zap className="w-6 h-6 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame('fake_artist')}
            className="w-full p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-12 group-hover:rotate-0 transition-transform">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight italic">Рисовальщик</h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  <Users className="w-3 h-3" />
                  <span>4-7 Игроков</span>
                </div>
              </div>
            </div>
            <Zap className="w-6 h-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame('resistance')}
            className="w-full p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 -rotate-3 group-hover:rotate-0 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight italic">Сопротивление</h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  <Users className="w-3 h-3" />
                  <span>5-10 Игроков</span>
                </div>
              </div>
            </div>
            <Zap className="w-6 h-6 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame('wavelength')}
            className="w-full p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                <RotateCcw className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight italic">Длина волны</h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  <Users className="w-3 h-3" />
                  <span>2+ Игроков</span>
                </div>
              </div>
            </div>
            <Zap className="w-6 h-6 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame('telestrations')}
            className="w-full p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 -rotate-3 group-hover:rotate-0 transition-transform">
                <Pencil className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight italic">Испорченный телефон</h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  <Users className="w-3 h-3" />
                  <span>4-12 Игроков</span>
                </div>
              </div>
            </div>
            <Zap className="w-6 h-6 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame('just_one')}
            className="w-full p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight italic">Намек понял</h3>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  <Users className="w-3 h-3" />
                  <span>3-12 Игроков</span>
                </div>
              </div>
            </div>
            <Zap className="w-6 h-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};
