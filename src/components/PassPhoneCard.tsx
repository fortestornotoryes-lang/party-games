import React from 'react';
import {motion} from 'motion/react';
import {Fingerprint, LucideIcon} from 'lucide-react';
import {Typography} from "@/components/Typography.tsx";

type BadgeColor = 'orange' | 'sky' | 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'default';
type AccentColor = 'green' | 'sky' | 'red' | 'orange' | 'blue' | 'purple' | 'yellow' | 'default';

interface PassPhoneCardProps {
    playerName: string;
    playerLabel?: string;
    badge?: string;
    badgeColor?: BadgeColor;
    instruction?: string;
    icon?: LucideIcon;
    accentColor?: AccentColor;
    onClick: () => void;
}

const badgeStyles: Record<BadgeColor, string> = {
    orange: 'bg-premium-orange/10 border-premium-orange/20 text-premium-orange',
    sky: 'bg-premium-sky/10    border-premium-sky/20    text-premium-sky',
    red: 'bg-premium-red/10    border-premium-red/20    text-premium-red',
    green: 'bg-premium-green/10  border-premium-green/20  text-premium-green',
    blue: 'bg-premium-blue/10   border-premium-blue/20   text-premium-blue',
    purple: 'bg-premium-purple/10 border-premium-purple/20 text-premium-purple',
    yellow: 'bg-premium-yellow/10 border-premium-yellow/20 text-premium-yellow',
    default: 'bg-white/5           border-white/10          text-white/40',
};

