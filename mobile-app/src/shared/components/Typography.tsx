/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

// ─── Токены ──────────────────────────────────────────────────────────────────

/**
 * Семантические цвета для типографики (те же, что в вебе).
 * white — #fff, body — white/80, muted — white/50, faint — white/25, dimmer — white/15
 */
export type TypoColor =
  | 'white'
  | 'body'
  | 'muted'
  | 'faint'
  | 'dimmer'
  | 'red'
  | 'blue'
  | 'green'
  | 'sky'
  | 'orange'
  | 'yellow'
  | 'purple';

export type TypoAlign = 'left' | 'center' | 'right';

const COLOR: Record<TypoColor, string> = {
  white: 'text-white',
  body: 'text-white/80',
  muted: 'text-white/50',
  faint: 'text-white/25',
  dimmer: 'text-white/15',
  red: 'text-premium-red',
  blue: 'text-premium-blue',
  green: 'text-premium-green',
  sky: 'text-premium-sky',
  orange: 'text-premium-orange',
  yellow: 'text-premium-yellow',
  purple: 'text-premium-purple',
};

/** textShadow-глоу для цветного текста (RN: color + radius) */
const GLOW: Partial<Record<TypoColor, string>> = {
  white: 'rgba(255,255,255,0.40)',
  red: 'rgba(255,46,77,0.55)',
  blue: 'rgba(63,123,255,0.55)',
  green: 'rgba(0,216,138,0.55)',
  sky: 'rgba(31,182,255,0.55)',
  orange: 'rgba(255,138,31,0.55)',
  yellow: 'rgba(255,204,31,0.55)',
  purple: 'rgba(199,123,255,0.55)',
};

const ALIGN: Record<TypoAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const glowStyle = (color: TypoColor): TextStyle | undefined => {
  const glow = GLOW[color];
  if (!glow) return undefined;
  return { textShadowColor: glow, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15 };
};

// В RN letterSpacing задаётся в px — эквиваленты em-трекинга веба считаем от fontSize
const em = (fontSize: number, tracking: number): number => fontSize * tracking;

// ─── Базовые пропсы ──────────────────────────────────────────────────────────
// `as` из веб-версии не переносится: в RN весь текст — <Text>.

interface BaseProps {
  color?: TypoColor;
  align?: TypoAlign;
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}

const cx = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');

// ─────────────────────────────────────────────────────────────────────────────
// Display — hero-текст: имена игроков, роли, победители
// ─────────────────────────────────────────────────────────────────────────────

