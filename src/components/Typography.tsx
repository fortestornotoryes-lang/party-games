import React from 'react';

// ─── Типы ────────────────────────────────────────────────────────────────────

export type TypoColor =
  | 'white' | 'muted' | 'faint'
  | 'red' | 'blue' | 'green' | 'sky' | 'orange' | 'yellow' | 'purple';

export type AsElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

const typoColor: Record<TypoColor, string> = {
  white:  'text-white',
  muted:  'text-white/50',
  faint:  'text-white/20',
  red:    'text-premium-red',
  blue:   'text-premium-blue',
  green:  'text-premium-green',
  sky:    'text-premium-sky',
  orange: 'text-premium-orange',
  yellow: 'text-premium-yellow',
  purple: 'text-premium-purple',
};

// ─── Компоненты ───────────────────────────────────────────────────────────────

/** Крупный hero-текст — имена игроков, очки, роли, победители */
const Display = ({
  size = 'md',
  color = 'white',
  as: Tag = 'h2' as AsElement,
  children,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: TypoColor;
  as?: AsElement;
  children: React.ReactNode;
  className?: string;
}) => {
  const sizes = { sm: 'text-4xl', md: 'text-5xl', lg: 'text-6xl', xl: 'text-[70px]' };
  return (
    <Tag className={`font-black italic uppercase tracking-tighter leading-none ${sizes[size]} ${typoColor[color]} ${className}`}>
      {children}
    </Tag>
  );
};

/** Заголовок экрана / секции — h1-уровень, 28px */
const Title = ({
  color = 'white',
  as: Tag = 'h1' as AsElement,
  children,
  className = '',
}: {
  color?: TypoColor;
  as?: AsElement;
  children: React.ReactNode;
  className?: string;
}) => (
  <Tag className={`text-[28px] font-black tracking-tighter uppercase italic leading-[0.75] ${typoColor[color]} ${className}`}>
    {children}
  </Tag>
);

/** Подзаголовок — h2-уровень, 24px */
const Heading = ({
  color = 'white',
  as: Tag = 'h2' as AsElement,
  children,
  className = '',
}: {
  color?: TypoColor;
  as?: AsElement;
  children: React.ReactNode;
  className?: string;
}) => (
  <Tag className={`text-2xl font-black italic uppercase tracking-tighter ${typoColor[color]} ${className}`}>
    {children}
  </Tag>
);

/** Крошечный uppercase-тег — "Лидер миссии", "ГРУППА", роли игроков */
const Label = ({
  size = 'xs',
  color = 'muted',
  as: Tag = 'p' as AsElement,
  children,
  className = '',
}: {
  size?: 'xs' | 'sm';
  color?: TypoColor;
  as?: AsElement;
  children: React.ReactNode;
  className?: string;
}) => {
  const sizes = { xs: 'text-[10px] tracking-[0.4em]', sm: 'text-[11px] tracking-[0.3em]' };
  return (
    <Tag className={`font-black uppercase ${sizes[size]} ${typoColor[color]} ${className}`}>
      {children}
    </Tag>
  );
};

/** Читаемый текст инструкций и пояснений */
const Body = ({
  muted = false,
  as: Tag = 'p' as AsElement,
  children,
  className = '',
}: {
  muted?: boolean;
  as?: AsElement;
  children: React.ReactNode;
  className?: string;
}) => (
  <Tag className={`text-sm leading-relaxed font-medium ${muted ? 'text-white/50' : 'text-white/80'} ${className}`}>
    {children}
  </Tag>
);

/** Описание — небольшой текст с умеренной прозрачностью */
const Description = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={`text-sm text-white/80 leading-relaxed font-medium ${className}`}>
    {children}
  </p>
);

/** Очень мутный хинт — подсказки, второстепенные инструкции (9px, white/30) */
const Caption = ({
  as: Tag = 'p' as AsElement,
  children,
  className = '',
}: {
  as?: AsElement;
  children: React.ReactNode;
  className?: string;
}) => (
  <Tag className={`text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] ${className}`}>
    {children}
  </Tag>
);

// ─── Экспорт ─────────────────────────────────────────────────────────────────

export const Typography = { Display, Title, Heading, Label, Body, Description, Caption };
