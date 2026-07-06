import { MessageSquare, Percent, Phone, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import type { MillionaireQuestion } from '../content';

import { PRIZE_LADDER, SAFE_CHECKPOINTS } from '@/games/MillionaireGame/constants.ts';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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
  const { t } = useTranslation();

  const getAnswerState = (index: number): AnswerState => {
    if (eliminatedOptions.includes(index)) return 'eliminated';
    if (!isRevealing || selectedAnswer === null) return 'normal';
    if (index === selectedAnswer) return isCorrect ? 'correct' : 'wrong';
    if (!isCorrect && index === question.correctIndex) return 'correct';
    return 'normal';
  };

  const isCheckpoint = SAFE_CHECKPOINTS.includes(questionIndex as 4 | 9);
  const tier =
    questionIndex < 5
      ? t(`${NS.MILLIONAIRE}.tierEasy`)
      : questionIndex < 10
        ? t(`${NS.MILLIONAIRE}.tierMedium`)
        : t(`${NS.MILLIONAIRE}.tierHard`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col"
    >
      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-3 pb-2">
        <div className="mb-2 flex items-center justify-between">
          {/* Left: question meta */}
          <div className="flex items-center gap-2">
            <span className="text-tag font-black tracking-[0.18em] text-white/35 uppercase">
              {questionIndex + 1} / 15
            </span>
            <span className="text-micro rounded-full bg-white/5 px-1.5 py-0.5 font-black tracking-wider text-white/25 uppercase">
              {tier}
            </span>
            {isCheckpoint && (
              <span className="text-micro bg-premium-yellow/15 border-premium-yellow/30 text-premium-yellow rounded-full border px-1.5 py-0.5 font-black tracking-widest uppercase">
                {t(`${NS.MILLIONAIRE}.checkpoint`)}
              </span>
            )}
          </div>

          {/* Right: prize amount */}
          <motion.span
            key={questionIndex}
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="text-heading font-display text-premium-yellow leading-none font-black tracking-tighter italic"
            style={{ textShadow: '0 0 28px rgba(255,204,31,0.45)' }}
          >
            {PRIZE_LADDER[questionIndex]}
          </motion.span>
        </div>

        {/* 3-tier progress: 5 easy | gap | 5 medium | gap | 5 hard */}
        <div className="flex items-center gap-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-[5px] flex-1 rounded-full transition-all duration-300 ${
                i < questionIndex
                  ? 'bg-premium-green/65'
                  : i === questionIndex
                    ? 'bg-premium-yellow'
                    : 'bg-white/10'
              }`}
              style={i === questionIndex ? { boxShadow: '0 0 6px rgba(255,204,31,0.7)' } : {}}
            />
          ))}
          <div className="w-2.5 shrink-0" />
          {[5, 6, 7, 8, 9].map((i) => (
            <div
              key={i}
              className={`h-[5px] flex-1 rounded-full transition-all duration-300 ${
                i < questionIndex
                  ? 'bg-premium-green/65'
                  : i === questionIndex
                    ? 'bg-premium-yellow'
                    : 'bg-white/8'
              }`}
              style={i === questionIndex ? { boxShadow: '0 0 6px rgba(255,204,31,0.7)' } : {}}
            />
          ))}
          <div className="w-2.5 shrink-0" />
          {[10, 11, 12, 13, 14].map((i) => (
            <div
              key={i}
              className={`h-[5px] flex-1 rounded-full transition-all duration-300 ${
                i < questionIndex
                  ? 'bg-premium-green/65'
                  : i === questionIndex
                    ? 'bg-premium-yellow'
                    : 'bg-white/5'
              }`}
              style={i === questionIndex ? { boxShadow: '0 0 6px rgba(255,204,31,0.7)' } : {}}
            />
          ))}
        </div>

        {/* Burning-fuse countdown during reveal */}
        <AnimatePresence>
          {isRevealing && (
            <motion.div
              key="fuse"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: 'linear' }}
              style={{ originX: 0 }}
              className="from-premium-yellow via-premium-yellow/60 mt-2 h-px rounded-full bg-gradient-to-r to-transparent"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Scrollable content ── */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {/* Question card */}
        <div
          className="glass-card rounded-premium-lg overflow-hidden"
          style={{ borderColor: 'rgba(255,204,31,0.18)' }}
        >
          <div className="via-premium-yellow/50 h-px bg-gradient-to-r from-transparent to-transparent" />
          <p className="text-label p-5 text-center leading-snug font-semibold text-white">
            {question.text}
          </p>
        </div>

        {/* Audience chart */}
        <AnimatePresence>
          {!!audienceVotes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-premium-md overflow-hidden p-3"
              style={{ borderColor: 'rgba(63,123,255,0.25)' }}
            >
              <div className="mb-2.5 flex items-center gap-1.5">
                <Users className="text-premium-blue h-3.5 w-3.5" />
                <span className="text-tag text-premium-blue font-black tracking-widest uppercase">
                  {t(`${NS.MILLIONAIRE}.audienceHelp`)}
                </span>
              </div>
              <div className="space-y-1.5">
                {audienceVotes.map((pct, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-label w-4 font-black text-white/40">{LETTERS[i]}</span>
                    <div className="rounded-premium-xs relative h-5 flex-1 overflow-hidden bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                        className="rounded-premium-xs h-full"
                        style={{
                          background:
                            'linear-gradient(90deg, rgba(63,123,255,0.45), rgba(63,123,255,0.75))',
                        }}
                      />
                    </div>
                    <span className="text-label w-8 text-right font-black text-white/55">
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone friend */}
        <AnimatePresence>
          {phoneFriendSuggestion !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-premium-md overflow-hidden p-3"
              style={{ borderColor: 'rgba(0,216,138,0.25)' }}
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <Phone className="text-premium-green h-3.5 w-3.5" />
                <span className="text-tag text-premium-green font-black tracking-widest uppercase">
                  {t(`${NS.MILLIONAIRE}.phoneFriend`)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                <p className="text-label leading-snug text-white/70">
                  {t(`${NS.MILLIONAIRE}.phoneFriendMessage`, {
                    letter: LETTERS[phoneFriendSuggestion],
                  })}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer grid */}
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option, i) => {
            const state = getAnswerState(i);
            return (
              <AnswerButton
                key={i}
                letter={LETTERS[i]}
                text={option}
                state={state}
                disabled={isRevealing || state === 'eliminated'}
                onClick={() => {
                  onAnswer(i);
                }}
              />
            );
          })}
        </div>

        {/* Lifelines */}
        <div className="flex justify-center gap-8 pt-1">
          <LifelineButton
            icon={<Percent className="h-4 w-4" />}
            label="50:50"
            used={usedLifelines.has('50_50')}
            onClick={onFiftyFifty}
            disabled={isRevealing}
          />
          <LifelineButton
            icon={<Phone className="h-4 w-4" />}
            label={t(`${NS.MILLIONAIRE}.lifelineFriend`)}
            used={usedLifelines.has('phone')}
            onClick={onPhoneFriend}
            disabled={isRevealing}
          />
          <LifelineButton
            icon={<Users className="h-4 w-4" />}
            label={t(`${NS.MILLIONAIRE}.lifelineAudience`)}
            used={usedLifelines.has('audience')}
            onClick={onAskAudience}
            disabled={isRevealing}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ── Answer button: split letter / text columns ──

interface AnswerButtonProps {
  letter: string;
  text: string;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
}

interface StateStyle {
  wrapper: string;
  badge: string;
  divider: string;
  text: string;
}

const stateStyles: Record<AnswerState, StateStyle> = {
  normal: {
    wrapper: 'border-white/10 bg-white/[0.04] active:scale-95',
    badge: 'bg-white/8 text-white/50',
    divider: 'bg-white/8',
    text: 'text-white',
  },
  eliminated: {
    wrapper: 'border-white/[0.04] bg-transparent pointer-events-none',
    badge: 'bg-transparent text-white/15',
    divider: 'bg-white/5',
    text: 'text-white/15',
  },
  selected: {
    wrapper: 'border-premium-yellow/50 bg-premium-yellow/8',
    badge: 'bg-premium-yellow/20 text-premium-yellow',
    divider: 'bg-premium-yellow/20',
    text: 'text-premium-yellow',
  },
  correct: {
    wrapper: 'border-premium-green/60 bg-premium-green/10 shadow-[0_0_24px_rgba(0,216,138,0.3)]',
    badge: 'bg-premium-green/20 text-premium-green',
    divider: 'bg-premium-green/25',
    text: 'text-premium-green',
  },
  wrong: {
    wrapper: 'border-premium-red/50 bg-premium-red/10',
    badge: 'bg-premium-red/15 text-premium-red',
    divider: 'bg-premium-red/15',
    text: 'text-premium-red',
  },
};

const AnswerButton: React.FC<AnswerButtonProps> = ({ letter, text, state, disabled, onClick }) => {
  const s = stateStyles[state];
  return (
    <motion.button
      animate={
        state === 'correct'
          ? { scale: [1, 1.05, 1] }
          : state === 'wrong'
            ? { x: [0, -5, 5, -5, 5, 0] }
            : {}
      }
      transition={{ duration: 0.4 }}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled && state !== 'correct' && state !== 'wrong'}
      className={`rounded-premium-md relative flex min-h-[4.5rem] items-stretch overflow-hidden border text-left transition-all duration-300 ${s.wrapper}`}
    >
      {/* Letter column */}
      <div className={`flex w-10 shrink-0 items-center justify-center transition-all ${s.badge}`}>
        <span className="text-label font-black">{letter}</span>
      </div>
      {/* Divider */}
      <div className={`my-2 w-px self-stretch transition-all ${s.divider}`} />
      {/* Text column */}
      <div className="flex flex-1 items-center px-2.5 py-2">
        <span className={`text-label leading-tight font-semibold transition-all ${s.text}`}>
          {text}
        </span>
      </div>
    </motion.button>
  );
};

// ── Circular lifeline buttons ──

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
    className="flex flex-col items-center gap-1.5"
  >
    <motion.div
      animate={
        !used && !disabled
          ? {
              boxShadow: [
                '0 0 0px rgba(255,204,31,0)',
                '0 0 14px rgba(255,204,31,0.35)',
                '0 0 0px rgba(255,204,31,0)',
              ],
            }
          : {}
      }
      transition={{ duration: 2.5, repeat: Infinity }}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 ${
        used || disabled
          ? 'border-white/8 bg-transparent text-white/15'
          : 'border-premium-yellow/35 bg-premium-yellow/10 text-premium-yellow active:scale-90'
      }`}
    >
      {icon}
    </motion.div>
    <span
      className={`text-micro font-black tracking-widest uppercase ${
        used ? 'text-white/20 line-through' : 'text-white/40'
      }`}
    >
      {label}
    </span>
  </button>
);
