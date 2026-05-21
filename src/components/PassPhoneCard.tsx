import React from 'react';
import { motion } from 'motion/react';
import { Fingerprint, LucideIcon } from 'lucide-react';

type BadgeColor = 'orange' | 'sky' | 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'default';
type AccentColor = 'green' | 'sky' | 'red' | 'orange' | 'blue' | 'purple' | 'yellow' | 'default';

interface PassPhoneCardProps {
  playerName: string;
  badge?: string;
  badgeColor?: BadgeColor;
  instruction?: string;
  icon?: LucideIcon;
  accentColor?: AccentColor;
  onClick: () => void;
}

const badgeStyles: Record<BadgeColor, string> = {
  orange:  'bg-premium-orange/10 border-premium-orange/20 text-premium-orange',
  sky:     'bg-premium-sky/10    border-premium-sky/20    text-premium-sky',
  red:     'bg-premium-red/10    border-premium-red/20    text-premium-red',
  green:   'bg-premium-green/10  border-premium-green/20  text-premium-green',
  blue:    'bg-premium-blue/10   border-premium-blue/20   text-premium-blue',
  purple:  'bg-premium-purple/10 border-premium-purple/20 text-premium-purple',
  yellow:  'bg-premium-yellow/10 border-premium-yellow/20 text-premium-yellow',
  default: 'bg-white/5           border-white/10          text-white/40',
};

const accentStyles: Record<AccentColor, { ring: string; icon: string }> = {
  default: { ring: 'bg-white/[0.04] border-white/[0.08]',              icon: 'text-white/35' },
  green:   { ring: 'bg-premium-green/10  border-premium-green/20',     icon: 'text-premium-green/50' },
  sky:     { ring: 'bg-premium-sky/10    border-premium-sky/20',       icon: 'text-premium-sky/50' },
  red:     { ring: 'bg-premium-red/10    border-premium-red/20',       icon: 'text-premium-red/50' },
  orange:  { ring: 'bg-premium-orange/10 border-premium-orange/20',    icon: 'text-premium-orange/50' },
  blue:    { ring: 'bg-premium-blue/10   border-premium-blue/20',      icon: 'text-premium-blue/50' },
  purple:  { ring: 'bg-premium-purple/10 border-premium-purple/20',    icon: 'text-premium-purple/50' },
  yellow:  { ring: 'bg-premium-yellow/10 border-premium-yellow/20',    icon: 'text-premium-yellow/50' },
};

export const PassPhoneCard: React.FC<PassPhoneCardProps> = ({
  playerName,
  badge,
  badgeColor = 'default',
  instruction = 'Нажми чтобы продолжить',
  icon: Icon = Fingerprint,
  accentColor = 'default',
  onClick,
}) => {
  const accent = accentStyles[accentColor];

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full aspect-3/4 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.018) 100%)',
        border: '1.5px solid rgba(255,255,255,0.09)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 28px)',
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-5 left-5  w-5 h-5 border-t-2 border-l-2 border-white/[0.12] rounded-tl-md" />
      <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-white/[0.12] rounded-tr-md" />
      <div className="absolute bottom-5 left-5  w-5 h-5 border-b-2 border-l-2 border-white/[0.12] rounded-bl-md" />
      <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-white/[0.12] rounded-br-md" />

      <div className="text-center space-y-7 px-10 relative z-10">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className={`mx-auto w-[72px] h-[72px] rounded-full border flex items-center justify-center ${accent.ring}`}
        >
          <Icon className={`w-9 h-9 ${accent.icon}`} />
        </motion.div>

        <div className="space-y-3">
          {badge && (
            <div className={`inline-block px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${badgeStyles[badgeColor]}`}>
              {badge}
            </div>
          )}
          <div>
            <p className="text-[9px] uppercase font-black text-white/[0.22] tracking-[0.45em] mb-2">Игрок</p>
            <h4 className="text-[42px] font-black italic text-white tracking-tighter leading-none">{playerName}</h4>
          </div>
        </div>

        <p className="text-[9px] uppercase font-bold text-white/[0.18] tracking-[0.25em] leading-relaxed">
          {instruction}
        </p>
      </div>
    </motion.div>
  );
};
