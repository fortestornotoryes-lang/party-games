import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Crown, Shield } from 'lucide-react';
import { PrimaryButton, Typography } from '@/components/UI';
import { feedbackService, VIBRATE } from '@/services/feedbackService';
import { rgba } from '@/theme/colors';

interface DictatorRevealPhaseProps {
  directorName: string;
  onContinue: () => void;
}

export const DictatorRevealPhase: React.FC<DictatorRevealPhaseProps> = ({
  directorName,
  onContinue,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    feedbackService.vibrate(VIBRATE.tap);
    setIsRevealed(true);
  };

  const handleContinue = () => {
    feedbackService.vibrate(VIBRATE.tap);
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full px-5 py-6 gap-6"
    >
      {/* Header */}
      <div className="text-center space-y-2 mt-2">
        <div className="flex items-center justify-center gap-2">
          <Crown className="w-4 h-4" style={{ color: 'var(--color-premium-yellow)' }} />
          <Typography.Label size="sm" color="muted">РЕЖИМ: ДИКТАТОР</Typography.Label>
        </div>
        <Typography.Heading size="md" color="white" align="center">
          Директор бункера избран
        </Typography.Heading>
        <Typography.Body size="sm" color="muted" align="center">
          Один игрок автоматически занимает место в бункере и не может быть исключён голосованием
        </Typography.Body>
      </div>

      {/* Reveal area */}
      <div className="flex-1 flex items-center justify-center">
        {!isRevealed ? (
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleReveal}
            className="w-full rounded-[2rem] p-10 text-center space-y-4 active:scale-[0.98] transition-transform"
            style={{
              background: `linear-gradient(160deg, ${rgba('yellow', 0.08)} 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1.5px dashed ${rgba('yellow', 0.3)}`,
            }}
          >
            <Crown
              className="w-12 h-12 mx-auto"
              style={{ color: 'var(--color-premium-yellow)', opacity: 0.4 }}
            />
            <Typography.Heading size="sm" color="muted" align="center">
              Нажмите, чтобы узнать директора
            </Typography.Heading>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="w-full rounded-[2rem] p-8 text-center space-y-4"
            style={{
              background: `linear-gradient(160deg, ${rgba('yellow', 0.15)} 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1.5px solid ${rgba('yellow', 0.4)}`,
              boxShadow: `0 0 60px ${rgba('yellow', 0.2)}, 0 24px 48px rgba(0,0,0,0.5)`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
              className="text-5xl leading-none"
            >
              👑
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography.Display size="sm" color="white" glow align="center">
                {directorName.toUpperCase()}
              </Typography.Display>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: rgba('yellow', 0.15),
                border: `1px solid ${rgba('yellow', 0.3)}`,
              }}
            >
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--color-premium-yellow)' }} />
              <span
                className="text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: 'var(--color-premium-yellow)' }}
              >
                Гарантированное место в бункере
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Typography.Caption color="faint" align="center">
                Этот игрок не участвует в голосовании
              </Typography.Caption>
            </motion.div>
          </motion.div>
        )}
      </div>

      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto"
        >
          <PrimaryButton onClick={handleContinue} variant="outline" icon={ChevronRight}>
            К РАСКРЫТИЮ ЧЕРТ
          </PrimaryButton>
        </motion.div>
      )}
    </motion.div>
  );
};
