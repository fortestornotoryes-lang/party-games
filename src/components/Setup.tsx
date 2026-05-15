import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, UserMinus, Play, Shield, HelpCircle, X, ChevronRight, ArrowLeft, LucideIcon } from 'lucide-react';

interface SetupProps {
  onStart: (playerNames: string[]) => void;
  onBack: () => void;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  themeColor: 'red' | 'emerald' | 'sky' | 'orange' | 'purple';
  playerPlaceholder: string;
  addPlayerLabel: string;
  instructions: { title: string; content: string }[];
  minPlayers?: number;
  maxPlayers?: number;
}

const colorConfig = {
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-500',
    button: 'bg-red-600 hover:bg-red-500',
    shadow: 'shadow-red-900/40',
    gradient: 'bg-[radial-gradient(circle_at_50%_0%,#450a0a,transparent_50%)]',
    focus: 'focus:border-red-500/50'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    shadow: 'shadow-emerald-900/40',
    gradient: 'bg-[radial-gradient(circle_at_50%_0%,#064e3b,transparent_50%)]',
    focus: 'focus:border-emerald-500/50'
  },
  sky: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-500',
    button: 'bg-sky-600 hover:bg-sky-500',
    shadow: 'shadow-sky-900/40',
    gradient: 'bg-[radial-gradient(circle_at_50%_0%,#0c4a6e,transparent_50%)]',
    focus: 'focus:border-sky-500/50'
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-500',
    button: 'bg-orange-600 hover:bg-orange-500',
    shadow: 'shadow-orange-900/40',
    gradient: 'bg-[radial-gradient(circle_at_50%_0%,#7c2d12,transparent_50%)]',
    focus: 'focus:border-orange-500/50'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
    button: 'bg-purple-600 hover:bg-purple-500',
    shadow: 'shadow-purple-900/40',
    gradient: 'bg-[radial-gradient(circle_at_50%_0%,#581c87,transparent_50%)]',
    focus: 'focus:border-purple-500/50'
  }
};

export const Setup: React.FC<SetupProps> = ({ 
  onStart, 
  onBack,
  title,
  subtitle,
  icon: Icon,
  themeColor,
  playerPlaceholder,
  addPlayerLabel,
  instructions,
  minPlayers = 3,
  maxPlayers = 8
}) => {
  const config = colorConfig[themeColor];
  const [names, setNames] = useState<string[]>(
    Array.from({ length: minPlayers }, (_, i) => `${playerPlaceholder} ${i + 1}`)
  );
  const [showInstructions, setShowInstructions] = useState(false);

  const addPlayer = () => {
    if (names.length < maxPlayers) {
      setNames([...names, `${playerPlaceholder} ${names.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (names.length > minPlayers) {
      setNames(names.filter((_, i) => i !== index));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...names];
    newNames[index] = name;
    setNames(newNames);
  };

  const isReady = names.every(n => n.trim() !== '');

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-y-auto overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className={`absolute top-0 left-0 w-full h-full ${config.gradient}`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6 relative z-10 py-6 pb-24"
      >
        <button 
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 flex items-center space-x-2 transition-all border border-white/5 mb-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Назад</span>
        </button>

        <div className="text-left space-y-4">
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className={`inline-block p-4 rounded-3xl ${config.bg} border ${config.border} backdrop-blur-xl mb-1 shadow-2xl`}
          >
            <Icon className={`w-10 h-10 ${config.text}`} />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter uppercase sm:text-6xl italic leading-[0.8] mb-2">
            {title.split(' ')[0]} <br/>
            <span className={config.text}>{title.split(' ').slice(1).join(' ') || ''}</span>
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500 border-l-2 border-white/10 pl-3">{subtitle}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Настройка группы</h3>
            <span className="text-[10px] text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/5">{names.length} / {maxPlayers}</span>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {names.map((name, index) => (
                <motion.div
                  key={name + index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-2 group relative"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none ${config.focus} transition-all text-base font-medium placeholder:text-gray-700`}
                      placeholder={`${playerPlaceholder} ${index + 1}`}
                    />
                  </div>
                  {names.length > minPlayers && (
                    <button
                      onClick={() => removePlayer(index)}
                      className={`p-4 rounded-2xl ${config.bg} ${config.text} hover:bg-red-500 hover:text-white transition-all shadow-lg`}
                    >
                      <UserMinus className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {names.length < maxPlayers && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={addPlayer}
              className={`w-full py-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center space-x-3 text-gray-500 hover:${config.border} hover:${config.text} hover:${config.bg} transition-all group`}
            >
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="uppercase text-[10px] font-bold tracking-widest">{addPlayerLabel}</span>
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 fixed bottom-6 left-6 right-6 max-w-md mx-auto sm:relative sm:bottom-0 sm:left-0 sm:right-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInstructions(true)}
            className="py-4 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl font-bold uppercase tracking-widest border border-white/10 flex items-center justify-center space-x-2 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px]">Брифинг</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isReady}
            onClick={() => onStart(names)}
            className={`py-4 ${config.button} text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl ${config.shadow} transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Play className="w-4 h-4 fill-current text-white" />
            <span className="text-[10px] italic">Старт</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y:-20 }}
              className={`bg-[#120a0a] border ${config.border} p-8 rounded-[2.5rem] max-w-lg w-full relative overflow-hidden shadow-2xl`}
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setShowInstructions(false)}
                  className={`p-2 bg-white/5 rounded-full hover:${config.bg} hover:${config.text} transition-all`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 ${config.bg} rounded-2xl`}>
                    <HelpCircle className={`w-6 h-6 ${config.text}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Брифинг</h2>
                    <p className={`text-[10px] ${config.text} uppercase tracking-widest font-bold`}>{title}</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {instructions.map((item, idx) => (
                    <div key={idx} className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                      <h4 className={`text-sm font-bold ${config.text} uppercase flex items-center`}>
                        <ChevronRight className="w-4 h-4 mr-1" />
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest"
                >
                  Принято
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

