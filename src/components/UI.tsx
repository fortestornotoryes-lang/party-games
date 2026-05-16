import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    icon?: LucideIcon;
    disabled?: boolean;
    variant?: 'white' | 'colored';
    className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
                                                                onClick,
                                                                children,
                                                                icon: Icon,
                                                                disabled,
                                                                variant = 'white',
                                                                className = ''
                                                            }) => {
    const baseStyles = "w-full py-6 rounded-3xl font-black italic text-xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] disabled:opacity-30 disabled:pointer-events-none";
    const variants = {
        white: "bg-white text-black",
        colored: "bg-white/10 border border-white/20 text-white"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {Icon && <Icon className="w-6 h-6" />}
            <span>{children}</span>
        </button>
    );
};

export const GameCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
                                                                                                                children,
                                                                                                                className = "",
                                                                                                                onClick
                                                                                                            }) => (
    <div
        onClick={onClick}
        className={`bg-white/5 border border-white/10 rounded-4xl p-6 shadow-xl ${onClick ? 'active:scale-95 cursor-pointer' : ''} ${className}`}
    >
        {children}
    </div>
);
