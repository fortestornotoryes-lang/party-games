import React from 'react';

// ─── Токены ──────────────────────────────────────────────────────────────────

/**
 * Семантические цвета для типографики.
 * white  — #fff (заголовки, ключевые слова)
 * body   — white/80 (обычный текст)
 * muted  — white/50 (второстепенный текст)
 * faint  — white/25 (подсказки, хинты)
 * dimmer — white/15 (декоративные метки)
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

export type AsElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

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

/** textShadow-глоу для цветного текста */
const GLOW: Partial<Record<TypoColor, string>> = {
  white: '0 0 30px rgba(255,255,255,0.40)',
  red: '0 0 30px rgba(255,46,77,0.55)',
  blue: '0 0 30px rgba(63,123,255,0.55)',
  green: '0 0 30px rgba(0,216,138,0.55)',
  sky: '0 0 30px rgba(31,182,255,0.55)',
  orange: '0 0 30px rgba(255,138,31,0.55)',
  yellow: '0 0 30px rgba(255,204,31,0.55)',
  purple: '0 0 30px rgba(199,123,255,0.55)',
};

const ALIGN: Record<TypoAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// ─── Базовые пропсы ──────────────────────────────────────────────────────────

interface BaseProps {
  color?: TypoColor;
  align?: TypoAlign;
  as?: AsElement;
  children: React.ReactNode;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Display
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hero-текст — имена игроков, роли, победители, ключевые слова.
 *
 * Стиль: Unbounded / font-black italic uppercase tracking-tighter leading-none
 *
 * | size | px   | использование                      |
 * |------|------|------------------------------------|
 * | sm   | 36px | player name secondary              |
 * | md   | 48px | player name primary (default)      |
 * | lg   | 60px | role reveal, winner                |
 * | xl   | 70px | ПОБЕДА!, ШПИОН                     |
 * | 2xl  | 88px | full-screen highlight              |
 *
 * @prop glow — добавляет textShadow-свечение цветом color
 */
const Display = ({
  size,
  color,
  align,
  glow,
  as: Tag,
  children,
  className,
}: BaseProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  glow?: boolean;
}) => {
  const SIZES = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl',
    xl: 'text-display-xl',
    '2xl': 'text-display-2xl',
  } as const;

  const style = glow && GLOW[color] ? { textShadow: GLOW[color] } : undefined;

  return (
    <Tag
      className={[
        'font-black italic uppercase tracking-tighter leading-none',
        SIZES[size],
        COLOR[color],
        align ? ALIGN[align] : '',
        className,
      ].join(' ')}
      style={style}
    >
      {children}
    </Tag>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Title
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Заголовок экрана или секции (h1-уровень).
 *
 * Стиль: font-black uppercase italic tracking-tighter
 *
 * | size | px    |
 * |------|-------|
 * | sm   | 20px  |
 * | md   | 28px  | ← default
 * | lg   | 30px  |
 * | xl   | 36px  |
 */
const Title = ({
  size,
  color,
  align,
  as: Tag,
  children,
  className,
}: BaseProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const SIZES = {
    sm: 'text-xl',
    md: 'text-heading leading-[0.75]',
    lg: 'text-3xl',
    xl: 'text-4xl',
  } as const;

  return (
    <Tag
      className={[
        'font-black uppercase italic tracking-tighter',
        SIZES[size],
        COLOR[color],
        align ? ALIGN[align] : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Heading
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Подзаголовок / название блока (h2–h3 уровень).
 *
 * Стиль: font-black italic uppercase tracking-tighter
 *
 * | size | class    |
 * |------|----------|
 * | xs   | text-base |
 * | sm   | text-lg   |
 * | md   | text-2xl  | ← default
 * | lg   | text-3xl  |
 */
const Heading = ({
  size,
  color,
  align,
  as: Tag,
  children,
  className,
}: BaseProps & {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) => {
  const SIZES = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  } as const;

  return (
    <Tag
      className={[
        'font-black italic uppercase tracking-tighter',
        SIZES[size],
        COLOR[color],
        align ? ALIGN[align] : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Label
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Мелкий uppercase-тег — роли, метки, категории.
 *
 * Пример: «ЛИДЕР МИССИИ», «ГРУППА», «Новый раунд»
 *
 * | size | px  | tracking     |
 * |------|-----|--------------|
 * | xs   | 10px| 0.4em         | ← default
 * | sm   | 11px| 0.3em         |
 * | md   | 12px| 0.2em         |
 *
 * Цвет по умолчанию: muted (white/50)
 * Для акцентных меток через opacity: `className="opacity-50"`
 */
const Label = ({
  size,
  color,
  align,
  as: Tag,
  children,
  className,
}: BaseProps & {
  size?: 'xs' | 'sm' | 'md';
}) => {
  const SIZES = {
    xs: 'text-tag tracking-[0.4em]',
    sm: 'text-label tracking-[0.3em]',
    md: 'text-xs tracking-[0.2em]',
  } as const;

  return (
    <Tag
      className={[
        'font-black uppercase',
        SIZES[size],
        COLOR[color],
        align ? ALIGN[align] : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Body
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Читаемый текст — инструкции, описания, пояснения.
 *
 * | size | class      |
 * |------|------------|
 * | xs   | text-xs    |
 * | sm   | text-sm    | ← default
 * | base | text-base  |
 *
 * Цвет по умолчанию: body (white/80)
 */
const Body = ({
  size,
  color,
  align,
  as: Tag,
  children,
  className,
}: BaseProps & {
  size?: 'xs' | 'sm' | 'base';
}) => {
  const SIZES = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
  } as const;

  return (
    <Tag
      className={[
        'leading-relaxed font-medium',
        SIZES[size],
        COLOR[color],
        align ? ALIGN[align] : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Caption
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Минимальный хинт — вторичные пояснения, метки, подсказки.
 *
 * | size | px  |
 * |------|-----|
 * | xs   | 8px |
 * | sm   | 9px | ← default
 *
 * Цвет по умолчанию: faint (white/25)
 * Для цветных меток с opacity: `color="red" className="opacity-50"`
 */
const Caption = ({
  size,
  color,
  align,
  as: Tag,
  children,
  className,
}: BaseProps & {
  size?: 'xs' | 'sm';
}) => {
  const SIZES = {
    xs: 'text-micro tracking-[0.35em]',
    sm: 'text-micro tracking-[0.3em]',
  } as const;

  return (
    <Tag
      className={[
        'font-black uppercase',
        SIZES[size],
        COLOR[color],
        align ? ALIGN[align] : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Score
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Числовой дисплей — очки, счёт, таймер.
 *
 * В отличие от Display — нет uppercase, добавлен tabular-nums.
 *
 * | size | class     |
 * |------|-----------|
 * | sm   | text-3xl  |
 * | md   | text-4xl  | ← default
 * | lg   | text-5xl  |
 * | xl   | text-6xl  |
 *
 * @prop glow — добавляет textShadow-свечение
 */
const Score = ({
  size,
  color,
  align,
  glow,
  as: Tag,
  children,
  className,
}: BaseProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
}) => {
  const SIZES = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  } as const;

  const style = glow && GLOW[color] ? { textShadow: GLOW[color] } : undefined;

  return (
    <Tag
      className={[
        'font-black italic tabular-nums',
        SIZES[size],
        COLOR[color],
        align ? ALIGN[align] : '',
        className,
      ].join(' ')}
      style={style}
    >
      {children}
    </Tag>
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
