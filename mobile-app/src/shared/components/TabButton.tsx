import React from 'react';
import { Pressable, Text } from 'react-native';

export const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <Pressable
    onPress={onClick}
    className={`flex-1 items-center border-b-2 py-4 ${
      active ? 'border-premium-red' : 'border-white/5'
    }`}
  >
    <Text
      className={`text-label font-black uppercase italic ${active ? 'text-white' : 'text-white/20'}`}
      style={{ letterSpacing: 3.6 }}
    >
      {children}
    </Text>
  </Pressable>
);
