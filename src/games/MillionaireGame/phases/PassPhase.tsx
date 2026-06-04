import React from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { PassPhoneCard } from '@/components/PassPhoneCard';

interface PassPhaseProps {
  currentPlayer: string;
  onPassDone: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ currentPlayer, onPassDone }) => (
  <motion.div
    key="pass"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.22 }}
    className="h-full flex flex-col p-5 gap-4"
  >
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-xs">
        <PassPhoneCard
          playerName={currentPlayer}
          badge="Кто хочет стать миллионером"
          badgeColor="yellow"
          accentColor="yellow"
          icon={Trophy}
          instruction="Нажми, чтобы начать"
          onClick={onPassDone}
        />
      </div>
    </div>
  </motion.div>
);
