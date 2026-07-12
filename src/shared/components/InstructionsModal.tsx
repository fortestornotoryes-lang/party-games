import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';

import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { getTheme } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

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
  const { t } = useTranslation();
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
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#0B0915]/98"
        >
          <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col p-8">
            <div className="mb-12 flex items-center justify-start gap-4">
              <button
                onClick={onClose}
                className="glass-card z-50 flex h-12 w-12 items-center justify-center rounded-full border-none text-white transition-all active:scale-90"
              >
                <ArrowLeft className="h-7 w-7" />
              </button>
              <Typography.Title>{title}</Typography.Title>
            </div>

            <div className="mb-12">
              <div className="mb-4 flex items-center gap-4">
                <div
                  className={`h-0.5 w-8 rounded-full ${themeConfig.text} bg-current opacity-60`}
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
                  className="glass-card rounded-premium-lg flex items-center gap-6 border-white/5 p-6"
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
                className={`glass-card rounded-premium-md flex h-18 w-full items-center justify-center border-none text-white transition-all hover:bg-white/5 active:scale-[0.98]`}
              >
                <span className="text-xl font-black tracking-tighter uppercase italic">
                  {t('common.start')}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
