import React from 'react';


import {SectionLabel} from "@/components/SectionLabel.tsx";

export const GameCard: React.FC<{
    children: React.ReactNode;
    title?: string;
    className?: string;
    onClick?: () => void;
}> = ({children, title, className, onClick}) => (
    <div
        onClick={onClick}
        className={`glass-card rounded-premium-lg p-7 shadow-2xl ${onClick ? 'active:scale-[0.98] cursor-pointer' : ''} ${className} border-white/5`}
    >
        {!!title && <SectionLabel className="mb-6 font-display italic tracking-[0.4em]">{title}</SectionLabel>}
        {children}
    </div>
);
