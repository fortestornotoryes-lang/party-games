import { StopCircle } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text } from 'react-native';

import { useTranslation } from '@/shared/i18n';

interface StopGameButtonProps {
  onClick: () => void;
  className?: string;
}

export const StopGameButton: React.FC<StopGameButtonProps> = ({ onClick, className }) => {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onClick}
      className={`rounded-premium-md w-full flex-row items-center justify-center gap-2 border border-white/10 bg-white/5 p-3.5 ${className ?? ''}`}
      style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
    >
      <StopCircle size={16} color="rgba(255,255,255,0.3)" />
      <Text className="text-sm font-black uppercase text-white/30" style={{ letterSpacing: 1.4 }}>
        {t('common.stopGame')}
      </Text>
    </Pressable>
  );
};
