import React from 'react';

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`h-9 glass-input rounded-premium-sm px-4 text-base font-semibold outline-none transition-all placeholder:text-white/20 w-full focus:ring-1 focus:ring-white/20 ${props?.className ?? ''}`}
    />
);
