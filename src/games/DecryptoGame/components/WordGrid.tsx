import React from 'react';

interface WordGridProps {
  words: string[];
  height?: string;
}

export const WordGrid: React.FC<WordGridProps> = ({ words, height = 'h-20' }) => (
  <div className="grid grid-cols-2 gap-2">
    {words.map((w, i) => (
      <div
        key={i}
        className={`bg-white/5 border border-white/10 p-2 rounded-xl relative flex flex-col items-center justify-center ${height}`}
      >
        <span className="absolute left-2 top-2 text-[10px] text-white/30 font-black">{i + 1}</span>
        <span className="text-sm font-bold uppercase">{w}</span>
      </div>
    ))}
  </div>
);
