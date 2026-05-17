import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

const themes = {
  orange:  { accent: 'text-premium-orange',  bg: 'bg-premium-orange/10', glow: 'shadow-premium-orange/20' },
  purple:  { accent: 'text-premium-purple',  bg: 'bg-premium-purple/10', glow: 'shadow-premium-purple/20' },
  emerald: { accent: 'text-premium-green', bg: 'bg-premium-green/10', glow: 'shadow-premium-green/20' },
  red:     { accent: 'text-premium-red',     bg: 'bg-premium-red/10', glow: 'shadow-premium-red/20' },
  blue:    { accent: 'text-premium-blue',    bg: 'bg-premium-blue/10', glow: 'shadow-premium-blue/20' },
  sky:     { accent: 'text-premium-sky',     bg: 'bg-premium-sky/10', glow: 'shadow-premium-sky/20' },
  yellow:  { accent: 'text-premium-yellow',  bg: 'bg-premium-yellow/10', glow: 'shadow-premium-yellow/20' },
} as const;

type ModalTheme = keyof typeof themes;

interface InstructionsModalProps {
  open: boolean;
  instructions: readonly { title: string; content: string }[];
  onClose: () => void;
  title?: string;
  theme: ModalTheme;
  description?: string;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  open,
  instructions,
  onClose,
  title = 'Инструкции',
  theme,
  description = 'Брифинг по игровому процессу и правилам участия в секретной операции.',
}) => {
  const themeConfig = themes[theme] || themes.red;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#0B0915]/98 overflow-y-auto"
        >
          <div className="w-full max-w-lg mx-auto p-8 flex flex-col min-h-screen">
            <div className="mb-12 flex justify-start">
              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-white active:scale-95 transition-all border-none"
              >
                <ArrowLeft className="w-7 h-7" />
              </button>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                 <div className={`w-8 h-0.5 rounded-full ${themeConfig.accent} bg-current opacity-60`} />
              </div>
              <h2 className="text-[54px] font-black italic uppercase tracking-tighter leading-[0.8] text-white mb-8 pr-12">
                {title}
              </h2>
              <p className="text-base text-white/50 leading-relaxed font-medium">
                {description}
              </p>
            </div>

            <div className="space-y-6 pb-20">
              {instructions.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="p-7 glass-card rounded-premium-lg flex items-start gap-6 border-white/5"
                >
                  <div className={`w-12 h-12 shrink-0 rounded-premium-sm ${themeConfig.bg} border border-white/10 flex items-center justify-center text-base font-black italic ${themeConfig.accent} shadow-2xl`}>
                    0{idx + 1}
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[17px] font-black text-white uppercase tracking-tighter mb-2 italic">{item.title}</h4>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-10 pb-4">
              <button
                onClick={onClose}
                className={`w-full h-18 glass-card border-none hover:bg-white/5 active:scale-[0.98] transition-all text-white flex items-center justify-center rounded-premium-md`}
              >
                 <span className="text-xl font-black uppercase tracking-tighter italic">СТАРТ</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
