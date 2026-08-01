import { MessageSquare, Percent, Phone, Users } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { MillionaireQuestion } from '../content';

import { PRIZE_LADDER, SAFE_CHECKPOINTS } from '@/games/MillionaireGame/constants';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

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

/** Сегмент трёхуровневого прогресса лесенки (5 вопросов) */
const ProgressSegment: React.FC<{ indices: number[]; questionIndex: number }> = ({
  indices,
  questionIndex,
}) => (
  <>
    {indices.map((i) => (
      <View
        key={i}
        className={`flex-1 rounded-full ${
          i < questionIndex
            ? 'bg-premium-green/65'
            : i === questionIndex
              ? 'bg-premium-yellow'
              : 'bg-white/10'
        }`}
        style={{ height: 5 }}
      />
    ))}
  </>
);

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
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'timing', duration: 220 }}
      className="flex-1"
    >
      {/* ── Шапка ── */}
      <View className="shrink-0 px-4 pb-2 pt-3">
        <View className="mb-2 flex-row items-center justify-between">
          {/* Мета вопроса */}
          <View className="flex-row items-center gap-2">
            <Text
              className="text-tag font-black uppercase text-white/35"
              style={{ letterSpacing: 1.6 }}
            >
              {questionIndex + 1} / 15
            </Text>
            <View className="rounded-full bg-white/5 px-1.5 py-0.5">
              <Text
                className="text-micro font-black uppercase text-white/25"
                style={{ letterSpacing: 1 }}
              >
                {tier}
              </Text>
            </View>
            {!!isCheckpoint && (
              <View className="bg-premium-yellow/15 border-premium-yellow/30 rounded-full border px-1.5 py-0.5">
                <Text
                  className="text-micro text-premium-yellow font-black uppercase"
                  style={{ letterSpacing: 2 }}
                >
                  {t(`${NS.MILLIONAIRE}.checkpoint`)}
                </Text>
              </View>
            )}
          </View>

          {/* Сумма */}
          <MotiView
            key={questionIndex}
            from={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            <Text
              className="text-premium-yellow font-black italic"
              style={{
                fontSize: 24,
                lineHeight: 26,
                letterSpacing: -1,
                textShadowColor: 'rgba(255,204,31,0.45)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 14,
              }}
            >
              {PRIZE_LADDER[questionIndex]}
            </Text>
          </MotiView>
        </View>

        {/* Трёхуровневый прогресс: 5 лёгких | 5 средних | 5 сложных */}
        <View className="flex-row items-center" style={{ gap: 3 }}>
          <ProgressSegment indices={[0, 1, 2, 3, 4]} questionIndex={questionIndex} />
          <View className="w-2.5 shrink-0" />
          <ProgressSegment indices={[5, 6, 7, 8, 9]} questionIndex={questionIndex} />
          <View className="w-2.5 shrink-0" />
          <ProgressSegment indices={[10, 11, 12, 13, 14]} questionIndex={questionIndex} />
        </View>

        {/* «Сгорающий фитиль» на время раскрытия */}
        <AnimatePresence>
          {!!isRevealing && (
            <MotiView
              key="fuse"
              from={{ width: '100%' }}
              animate={{ width: '0%' }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 2500 }}
              className="bg-premium-yellow/60 mt-2 rounded-full"
              style={{ height: 1 }}
            />
          )}
        </AnimatePresence>
      </View>

      {/* ── Контент ── */}
      <View className="flex-1 gap-3 px-4 pb-4">
        {/* Карточка вопроса */}
        <View
          className="rounded-premium-lg overflow-hidden border bg-white/5"
          style={{ borderColor: 'rgba(255,204,31,0.18)' }}
        >
          <Text className="text-label p-5 text-center font-semibold text-white">
            {question.text}
          </Text>
        </View>

        {/* Голоса зала */}
        <AnimatePresence>
          {!!audienceVotes && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-premium-md overflow-hidden border bg-white/5 p-3"
              style={{ borderColor: 'rgba(63,123,255,0.25)' }}
            >
              <View className="mb-2.5 flex-row items-center gap-1.5">
                <Users size={14} color={rgba('blue', 1)} />
                <Text
                  className="text-tag text-premium-blue font-black uppercase"
                  style={{ letterSpacing: 2 }}
                >
                  {t(`${NS.MILLIONAIRE}.audienceHelp`)}
                </Text>
              </View>
              <View className="gap-1.5">
                {audienceVotes.map((pct, i) => (
                  <View key={i} className="flex-row items-center gap-2">
                    <Text className="text-label w-4 font-black text-white/40">{LETTERS[i]}</Text>
                    <View className="rounded-premium-xs h-5 flex-1 overflow-hidden bg-white/5">
                      <MotiView
                        from={{ width: '0%' }}
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'timing', duration: 700, delay: i * 100 }}
                        className="rounded-premium-xs h-full"
                        style={{ backgroundColor: 'rgba(63,123,255,0.6)' }}
                      />
                    </View>
                    <Text className="text-label w-8 text-right font-black text-white/55">
                      {pct}%
                    </Text>
                  </View>
                ))}
              </View>
            </MotiView>
          )}
        </AnimatePresence>

        {/* Звонок другу */}
        <AnimatePresence>
          {phoneFriendSuggestion !== null && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-premium-md overflow-hidden border bg-white/5 p-3"
              style={{ borderColor: 'rgba(0,216,138,0.25)' }}
            >
              <View className="mb-1.5 flex-row items-center gap-1.5">
                <Phone size={14} color={rgba('green', 1)} />
                <Text
                  className="text-tag text-premium-green font-black uppercase"
                  style={{ letterSpacing: 2 }}
                >
                  {t(`${NS.MILLIONAIRE}.phoneFriend`)}
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <MessageSquare size={16} color="rgba(255,255,255,0.3)" style={{ marginTop: 2 }} />
                <Text className="text-label flex-1 text-white/70">
                  {t(`${NS.MILLIONAIRE}.phoneFriendMessage`, {
                    letter: LETTERS[phoneFriendSuggestion],
                  })}
                </Text>
              </View>
            </MotiView>
          )}
        </AnimatePresence>

        {/* Сетка ответов */}
        <View className="flex-row flex-wrap gap-2">
          {question.options.map((option, i) => {
            const state = getAnswerState(i);
            return (
              <View key={i} style={{ width: '48%', flexGrow: 1 }}>
                <AnswerButton
                  letter={LETTERS[i]}
                  text={option}
                  state={state}
                  disabled={isRevealing || state === 'eliminated'}
                  onClick={() => {
                    onAnswer(i);
                  }}
                />
              </View>
            );
          })}
        </View>

        {/* Подсказки */}
        <View className="flex-row justify-center gap-8 pt-1">
          <LifelineButton
            icon={Percent}
            label="50:50"
            used={usedLifelines.has('50_50')}
            onClick={onFiftyFifty}
            disabled={isRevealing}
          />
          <LifelineButton
            icon={Phone}
            label={t(`${NS.MILLIONAIRE}.lifelineFriend`)}
            used={usedLifelines.has('phone')}
            onClick={onPhoneFriend}
            disabled={isRevealing}
          />
          <LifelineButton
            icon={Users}
            label={t(`${NS.MILLIONAIRE}.lifelineAudience`)}
            used={usedLifelines.has('audience')}
            onClick={onAskAudience}
            disabled={isRevealing}
          />
        </View>
      </View>
    </MotiView>
  );
};

