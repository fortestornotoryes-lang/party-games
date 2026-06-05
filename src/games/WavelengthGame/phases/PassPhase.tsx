import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton, Typography } from '@/components/UI';

interface PassPhaseProps {
  psychic: string;
  onReady: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ psychic, onReady }) => (
  <motion.div
    key="pass"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="h-full flex flex-col items-center justify-center space-y-10 text-center"
  >
    <div className="space-y-4 text-center">
      <Typography.Label size="sm" color="body">
        Новый раунд
      </Typography.Label>
      <Typography.Heading size="sm" color="muted">
        Телепат:
      </Typography.Heading>
      <Typography.Display size="lg" color="purple">
        {psychic}
      </Typography.Display>
    </div>
    <div className="p-8 bg-premium-purple/5 border-2 border-premium-purple/10 rounded-premium-3xl max-w-xs transition-all">
      <Typography.Body color="muted">
        {psychic}, возьми телефон! Только ты должен видеть секретную цель. Убедись, что остальные не
        смотрят.
      </Typography.Body>
    </div>
    <PrimaryButton onClick={onReady} variant="purple">
      Я ГОТОВ
    </PrimaryButton>
  </motion.div>
);
