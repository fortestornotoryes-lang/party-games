import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { rgba } from '@/shared/theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Геометрия совпадает с веб-версией: viewBox 64, радиус 28, штрих 3
const VIEWBOX = 64;
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TimerRingProps {
  timeLeft: number;
  totalTime: number;
  /** Порог «тревоги»: кольцо и цифра краснеют, цифра пульсирует */
  warnThreshold?: number;
  size?: number;
}

/**
 * Круговой таймер-кольцо (порт SVG-кольца из веб-Alias).
 * strokeDashoffset анимируется reanimated-ом линейно за 1 с — как
 * CSS-transition в вебе; цвет при ≤ warnThreshold переключается без анимации.
 */
export const TimerRing: React.FC<TimerRingProps> = ({
  timeLeft,
  totalTime,
  warnThreshold = 10,
  size = 64,
}) => {
  const warn = timeLeft <= warnThreshold;
  const progress = useSharedValue(timeLeft / totalTime);

  useEffect(() => {
    progress.value = withTiming(timeLeft / totalTime, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [timeLeft, totalTime, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - CIRCUMFERENCE * progress.value,
  }));

  return (
    <View style={{ width: size, height: size }}>
      {/* -90° — отсчёт начинается сверху, как в вебе */}
      <View style={{ width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
        <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
          <Circle
            cx={VIEWBOX / 2}
            cy={VIEWBOX / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={3}
            fill="none"
          />
          <AnimatedCircle
            cx={VIEWBOX / 2}
            cy={VIEWBOX / 2}
            r={RADIUS}
            stroke={warn ? rgba('red', 1) : rgba('sky', 1)}
            strokeWidth={3}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeLinecap="round"
            animatedProps={animatedProps}
          />
        </Svg>
      </View>
      <View className="absolute inset-0 items-center justify-center">
        <MotiView
          key={warn ? 'warn' : 'calm'}
          from={{ opacity: 1 }}
          animate={{ opacity: warn ? 0.4 : 1 }}
          transition={{ type: 'timing', duration: 700, loop: warn }}
        >
          <Text
            className={`text-xl font-black ${warn ? 'text-premium-red' : 'text-white'}`}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {timeLeft}
          </Text>
        </MotiView>
      </View>
    </View>
  );
};
