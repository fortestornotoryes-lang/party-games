import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';

interface RoleRevealCardProps {
  /**
   * Цвета вертикальной градиентной подложки (RN-замена веб-`gradientClassName`
   * с tailwind-классами), напр. ['rgba(0,216,138,0.15)', 'rgba(0,216,138,0.05)', 'rgba(0,0,0,0.7)'].
   */
  gradientColors: readonly [string, string, ...string[]];
  /** Цвет верхнего свечения; blur-3xl веба заменён мягким кругом с прозрачностью */
  glowColor: string;
  /** Содержимое карточки роли (шапка/тело/кнопка) — специфично для каждой игры. */
  children: React.ReactNode;
}

/**
 * Общий каркас раскрытой карточки роли для экранов раздачи (`DistributionFlow.renderCard`):
 * градиентная подложка + верхнее свечение + контейнер контента.
 * Типографику и содержимое ролей каждая игра передаёт через `children`.
 */
export const RoleRevealCard: React.FC<RoleRevealCardProps> = ({
  gradientColors,
  glowColor,
  children,
}) => (
  <>
    {/* Градиентная подложка */}
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />

    {/* Верхнее свечение */}
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: -96,
        left: '50%',
        marginLeft: -144,
        width: 288,
        height: 288,
        borderRadius: 144,
        backgroundColor: glowColor,
        opacity: 0.5,
      }}
    />

    <View className="flex-1 items-center p-7">{children}</View>
  </>
);

interface RoleRevealPanelProps {
  children: React.ReactNode;
}

/**
 * Панель одной роли внутри `RoleRevealCard` (шапка / тело / кнопка).
 * Без собственной анимации появления — карточка уже анимируется целиком
 * во внешнем MotiView (DistributionFlow); независимый fade здесь только
 * задваивал анимацию и создавал ощущение "дёрганости".
 */
export const RoleRevealPanel: React.FC<RoleRevealPanelProps> = ({ children }) => (
  <View className="w-full flex-1 items-center justify-between">{children}</View>
);

interface RoleRevealButtonProps {
  onClick: () => void;
  /** Цветовые классы кнопки (фон), напр. `bg-premium-green`. */
  colorClassName: string;
  /** Классы текста, напр. `text-black`. */
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** Кнопка «дальше / начать» с общими стилями карточки роли. */
export const RoleRevealButton: React.FC<RoleRevealButtonProps> = ({
  onClick,
  colorClassName,
  textClassName = 'text-black',
  style,
  children,
}) => (
  <Pressable
    onPress={onClick}
    className={`rounded-premium-md w-full items-center py-4 ${colorClassName}`}
    style={({ pressed }) => [style, pressed && { transform: [{ scale: 0.95 }] }]}
  >
    <Text
      className={`font-black uppercase ${textClassName}`}
      style={{ letterSpacing: 2.8 }}
    >
      {children}
    </Text>
  </Pressable>
);
