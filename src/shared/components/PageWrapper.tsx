import React from "react";

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                             children,
                                                                                             className,
                                                                                         }) => (
    <div className={`min-h-screen text-white relative overflow-x-hidden ${className}`}>
        <div className="max-w-md mx-auto h-full flex flex-col p-6 pb-32">{children}</div>
    </div>
);