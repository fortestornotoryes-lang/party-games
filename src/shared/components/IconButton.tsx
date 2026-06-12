import type {LucideIcon} from "lucide-react";
import React from "react";

import {feedbackService, VIBRATE} from "@/shared/services/feedbackService";

export const IconButton: React.FC<{
    onClick: () => void;
    icon: LucideIcon;
    className?: string;
    variant?: 'ghost' | 'filled' | 'danger';
}> = ({onClick, icon: Icon, className, variant = 'filled'}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        feedbackService.playSound('click');
        feedbackService.vibrate(VIBRATE.tap);
        onClick();
    };

    const variants = {
        ghost: 'glass-card text-white/80 active:scale-95 border-none',
        filled: 'bg-white text-black active:scale-95 border-none',
        danger: 'bg-premium-red/10 text-premium-red border border-premium-red/20 active:scale-95',
    };

    return (
        <button
            onClick={handleClick}
            className={`p-4 rounded-premium-sm transition-all flex items-center justify-center ${variants[variant]} ${className}`}
        >
            <Icon className="w-5 h-5"/>
        </button>
    );
};