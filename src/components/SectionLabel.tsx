import React from "react";

export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                              children,
                                                                                              className,
                                                                                          }) => (
    <span
        className={`text-label font-black uppercase tracking-[0.5em] text-white/80 block mb-3 italic ${className}`}
    >
    {children}
  </span>
);