// ── Кнопка ответа: колонки «буква | текст» ──

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
    wrapper: 'border-white/10 bg-white/5',
    badge: 'bg-white/10 text-white/50',
    divider: 'bg-white/10',
    text: 'text-white',
  },
  eliminated: {
    wrapper: 'border-white/5 bg-transparent',
    badge: 'bg-transparent text-white/15',
    divider: 'bg-white/5',
    text: 'text-white/15',
  },
  selected: {
    wrapper: 'border-premium-yellow/50 bg-premium-yellow/10',
    badge: 'bg-premium-yellow/20 text-premium-yellow',
    divider: 'bg-premium-yellow/20',
    text: 'text-premium-yellow',
  },
  correct: {
    wrapper: 'border-premium-green/60 bg-premium-green/10',
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
    // Веб-анимации результата (пульс/тряска keyframes) заменены spring-акцентом карточки
    <MotiView
      key={state === 'correct' || state === 'wrong' ? state : 'static'}
      from={state === 'correct' || state === 'wrong' ? { scale: 0.94 } : { scale: 1 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <Pressable
        onPress={!disabled ? onClick : undefined}
        disabled={disabled && state !== 'correct' && state !== 'wrong'}
        className={`rounded-premium-md flex-row items-stretch overflow-hidden border ${s.wrapper}`}
        style={({ pressed }) => [
          { minHeight: 72 },
          pressed && !disabled && { transform: [{ scale: 0.95 }] },
        ]}
      >
        {/* Колонка буквы */}
        <View className={`w-10 shrink-0 items-center justify-center ${s.badge.split(' ')[0]}`}>
          <Text className={`text-label font-black ${s.badge.split(' ').slice(1).join(' ')}`}>
            {letter}
          </Text>
        </View>
        <View className={`my-2 w-px ${s.divider}`} />
        {/* Колонка текста */}
        <View className="flex-1 flex-row items-center px-2.5 py-2">
          <Text className={`text-label flex-1 font-semibold ${s.text}`}>{text}</Text>
        </View>
      </Pressable>
    </MotiView>
  );
};

// ── Круглые кнопки подсказок ──

interface LifelineButtonProps {
  icon: typeof Percent;
  label: string;
  used: boolean;
  onClick: () => void;
  disabled: boolean;
}

const LifelineButton: React.FC<LifelineButtonProps> = ({
  icon: Icon,
  label,
  used,
  onClick,
  disabled,
}) => {
  const inactive = used || disabled;
  return (
    <Pressable
      onPress={!used && !disabled ? onClick : undefined}
      disabled={inactive}
      className="items-center gap-1.5"
    >
      <View
        className={`h-12 w-12 items-center justify-center rounded-full border ${
          inactive ? 'border-white/10 bg-transparent' : 'border-premium-yellow/35 bg-premium-yellow/10'
        }`}
      >
        <Icon size={16} color={inactive ? 'rgba(255,255,255,0.15)' : rgba('yellow', 1)} />
      </View>
      <Text
        className={`text-micro font-black uppercase ${
          used ? 'text-white/20 line-through' : 'text-white/40'
        }`}
        style={{ letterSpacing: 2 }}
      >
        {label}
      </Text>
    </Pressable>
  );
};
