import React from "react";

export const TabButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({active, onClick, children}) => (
    <button
        onClick={onClick}
        className={`flex-1 py-4 text-label font-black uppercase tracking-[0.3em] transition-all border-b-2 font-display italic ${
            active ? 'text-white border-premium-red' : 'text-white/20 border-white/5'
        }`}
    >
        {children}
    </button>
);