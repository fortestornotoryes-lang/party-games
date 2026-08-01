import React from 'react';
import { Text, View } from 'react-native';

export const Badge: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}> = ({ children, className, variant }) => (
  <View
    className={`rounded-premium-sm border px-3 py-1 ${
      variant === 'default' ? 'border-white/5 bg-white/5' : 'border-white/10'
    } ${className ?? ''}`}
  >
    <Text
      className={`text-micro font-black uppercase ${
        variant === 'default' ? 'text-white/80' : 'text-white/20'
      }`}
      style={{ letterSpacing: 0.8 }}
    >
      {children}
    </Text>
  </View>
);
