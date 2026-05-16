import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Users, Brain, Palette, RotateCcw, Pencil, Lightbulb } from 'lucide-react';

interface MainMenuProps {
  onSelectGame: (gameId: string) => void;
}

const GAMES = [
  {
    id: 'spy',
    title: 'Найти Шпиона',
    desc: 'Раскройте лжеца среди своих',
    players: '4–7',
    icon: Shield,
    color: 'red',
    iconBg: 'bg-red-500',
    iconShadow: 'shadow-red-500/30',
    hoverBorder: 'hover:border-red-500/50',
    hoverBg: 'hover:bg-red-500/5',
    accentText: 'text-red-500',
    rotate: 'rotate-3',
  },
  {
    id: 'alias',
    title: 'Alias Rapid',
    desc: 'Объясни слово быстрее всех',
    players: '4+',
    icon: Brain,
    color: 'sky',
    iconBg: 'bg-sky-500',
    iconShadow: 'shadow-sky-500/30',
    hoverBorder: 'hover:border-sky-500/50',
    hoverBg: 'hover:bg-sky-500/5',
    accentText: 'text-sky-500',
    rotate: '-rotate-3',
  },
  {
    id: 'fake_artist',
    title: 'Рисовальщик',
    desc: 'Один рисует, не зная темы',
    players: '4–7',
    icon: Palette,
    color: 'emerald',
    iconBg: 'bg-emerald-500',
    iconShadow: 'shadow-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/50',
    hoverBg: 'hover:bg-emerald-500/5',
    accentText: 'text-emerald-500',
    rotate: 'rotate-12',
  },
  {
    id: 'resistance',
    title: 'Сопротивление',
    desc: 'Шпионы против повстанцев',
    players: '5–10',
    icon: Shield,
    color: 'blue',
    iconBg: 'bg-blue-500',
    iconShadow: 'shadow-blue-500/30',
    hoverBorder: 'hover:border-blue-500/50',
    hoverBg: 'hover:bg-blue-500/5',
    accentText: 'text-blue-500',
    rotate: '-rotate-3',
  },
  {
    id: 'wavelength',
    title: 'Длина волны',
    desc: 'Читай мысли, угадывай волну',
    players: '2+',
    icon: RotateCcw,
    color: 'purple',
    iconBg: 'bg-purple-500',
    iconShadow: 'shadow-purple-500/30',
    hoverBorder: 'hover:border-purple-500/50',
    hoverBg: 'hover:bg-purple-500/5',
    accentText: 'text-purple-500',
    rotate: 'rotate-3',
  },
  {
    id: 'telestrations',
    title: 'Испорч. телефон',
    desc: 'Рисуй и угадывай по цепочке',
    players: '4–12',
    icon: Pencil,
    color: 'orange',
    iconBg: 'bg-orange-500',
    iconShadow: 'shadow-orange-500/30',
    hoverBorder: 'hover:border-orange-500/50',
    hoverBg: 'hover:bg-orange-500/5',
    accentText: 'text-orange-500',
    rotate: '-rotate-3',
  },
  {
    id: 'just_one',
    title: 'Намёк понял?',
    desc: 'Одно слово — одна подсказка',
    players: '3–12',
    icon: Lightbulb,
    color: 'yellow',
    iconBg: 'bg-yellow-500',
    iconShadow: 'shadow-yellow-500/30',
    hoverBorder: 'hover:border-yellow-500/50',
    hoverBg: 'hover:bg-yellow-500/5',
    accentText: 'text-yellow-500',
    rotate: 'rotate-3',
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
};

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-10 pb-8 sm:p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#3d0a0a55,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,#1a0a2e33,transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 260, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-red-600/20 border border-red-500/30 mb-4 shadow-lg shadow-red-900/20"
          >
            <Zap className="w-8 h-8 text-red-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[2.8rem] sm:text-[3.5rem] font-black tracking-[-0.04em] uppercase leading-[0.85] mb-3"
            style={{ fontFamily: 'var(--font-display, "Unbounded", sans-serif)' }}
          >
            PARTY{' '}
            <span className="text-red-500 not-italic">HUB</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold"
          >
            Игры для компании
          </motion.p>
        </div>

        {/* SpyHuntGame list */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <motion.button
                key={game.id}
                variants={item}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectGame(game.id)}
                className={`w-full p-4 sm:p-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 ${game.hoverBorder} ${game.hoverBg} active:bg-white/10 transition-colors text-left`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-[1rem] ${game.iconBg} flex items-center justify-center shadow-lg ${game.iconShadow} ${game.rotate} transition-transform duration-300 hover:rotate-0`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-tight italic leading-tight truncate">
                    {game.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5 leading-tight truncate">
                    {game.desc}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${game.accentText}`}>
                    <Users className="w-3 h-3" />
                    <span>{game.players}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-[9px] text-gray-700 uppercase tracking-[0.3em] font-bold mt-8"
        >
          7 игр · передай друзьям
        </motion.p>
      </motion.div>
    </div>
  );
};