const accentStyles: Record<AccentColor, {
    ring: string;
    icon: string;
    border: string;
    glow: string;
    text: string;
    shadow: string
}> = {
    default: {
        ring: 'bg-white/4 border-white/8',
        icon: 'text-white/35',
        border: 'border-premium-blue',
        glow: 'rgba(0,0,0,0.55)',
        text: 'text-white/22',
        shadow: 'shadow-[0_0_15px_rgba(255,255,255,0.15)]'
    },
    green: {
        ring: 'bg-premium-green/10 border-premium-green/30',
        icon: 'text-premium-green',
        border: 'border-premium-green',
        glow: 'rgba(34,197,94,0.15)',
        text: 'text-premium-green/40',
        shadow: 'shadow-[0_0_20px_rgba(0,216,138,0.4)] text-premium-green'
    },
    sky: {
        ring: 'bg-premium-sky/10 border-premium-sky/30',
        icon: 'text-premium-sky',
        border: 'border-premium-sky',
        glow: 'rgba(14,165,233,0.15)',
        text: 'text-premium-sky/40',
        shadow: 'shadow-[0_0_20px_rgba(31,182,255,0.4)] text-premium-sky'
    },
    red: {
        ring: 'bg-premium-red/10 border-premium-red/30',
        icon: 'text-premium-red',
        border: 'border-premium-red',
        glow: 'rgba(239,68,68,0.15)',
        text: 'text-premium-red/40',
        shadow: 'shadow-[0_0_20px_rgba(255,46,77,0.4)] text-premium-red'
    },
    orange: {
        ring: 'bg-premium-orange/10 border-premium-orange/30',
        icon: 'text-premium-orange',
        border: 'border-premium-orange',
        glow: 'rgba(249,115,22,0.15)',
        text: 'text-premium-orange/40',
        shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)] text-premium-orange'
    },
    blue: {
        ring: 'bg-premium-blue/10 border-premium-blue/30',
        icon: 'text-premium-blue',
        border: 'border-premium-blue',
        glow: 'rgba(59,130,246,0.15)',
        text: 'text-premium-blue/40',
        shadow: 'shadow-[0_0_20px_rgba(63,123,255,0.4)] text-premium-blue'
    },
    purple: {
        ring: 'bg-premium-purple/10 border-premium-purple/30',
        icon: 'text-premium-purple',
        border: 'border-premium-purple',
        glow: 'rgba(168,85,247,0.15)',
        text: 'text-premium-purple/40',
        shadow: 'shadow-[0_0_20px_rgba(199,123,255,0.4)] text-premium-purple'
    },
    yellow: {
        ring: 'bg-premium-yellow/10 border-premium-yellow/30',
        icon: 'text-premium-yellow',
        border: 'border-premium-yellow',
        glow: 'rgba(234,179,8,0.15)',
        text: 'text-premium-yellow/40',
        shadow: 'shadow-[0_0_20px_rgba(255,204,31,0.4)] text-premium-yellow'
    },
};
export const PassPhoneCard: React.FC<PassPhoneCardProps> = ({
                                                                playerName,
                                                                playerLabel = 'Игрок',
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
            whileTap={{scale: 0.97}}
            onClick={onClick}
            className="w-full aspect-3/4 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-colors duration-300"
            style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.018) 100%)',
                border: `1.5px solid ${accent.border}`,
                boxShadow: `0 32px 64px rgba(0,0,0,0.55), 0 0 40px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
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

            <div className={`absolute top-5 left-5  w-45 h-55 border-t border-l  rounded-tl-md ${accent.border}`}/>
            <div className={`absolute top-5 right-5 w-45 h-55 border-t border-r ${accent.border} rounded-tr-md`}/>
            <div
                className={`absolute bottom-5 left-5 w-45 h-55 border-b border-l ${accent.border} rounded-bl-md`}/>
            <div
                className={`absolute bottom-5 right-5 w-45 h-55 border-b-1 border-r ${accent.border} rounded-br-md`}/>

            <div className="text-center space-y-7 px-10 relative z-10">
                <motion.div
                    animate={{opacity: [0.5, 0.9, 0.9, 0.5], scale: [1, 1.15, 1.15, 1]}}
                    transition={{duration: 1.2, repeat: Infinity}}
                    className={`mx-auto w-[72px] h-[72px] rounded-full border flex items-center justify-center transition-colors duration-500 ${accent.ring}`}
                >
                    <Icon className={`w-12 h-12 transition-colors duration-300 ${accent.icon}`}/>
                </motion.div>

                <div className="space-y-3">
                    {badge && (
                        <div
                            className={`inline-block px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${badgeStyles[badgeColor]}`}>
                            {badge}
                        </div>
                    )}
                    <div>
                        <Typography.Label size='sm' className={`uppercase font-black tracking-[0.45em] mb-2 transition-colors duration-300 ${accent.text}`}>{playerLabel}</Typography.Label>

                        {/* Cyberpunk HUD Container */}
                        <div className="relative inline-flex delay-1000 items-center justify-center px-6 py-3 bg-black/40 border border-white/5 rounded-md overflow-visible">

                            {/* Технологический микро-текст по бокам */}
                            <span className="absolute left-1 bottom-1 text-[6px] font-mono text-white/20 select-none">SYS_ERR</span>
                            <span className="absolute right-1 top-1 text-[6px] font-mono text-premium-pink/40 select-none">[v4.02]</span>

                            {/* Задняя плашка помех, которая взрывается глитчами */}
                            <div className="absolute inset-0 bg-white/5 opacity-5 animate-matrix-glitch pointer-events-none z-0" />

                            <Typography.Heading className={`font-display font-black italic tracking-tighter  leading-none relative z-10 select-none text-4xl uppercase`}>
                                {playerName}

                                {/* Glitch Layer 1 - Cyan / Мощное смещение */}
                                <span className="absolute top-0 left-0 w-full h-full text-premium-cyan opacity-100 mix-blend-screen animate-cyber-hard-1 select-none pointer-events-none z-[-1] before:content-['_'] after:content-['_']">
        {playerName}
      </span>

                                {/* Glitch Layer 2 - Pink-Red / Противоположный разрыв */}
                                <span className="absolute top-0 left-0 w-full h-full text-premium-pink opacity-100 mix-blend-screen animate-cyber-hard-2 select-none pointer-events-none z-[-2] before:content-['_'] after:content-['_']">
        {playerName}
      </span>
                            </Typography.Heading>
                        </div>
                    </div>

                </div>

                <Typography.Body className="uppercase font-bold text-white/18 tracking-[0.25em] leading-relaxed">
                    {instruction}
                </Typography.Body>
            </div>
        </motion.div>
    );
};