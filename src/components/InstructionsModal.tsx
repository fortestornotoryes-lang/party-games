import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const themes = {
  orange:  { border: 'border-orange-500/20',  accent: 'text-orange-500',  closeHover: 'hover:bg-orange-500'  },
  purple:  { border: 'border-purple-500/20',  accent: 'text-purple-500',  closeHover: 'hover:bg-purple-500'  },
  emerald: { border: 'border-emerald-500/20', accent: 'text-emerald-500', closeHover: 'hover:bg-emerald-500' },
  red:     { border: 'border-red-500/20',     accent: 'text-red-500',     closeHover: 'hover:bg-red-500'     },
  blue:    { border: 'border-blue-500/20',    accent: 'text-blue-500',    closeHover: 'hover:bg-blue-500'    },
} as const;

type ModalTheme = keyof typeof themes;

interface InstructionsModalProps {
  open: boolean;
  instructions: { title: string; content: string }[];
  onClose: () => void;
  title?: string;
  theme: ModalTheme;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  open,
  instructions,
  onClose,
  title = 'Инструкции',
  theme,
}) => {
  const { border, accent, closeHover } = themes[theme];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`bg-[#120a0a] border ${border} p-8 rounded-[2.5rem] max-w-lg w-full relative`}
          >
            <div className="absolute top-0 right-0 p-6">
              <button
                onClick={onClose}
                className={`p-3 bg-white/5 rounded-2xl ${closeHover} hover:text-white transition-all`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">{title}</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {instructions.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <h4 className={`text-xs font-black ${accent} uppercase tracking-widest mb-1`}>{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.content}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest"
              >
                Все понятно
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
