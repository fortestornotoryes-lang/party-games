import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { RotateCcw, Home, HelpCircle, X, CheckCircle2, Eye, EyeOff, Timer } from 'lucide-react';
import { WAVELENGTH_INSTRUCTIONS, WAVELENGTH_CATEGORIES } from '../wavelengthContent';

interface WavelengthGameProps {
  onBack: () => void;
}

export const WavelengthGame: React.FC<WavelengthGameProps> = ({ onBack }) => {
  const generateRandomTarget = () => {
    // Bias towards edges slightly more than uniform to show it works
    const r = Math.random();
    if (r < 0.25) return 5 + Math.random() * 15; // 5-20%
    if (r > 0.75) return 80 + Math.random() * 15; // 80-95%
    return 25 + Math.random() * 50; // 25-75%
  };

  const [targetPos, setTargetPos] = useState(() => generateRandomTarget());
  const [guessPos, setGuessPos] = useState(50);
  const [category, setCategory] = useState(() => WAVELENGTH_CATEGORIES[Math.floor(Math.random() * WAVELENGTH_CATEGORIES.length)]);
  const [phase, setPhase] = useState<'telepath' | 'guess' | 'reveal'>('telepath');
  const [showInstructions, setShowInstructions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for discussion
  const [timerActive, setTimerActive] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isPassDismissed, setIsPassDismissed] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleDialClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (phase !== 'guess' || !isPassDismissed) return;
    if (!dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setGuessPos(percentage);
    setHasGuessed(true);
  };

  const calculateScore = () => {
    const diff = Math.abs(targetPos - guessPos);
    // Fair scoring zones for better gameplay feedback
    if (diff <= 3) return 4;
    if (diff <= 8) return 3;
    if (diff <= 15) return 2;
    return 0;
  };

  const startNextRound = () => {
    setTargetPos(generateRandomTarget());
    setGuessPos(50);
    setHasGuessed(false);
    setIsPassDismissed(false);
    setCategory(WAVELENGTH_CATEGORIES[Math.floor(Math.random() * WAVELENGTH_CATEGORIES.length)]);
    setPhase('telepath');
    setTimeLeft(120);
    setTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden select-none">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-[#0a0502]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <RotateCcw className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">Wave<span className="text-purple-500">length</span></h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Чтение мыслей // v1.0</p>
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        
        {/* Category Display - Removed word divider to avoid confusion with target handle */}
        <div className="w-full max-w-lg bg-gradient-to-br from-white/10 to-white/5 p-1 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="bg-[#120a0a] p-8 rounded-[2.4rem] flex justify-between items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-50" />
            <div className="relative">
              <p className="text-[10px] text-purple-500 uppercase font-black tracking-widest mb-1 opacity-50">Слева</p>
              <h3 className="text-xl font-bold tracking-tight text-white">{category[0]}</h3>
            </div>
            {/* Visual spacer instead of line */}
            <div className="px-4 text-white/5 font-black italic text-2xl uppercase">vs</div>
            <div className="relative text-right">
              <p className="text-[10px] text-purple-500 uppercase font-black tracking-widest mb-1 opacity-50">Справа</p>
              <h3 className="text-xl font-bold tracking-tight text-white">{category[1]}</h3>
            </div>
          </div>
        </div>

        {/* The Dial */}
        <div className="w-full max-w-lg space-y-8">
          <div 
            ref={dialRef}
            className="relative h-28 bg-white/5 rounded-full border-2 border-white/10 overflow-hidden cursor-crosshair touch-none shadow-inner"
            onClick={handleDialClick}
            onTouchStart={handleDialClick}
            onTouchMove={handleDialClick}
          >
            {/* Target Area (only visible to Telepath or in Reveal) - Higher Z-index and brighter */}
            <AnimatePresence>
              {(phase === 'telepath' || phase === 'reveal') && (
                <motion.div 
                  key="target-area"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 bottom-0 flex items-center justify-center z-10"
                  style={{ left: `${targetPos}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Score Zones */}
                  <div className="relative h-full flex items-center justify-center">
                    <div className="absolute w-32 h-full bg-purple-500/10 blur-3xl rounded-full" />
                    <div className="w-24 h-full bg-purple-500/20 border-x border-purple-500/30" />
                    <div className="w-12 h-full bg-purple-500/50 border-x border-white/20" />
                    <div className="w-4 h-full bg-white shadow-[0_0_35px_rgba(255,255,255,1)] z-20" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guess Indicator */}
            {phase !== 'telepath' && hasGuessed && (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 bottom-0 w-1.5 bg-yellow-400 z-30 shadow-[0_0_20px_rgba(250,204,21,0.9)]"
                style={{ left: `${guessPos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
                  <div className="px-2 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-lg shadow-xl">ВЫБОР</div>
                </div>
              </motion.div>
            )}

            {/* Secret Overlay for Guessing phase - NOW FULL BLACKOUT */}
            <AnimatePresence>
              {phase === 'guess' && !isPassDismissed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center bg-[#0a0502] z-[100] cursor-pointer"
                  onClick={() => setIsPassDismissed(true)}
                >
                  <div className="text-center space-y-6 p-8">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20 animate-pulse">
                      <Eye className="w-8 h-8 text-purple-500" />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-purple-500">Передайте телефон</p>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                          Теперь игроки должны обсудить подсказку<br/>
                          и выставить стрелку на шкале.
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-600 italic">Телепат, не подглядывай!</p>
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="inline-block px-8 py-4 bg-white text-black rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20"
                    >
                      Начать обсуждение
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls & Info */}
          <div className="flex flex-col items-center space-y-6">
            <AnimatePresence mode="wait">
              {phase === 'telepath' && (
                <motion.div 
                  key="telepath"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center space-y-4"
                >
                  <div className="bg-purple-500/10 border border-purple-500/20 px-6 py-3 rounded-2xl">
                    <p className="text-sm font-bold text-purple-400">Телепат, запомни положение цели!</p>
                  </div>
                  <button
                    onClick={() => setPhase('guess')}
                    className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest flex items-center space-x-2 shadow-2xl"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>Скрыть и передать</span>
                  </button>
                </motion.div>
              )}

              {phase === 'guess' && (
                <motion.div 
                  key="guess"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex flex-col items-center space-y-6"
                >
                  {/* Timer */}
                  <div className={`flex items-center space-x-3 px-6 py-3 rounded-full border transition-all ${timeLeft < 30 ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                    <Timer className={`w-4 h-4 ${timerActive ? 'animate-pulse' : ''}`} />
                    <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                    {!timerActive && timeLeft > 0 && (
                      <button onClick={() => setTimerActive(true)} className="ml-2 text-[10px] uppercase font-black hover:text-white underline">Запуск</button>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm text-center">Перемещайте стрелку, чтобы попасть точно в центр цели</p>
                  
                  <button
                    onClick={() => { setPhase('reveal'); setTimerActive(false); }}
                    className="w-full py-5 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-2xl shadow-purple-900/40"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Открыть результат</span>
                  </button>
                </motion.div>
              )}

              {phase === 'reveal' && (
                <motion.div 
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="space-y-1">
                    <h4 className="text-5xl font-black italic tracking-tighter text-purple-500">+{calculateScore()}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none">
                      Точность: {Math.max(0, Number((100 - Math.abs(targetPos - guessPos) * 2.5).toFixed(1)))}%
                    </p>
                  </div>
                  
                  <button
                    onClick={startNextRound}
                    className="px-10 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest flex items-center space-x-2 shadow-2xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Следующий раунд</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#120a0a] border border-purple-500/20 p-8 rounded-[2.5rem] max-w-lg w-full relative">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowInstructions(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-purple-500 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Инструкции</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                  {WAVELENGTH_INSTRUCTIONS.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.content}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowInstructions(false)} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest">
                  Понятно
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
