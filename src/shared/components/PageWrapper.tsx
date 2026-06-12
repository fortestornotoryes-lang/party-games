import React from 'react';

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`relative min-h-screen overflow-x-hidden text-white ${className}`}>
    <div className="mx-auto flex h-full max-w-md flex-col p-6 pb-32">{children}</div>
  </div>
);
