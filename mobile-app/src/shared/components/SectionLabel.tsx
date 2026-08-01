import React from 'react';
import { Text } from 'react-native';

export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Text
    className={`text-label mb-3 font-black uppercase italic text-white/80 ${className ?? ''}`}
    style={{ letterSpacing: 6 }}
  >
    {children}
  </Text>
);
