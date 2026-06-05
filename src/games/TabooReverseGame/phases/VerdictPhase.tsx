import React from 'react';
import { motion } from 'motion/react';
import { TabooCard } from '@/constants/tabooReverseContent';
import { StopGameButton } from '@/components/StopGameButton';

interface VerdictPhaseProps {
  card: TabooCard;
  timedOut: boolean;
  currentExplainer: string;
  otherPlayers: string[];
  usedWordIdxs: Set<number>;
  onToggleWord: (i: number) => void;
  onVerdict: (guesser: string | null, penalty?: boolean) => void;
  onStopGame: () => void;
}

export const VerdictPhase: React.FC<VerdictPhaseProps> = ({
  card,
  timedOut,
  currentExplainer,
  otherPlayers,
  usedWordIdxs,
  onToggleWord,
  onVerdict,
  onStopGame,
}) => (
  <motion.div
    key="verdict"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col p-6 gap-6 max-w-lg mx-auto w-full"
  >
    {/* Word reveal */}
    <div className="text-center space-y-2 pt-2">
      {timedOut && (
        <p className="text-[9px] font-black uppercase tracking-widest text-premium-red/70">
          Время вышло!
        </p>
      )}
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
        Загаданное слово
      </p>
      <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
        {card.word}
      </h2>
    </div>

    {/* Mark used words */}
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 text-center">
        Отметьте использованные слова
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {card.required.map((w, i) => (
          <button
            key={i}
            onClick={() => onToggleWord(i)}
            className={`px-4 py-2.5 rounded-2xl border font-black italic uppercase text-sm transition-all active:scale-95 ${
              usedWordIdxs.has(i)
                ? 'bg-premium-green/20 border-premium-green/50 text-premium-green line-through opacity-70'
                : 'bg-white/5 border-white/15 text-white/50'
            }`}
          >
            {w}
          </button>
        ))}
      </div>
      <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/20 mt-3">
        Использовано: {usedWordIdxs.size}/{card.required.length}
      </p>
    </div>

    <div className="border-t border-white/10" />

    {/* Who guessed? */}
    <div className="space-y-3">
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 text-center">
        Кто угадал?
      </p>

      {otherPlayers.map((player) => {
        const allWordsUsed = usedWordIdxs.size === card.required.length;
        const points = allWordsUsed ? 2 : 1;
        return (
          <button
            key={player}
            onClick={() => onVerdict(player)}
            className="w-full p-4 bg-premium-green/10 border-2 border-premium-green/40 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
          >
            <div className="text-left">
              <p className="font-black italic text-premium-green text-base leading-tight">
                {player}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5">
                {allWordsUsed
                  ? 'Все слова использованы'
                  : `Слов использовано: ${usedWordIdxs.size}/${card.required.length}`}
              </p>
            </div>
            <span className="text-3xl font-black italic text-premium-green ml-4">+{points}</span>
          </button>
        );
      })}

      <button
        onClick={() => onVerdict(null)}
        className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
      >
        <p className="font-black italic text-white/50 text-base">Никто не угадал</p>
        <span className="text-3xl font-black italic text-white/30 ml-4">0</span>
      </button>

      <button
        onClick={() => onVerdict(null, true)}
        className="w-full p-4 bg-premium-red/10 border-2 border-premium-red/30 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
      >
        <div className="text-left">
          <p className="font-black italic text-premium-red text-base leading-tight">
            {currentExplainer} назвал слово
          </p>
          <p className="text-[10px] text-white/30 mt-0.5">Штраф объяснявшему</p>
        </div>
        <span className="text-3xl font-black italic text-premium-red ml-4">−1</span>
      </button>
    </div>

    <div className="border-t border-white/10" />

    <StopGameButton onClick={onStopGame} />
  </motion.div>
);
