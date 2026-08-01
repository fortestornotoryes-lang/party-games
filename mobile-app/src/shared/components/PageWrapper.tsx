import React from 'react';
import { View } from 'react-native';

/** Каркас экрана: тёмный фон задаёт Stack (_layout), здесь — центровка и паддинги */
export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <View className={`flex-1 ${className ?? ''}`}>
    <View className="mx-auto w-full max-w-md flex-1 p-6 pb-32">{children}</View>
  </View>
);
