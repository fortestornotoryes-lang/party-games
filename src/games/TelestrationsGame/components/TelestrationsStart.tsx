import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye } from 'lucide-react';

interface Props {
  currentPlayer: string;
  shuffledPlayers: string[];
  currentWord: string;
  wordRevealed: boolean;
  onReveal: () => void;
  onReady: () => void;
}

export const TelestrationsStart: React.FC<Props> = ({
  currentPlayer,
  shuffledPlayers,
  currentWord,
  wordRevealed,
  onReveal,
  onReady,
}) => (
  <motion.div
    key="start"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.25 }}
    className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-6"
  >
    <div className="text-center space-y-3">
      <div className="inline-block px-4 py-1 bg-premium-orange/10 border border-premium-orange/20 rounded-full">
        <span className="text-tag text-premium-orange font-bold uppercase tracking-widest">
          Первый рисует
        </span>
      </div>
      <h3 className="text-4xl font-black italic">{currentPlayer}</h3>
      <p className="text-white/30 text-sm">Запомни слово и нарисуй его так, чтобы другие поняли</p>
    </div>

    <div className="w-full max-w-sm p-4 bg-white/5 border border-white/5 rounded-2xl">
      <p className="text-micro text-white/25 uppercase font-black tracking-widest mb-3 text-center">
        Порядок этой игры
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {shuffledPlayers.map((name, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-tag font-bold border ${
              i % 2 === 0
                ? 'bg-premium-orange/10 border-premium-orange/20 text-premium-orange'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            <span className="opacity-50">{i + 1}.</span>
            <span>{name}</span>
            <span className="opacity-60">{i % 2 === 0 ? '✏️' : '💬'}</span>
          </div>
        ))}
      </div>
    </div>

    {!wordRevealed ? (
      <button
        onClick={onReveal}
        className="w-full max-w-sm p-8 bg-white/5 border-2 border-dashed border-premium-orange/20 rounded-premium-3xl text-center hover:bg-premium-orange/5 hover:border-premium-orange/40 transition-all group"
      >
        <p className="text-micro text-white/25 uppercase font-black tracking-widest mb-3">
          Убедись, что остальные не смотрят
        </p>
        <div className="flex items-center justify-center gap-2 text-premium-orange/50 group-hover:text-premium-orange transition-colors">
          <Eye className="w-5 h-5" />
          <span className="text-base font-black">Показать слово</span>
        </div>
      </button>
    ) : (
      <div className="w-full max-w-sm p-8 bg-premium-orange/10 border border-premium-orange/30 rounded-premium-3xl text-center">
        <p className="text-tag text-white/25 uppercase font-black tracking-widest mb-2">
          Твоё секретное слово
        </p>
        <h4 className="text-3xl font-black text-premium-orange">{currentWord}</h4>
      </div>
    )}

    <button
      onClick={onReady}
      disabled={!wordRevealed}
      className="w-full max-w-sm py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
    >
      <span>Я готов рисовать</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  </motion.div>
);
