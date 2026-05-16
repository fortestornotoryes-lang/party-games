import React from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { feedbackService } from '../services/feedbackService';

export const ParallaxBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 80 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const x1 = useTransform(smoothX, [-0.5, 0.5], [-30, 30]);
  const y1 = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);
  const x2 = useTransform(smoothX, [-0.5, 0.5], [40, -40]);
  const y2 = useTransform(smoothY, [-0.5, 0.5], [40, -40]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      <motion.div 
        style={{ x: x1, y: y1 }}
        className="absolute -inset-[30%] bg-[radial-gradient(ellipse_at_30%_30%,rgba(105,60,220,0.12),transparent_60%)]"
      />
      <motion.div 
        style={{ x: x2, y: y2 }}
        className="absolute -inset-[30%] bg-[radial-gradient(ellipse_at_70%_70%,rgba(255,46,77,0.06),transparent_60%)]"
      />
    </div>
  );
};

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
  variant?: 'white' | 'premium' | 'red' | 'blue' | 'emerald' | 'purple' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  icon: Icon,
  disabled,
  variant = 'premium',
  className = '',
  type = 'button'
}) => {
  const handleClick = () => {
    feedbackService.playSound('click');
    feedbackService.vibrate(10);
    if (onClick) onClick();
  };

  const baseStyles = "w-full h-16 rounded-premium-md font-black italic text-xl flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none relative overflow-hidden group border-none";
  const variants = {
    white: "bg-white text-black font-display",
    premium: "glass-card text-white hover:bg-white/[0.08] font-display border-white/10",
    red: "bg-premium-red text-white shadow-[0_20px_50px_rgba(255,46,77,0.3)]",
    blue: "bg-premium-blue text-white shadow-[0_20px_50px_rgba(63,123,255,0.3)]",
    emerald: "bg-premium-green text-white shadow-[0_20px_50px_rgba(0,216,138,0.3)]",
    purple: "bg-premium-purple text-white shadow-[0_20px_50px_rgba(199,123,255,0.3)]",
    outline: "bg-transparent text-white/80 border border-white/5 hover:bg-white/5",
  };

  return (
    <button
      type={type}
      onClick={type === 'button' ? handleClick : undefined}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {Icon && <Icon className="w-6 h-6 relative z-10" />}
      <span className="relative z-10 uppercase tracking-tighter leading-none">{children}</span>
    </button>
  );
};

export const GameCard: React.FC<{ children: React.ReactNode; title?: string; className?: string; onClick?: () => void }> = ({ 
  children, 
  title,
  className = "",
  onClick
}) => (
  <div 
    onClick={onClick}
    className={`glass-card rounded-premium-lg p-7 shadow-2xl ${onClick ? 'active:scale-[0.98] cursor-pointer' : ''} ${className} border-white/5`}
  >
    {title && <SectionLabel className="mb-6 font-display italic tracking-[0.4em]">{title}</SectionLabel>}
    {children}
  </div>
);

export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <span className={`text-[11px] font-black uppercase tracking-[0.5em] text-white/80 block mb-3 italic ${className}`}>
    {children}
  </span>
);

export const Badge: React.FC<{ children: React.ReactNode; className?: string; variant?: 'default' | 'outline' }> = ({ 
  children, 
  className = "",
  variant = 'default' 
}) => (
  <span className={`px-3 py-1 rounded-premium-sm text-[9px] font-black uppercase tracking-wider ${
    variant === 'default' ? 'bg-white/5 text-white/80 border border-white/5' : 'border border-white/10 text-white/20'
  } ${className}`}>
    {children}
  </span>
);

export const IconButton: React.FC<{ 
  onClick: () => void; 
  icon: LucideIcon; 
  className?: string;
  variant?: 'ghost' | 'filled' | 'danger';
}> = ({ 
  onClick, 
  icon: Icon, 
  className = "",
  variant = 'ghost'
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    feedbackService.playSound('click');
    feedbackService.vibrate(10);
    onClick();
  };

  const variants = {
    ghost: "glass-card text-white/80 active:scale-95 border-none",
    filled: "bg-white text-black active:scale-95 border-none",
    danger: "bg-premium-red/10 text-premium-red border border-premium-red/20 active:scale-95"
  };

  return (
    <button 
      onClick={handleClick}
      className={`p-4 rounded-premium-sm transition-all flex items-center justify-center ${variants[variant]} ${className}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`h-14 glass-card rounded-premium-md px-6 text-base font-semibold outline-none transition-all placeholder:text-white/10 w-full focus:ring-1 focus:ring-white/20 border-white/10 ${props.className || ''}`}
  />
);

export const Typography = {
  Title: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h1 className={`text-[56px] font-black tracking-tighter uppercase italic leading-[0.75] text-white ${className}`}>
      {children}
    </h1>
  ),
  Heading: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-2xl font-black italic uppercase tracking-tighter text-white ${className}`}>
      {children}
    </h2>
  ),
  Description: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-sm text-white/80 leading-relaxed font-medium ${className}`}>
      {children}
    </p>
  )
};

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`min-h-screen text-white relative overflow-x-hidden ${className}`}>
    <div className="max-w-md mx-auto h-full flex flex-col p-6 pb-32">
      {children}
    </div>
  </div>
);

export const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ 
  active, 
  onClick, 
  children 
}) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 font-display italic ${
      active ? 'text-white border-premium-red' : 'text-white/20 border-white/5'
    }`}
  >
    {children}
  </button>
);