/** sm 36 / md 48 (default) / lg 60 / xl 70 / 2xl 88. @prop glow — свечение цветом color */
const Display = ({
  size = 'md',
  color = 'body',
  align,
  glow,
  children,
  className,
  style,
}: BaseProps & { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; glow?: boolean }) => {
  const SIZES = { sm: 36, md: 48, lg: 60, xl: 70, '2xl': 88 } as const;
  const fs = SIZES[size];
  return (
    <Text
      className={cx('font-black uppercase italic', COLOR[color], align && ALIGN[align], className)}
      style={[
        { fontSize: fs, lineHeight: fs, letterSpacing: em(fs, -0.04) },
        glow ? glowStyle(color) : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Title — заголовок экрана или секции (h1-уровень)
// ─────────────────────────────────────────────────────────────────────────────

/** sm 20 / md 28 (default) / lg 30 / xl 36 */
const Title = ({
  size = 'md',
  color = 'body',
  align,
  children,
  className,
  style,
}: BaseProps & { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const SIZES = { sm: 20, md: 28, lg: 30, xl: 36 } as const;
  const fs = SIZES[size];
  return (
    <Text
      className={cx('font-black uppercase italic', COLOR[color], align && ALIGN[align], className)}
      style={[{ fontSize: fs, lineHeight: fs, letterSpacing: em(fs, -0.04) }, style]}
    >
      {children}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Heading — подзаголовок / название блока (h2–h3 уровень)
// ─────────────────────────────────────────────────────────────────────────────

/** xs 16 / sm 18 / md 24 (default) / lg 30 */
const Heading = ({
  size = 'md',
  color = 'body',
  align,
  children,
  className,
  style,
}: BaseProps & { size?: 'xs' | 'sm' | 'md' | 'lg' }) => {
  const SIZES = { xs: 16, sm: 18, md: 24, lg: 30 } as const;
  const fs = SIZES[size];
  return (
    <Text
      className={cx('font-black uppercase italic', COLOR[color], align && ALIGN[align], className)}
      style={[{ fontSize: fs, lineHeight: fs * 1.1, letterSpacing: em(fs, -0.04) }, style]}
    >
      {children}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Label — мелкий uppercase-тег: роли, метки, категории
// ─────────────────────────────────────────────────────────────────────────────

/** xs 10px/0.4em (default) / sm 12px/0.3em / md 12px/0.2em. Цвет по умолчанию: muted */
const Label = ({
  size = 'xs',
  color = 'muted',
  align,
  children,
  className,
  style,
}: BaseProps & { size?: 'xs' | 'sm' | 'md' }) => {
  const SIZES = { xs: [10, 0.4], sm: [12, 0.3], md: [12, 0.2] } as const;
  const [fs, tracking] = SIZES[size];
  return (
    <Text
      className={cx('font-black uppercase', COLOR[color], align && ALIGN[align], className)}
      style={[{ fontSize: fs, letterSpacing: em(fs, tracking) }, style]}
    >
      {children}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Body — читаемый текст: инструкции, описания
// ─────────────────────────────────────────────────────────────────────────────

/** xs 12 / sm 14 (default) / base 16. Цвет по умолчанию: body (white/80) */
const Body = ({
  size = 'sm',
  color = 'body',
  align,
  children,
  className,
  style,
}: BaseProps & { size?: 'xs' | 'sm' | 'base' }) => {
  const SIZES = { xs: 12, sm: 14, base: 16 } as const;
  const fs = SIZES[size];
  return (
    <Text
      className={cx('font-medium', COLOR[color], align && ALIGN[align], className)}
      style={[{ fontSize: fs, lineHeight: fs * 1.625 }, style]}
    >
      {children}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Caption — минимальный хинт: подсказки, вторичные метки
// ─────────────────────────────────────────────────────────────────────────────

/** xs 8px/0.35em / sm 8px/0.3em (default). Цвет по умолчанию: faint (white/25) */
const Caption = ({
  size = 'sm',
  color = 'faint',
  align,
  children,
  className,
  style,
}: BaseProps & { size?: 'xs' | 'sm' }) => {
  const SIZES = { xs: [8, 0.35], sm: [8, 0.3] } as const;
  const [fs, tracking] = SIZES[size];
  return (
    <Text
      className={cx('font-black uppercase', COLOR[color], align && ALIGN[align], className)}
      style={[{ fontSize: fs, letterSpacing: em(fs, tracking) }, style]}
    >
      {children}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Score — числовой дисплей: очки, счёт, таймер (tabular-nums, без uppercase)
// ─────────────────────────────────────────────────────────────────────────────

/** sm 30 / md 36 (default) / lg 48 / xl 60. @prop glow — свечение */
const Score = ({
  size = 'md',
  color = 'white',
  align,
  glow,
  children,
  className,
  style,
}: BaseProps & { size?: 'sm' | 'md' | 'lg' | 'xl'; glow?: boolean }) => {
  const SIZES = { sm: 30, md: 36, lg: 48, xl: 60 } as const;
  const fs = SIZES[size];
  return (
    <Text
      className={cx('font-black italic', COLOR[color], align && ALIGN[align], className)}
      style={[
        { fontSize: fs, lineHeight: fs * 1.1, fontVariant: ['tabular-nums'] },
        glow ? glowStyle(color) : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ─── Экспорт ─────────────────────────────────────────────────────────────────

export const Typography = {
  /** Hero-текст: имена, роли, победители. font-black italic uppercase */
  Display,
  /** Заголовок экрана / секции. h1-уровень */
  Title,
  /** Подзаголовок / название блока. h2–h3 уровень */
  Heading,
  /** Мелкий uppercase-тег: роли, метки, категории */
  Label,
  /** Читаемый текст: инструкции, описания */
  Body,
  /** Минимальный хинт: подсказки, вторичные метки */
  Caption,
  /** Числовой дисплей: очки, таймер, счёт. tabular-nums */
  Score,
};
