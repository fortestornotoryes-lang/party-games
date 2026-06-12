import React from 'react';

interface WordGridProps {
  words: string[];
  height?: string;
}

export const WordGrid: React.FC<WordGridProps> = ({ words, height }) => (
  <div className="grid grid-cols-2 gap-2">
    {words.map((w, i) => (
      <div
        key={i}
        className={`rounded-premium-sm relative flex flex-col items-center justify-center border border-white/10 bg-white/5 p-2 ${height}`}
      >
        <span className="text-tag absolute top-2 left-2 font-black text-white/30">{i + 1}</span>
        <span className="text-sm font-bold uppercase">{w}</span>
      </div>
    ))}
  </div>
);
