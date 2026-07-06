import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ className, ...props }) => (
  <input
    {...props}
    className={`glass-input rounded-premium-sm h-9 w-full px-4 text-base font-semibold transition-all outline-none placeholder:text-white/20 focus:ring-1 focus:ring-white/20 ${className ?? ''}`}
  />
);
