import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import { getTheme } from '../theme/colors';
import type { GameTheme } from '../types';

import { PrimaryButton, Typography } from '@/components/UI';

type ModalTheme = GameTheme;

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
  title,
  theme,
  description,
}) => {
  const themeConfig = getTheme(theme);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {!!open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#0B0915]/98 overflow-y-auto"
        >
          <div className="w-full max-w-lg mx-auto p-8 flex flex-col min-h-screen">
            <div className="mb-12 flex justify-start items-center gap-4">
              <button
                onClick={onClose}
                className="w-12 h-12 z-50 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-all border-none"
              >
                <ArrowLeft className="w-7 h-7" />
              </button>
              <Typography.Title>{title}</Typography.Title>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-8 h-0.5 rounded-full ${themeConfig.text} bg-current opacity-60`}
                />
              </div>

              <Typography.Body size="base" color="muted">
                {description}
              </Typography.Body>
            </div>

            <div className="space-y-6 pb-20">
              {instructions.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="p-6 glass-card rounded-premium-lg flex gap-6 border-white/5 items-center"
                >
                  <div className="pt-1">
                    <Typography.Heading size="sm" className={`mb-2 ${themeConfig.text}`}>
                      {item.title}
                    </Typography.Heading>
                    <Typography.Body>{item.content}</Typography.Body>
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
