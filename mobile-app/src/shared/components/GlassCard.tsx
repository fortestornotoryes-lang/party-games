import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

interface GlassCardProps {
  children?: React.ReactNode;
  /** Классы внешнего контейнера: скругление, паддинги, границы */
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Отключить blur (дешёвый вариант для списков) */
  noBlur?: boolean;
}

/**
 * RN-замена веб-класса `.glass-card`: градиентная «стеклянная» подложка.
 *
 * Blur — только на iOS (BlurView на Android дорогой, см. gotchas веба про
 * backdrop-filter); Android всегда получает fallback: градиент + бордер.
 * Не вкладывать GlassCard друг в друга — то же правило, что и в вебе.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, className, style, noBlur }) => (
  <View className={`overflow-hidden border border-white/10 ${className ?? ''}`} style={style}>
    {Platform.OS === 'ios' && !noBlur && (
      <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
    )}
    <LinearGradient
      colors={['rgba(255,255,255,0.065)', 'rgba(255,255,255,0.02)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {children}
  </View>
);
