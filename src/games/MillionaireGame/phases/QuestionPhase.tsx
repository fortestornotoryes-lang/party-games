import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Users, Percent, MessageSquare } from 'lucide-react';
import {
  MillionaireQuestion,
  PRIZE_LADDER,
  SAFE_CHECKPOINTS,
} from '@/constants/millionaireContent';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

type AnswerState = 'normal' | 'eliminated' | 'selected' | 'correct' | 'wrong';

interface QuestionPhaseProps {
  question: MillionaireQuestion;
  questionIndex: number;
  selectedAnswer: number | null;
  isRevealing: boolean;
  isCorrect: boolean;
  eliminatedOptions: number[];
  audienceVotes: number[] | null;
  phoneFriendSuggestion: number | null;
  usedLifelines: Set<string>;
  onAnswer: (index: number) => void;
  onFiftyFifty: () => void;
  onPhoneFriend: () => void;
  onAskAudience: () => void;
}

export const QuestionPhase: React.FC<QuestionPhaseProps> = ({
  question,
  questionIndex,
  selectedAnswer,
  isRevealing,
  isCorrect,
  eliminatedOptions,
  audienceVotes,
  phoneFriendSuggestion,
  usedLifelines,
  onAnswer,
  onFiftyFifty,
  onPhoneFriend,
  onAskAudience,
}) => {
  const getAnswerState = (index: number): AnswerState => {
    if (eliminatedOptions.includes(index)) return 'eliminated';
    if (!isRevealing || selectedAnswer === null) return 'normal';
    if (index === selectedAnswer) return isCorrect ? 'correct' : 'wrong';
    if (!isCorrect && index === question.correctIndex) return 'correct';
    return 'normal';
  };

  const isCheckpoint = SAFE_CHECKPOINTS.includes(questionIndex as 4 | 9);
  const nextCheckpointPrize =
    questionIndex < 5 ? PRIZE_LADDER[4] : questionIndex < 10 ? PRIZE_LADDER[9] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.22 }}
      className="h-full flex flex-col"
    >
      {/* Top info bar */}
      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40">
            Вопрос {questionIndex + 1} / 15
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40">
            {nextCheckpointPrize
              ? `Гарантия: ${questionIndex >= 5 ? PRIZE_LADDER[4] : '0'}`
              : `Гарантия: ${PRIZE_LADDER[9]}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCheckpoint && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-premium-yellow/15 border border-premium-yellow/30 text-premium-yellow">
                Рубеж
              </span>
            )}
          </div>
          <span className="text-[22px] font-black font-display italic tracking-tighter text-premium-yellow leading-none">
            {PRIZE_LADDER[questionIndex]}
          </span>
        </div>

        {/* Mini prize ladder strip */}
        <div className="mt-2 flex gap-1 overflow-hidden">
          {PRIZE_LADDER.map((prize, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < questionIndex
                  ? 'bg-premium-green/60'
                  : i === questionIndex
                    ? 'bg-premium-yellow'
                    : SAFE_CHECKPOINTS.includes(i as 4 | 9)
                      ? 'bg-white/20'
                      : 'bg-white/8'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {/* Question card */}
        <div
          className="glass-card rounded-premium-lg p-5"
          style={{ borderColor: 'rgba(255,204,31,0.2)' }}
        >
          <p className="text-white text-[15px] font-semibold text-center leading-snug">
            {question.text}
          </p>
        </div>

        {/* Audience chart */}
        <AnimatePresence>
          {audienceVotes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-premium-md p-3 overflow-hidden"
              style={{ borderColor: 'rgba(63,123,255,0.25)' }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-premium-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest text-premium-blue">
                  Помощь зала
                </span>
              </div>
              <div className="space-y-1.5">
                {audienceVotes.map((pct, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-white/50 w-4">{LETTERS[i]}</span>
                    <div className="flex-1 h-5 bg-white/5 rounded-sm overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                        className="h-full bg-premium-blue/60 rounded-sm"
                      />
                    </div>
                    <span className="text-[11px] font-black text-white/60 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone friend message */}
        <AnimatePresence>
          {phoneFriendSuggestion !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-premium-md p-3 overflow-hidden"
              style={{ borderColor: 'rgba(0,216,138,0.25)' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-premium-green" />
                <span className="text-[10px] font-black uppercase tracking-widest text-premium-green">
                  Звонок другу
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                <p className="text-[12px] text-white/70 leading-snug">
                  «Я думаю, правильный ответ —{' '}
                  <span className="font-black text-premium-green">
                    {LETTERS[phoneFriendSuggestion]}
                  </span>
                  . Но я не могу быть уверен на 100%...»
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {question.options.map((option, i) => {
            const state = getAnswerState(i);
            return (
              <AnswerButton
                key={i}
                letter={LETTERS[i]}
                text={option}
                state={state}
                disabled={isRevealing || state === 'eliminated'}
                onClick={() => onAnswer(i)}
              />
            );
          })}
        </div>

        {/* Lifelines */}
        <div className="flex justify-center gap-3">
          <LifelineButton
            icon={<Percent className="w-4 h-4" />}
            label="50:50"
            used={usedLifelines.has('50_50')}
            onClick={onFiftyFifty}
            disabled={isRevealing}
          />
          <LifelineButton
            icon={<Phone className="w-4 h-4" />}
            label="Другу"
            used={usedLifelines.has('phone')}
            onClick={onPhoneFriend}
            disabled={isRevealing}
          />
          <LifelineButton
            icon={<Users className="w-4 h-4" />}
            label="Залу"
            used={usedLifelines.has('audience')}
            onClick={onAskAudience}
            disabled={isRevealing}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface AnswerButtonProps {
  letter: string;
  text: string;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
}

const stateStyles: Record<AnswerState, string> = {
  normal: 'border-white/10 bg-white/[0.04] text-white active:scale-95',
  eliminated: 'border-white/5 bg-transparent text-white/15 pointer-events-none',
  selected: 'border-premium-yellow/50 bg-premium-yellow/10 text-premium-yellow',
  correct:
    'border-premium-green/60 bg-premium-green/15 text-premium-green shadow-[0_0_20px_rgba(0,216,138,0.25)]',
  wrong: 'border-premium-red/50 bg-premium-red/10 text-premium-red',
};

const letterStyles: Record<AnswerState, string> = {
  normal: 'bg-white/8 text-white/50',
  eliminated: 'bg-white/4 text-white/15',
  selected: 'bg-premium-yellow/20 text-premium-yellow',
  correct: 'bg-premium-green/20 text-premium-green',
  wrong: 'bg-premium-red/15 text-premium-red',
};

const AnswerButton: React.FC<AnswerButtonProps> = ({ letter, text, state, disabled, onClick }) => (
  <motion.button
    animate={state === 'correct' ? { scale: [1, 1.04, 1] } : {}}
    transition={{ duration: 0.4 }}
    onClick={!disabled ? onClick : undefined}
    disabled={disabled && state !== 'correct' && state !== 'wrong'}
    className={`relative flex items-center gap-2.5 p-3 rounded-premium-md border transition-all duration-300 text-left min-h-[4rem] ${stateStyles[state]}`}
  >
    <span
      className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-black shrink-0 transition-all ${letterStyles[state]}`}
    >
      {letter}
    </span>
    <span className="text-[13px] font-semibold leading-tight flex-1">{text}</span>
  </motion.button>
);

interface LifelineButtonProps {
  icon: React.ReactNode;
  label: string;
  used: boolean;
  onClick: () => void;
  disabled: boolean;
}

const LifelineButton: React.FC<LifelineButtonProps> = ({
  icon,
  label,
  used,
  onClick,
  disabled,
}) => (
  <button
    onClick={!used && !disabled ? onClick : undefined}
    disabled={used || disabled}
    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-premium-sm border transition-all duration-200 active:scale-95 ${
      used
        ? 'border-white/5 bg-transparent text-white/15'
        : 'border-premium-yellow/25 bg-premium-yellow/8 text-premium-yellow hover:bg-premium-yellow/15'
    }`}
  >
    <span className={used ? 'opacity-20' : ''}>{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    {used && (
      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
        Использована
      </span>
    )}
  </button>
);
