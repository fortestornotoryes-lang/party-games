import { ChevronRight, Clock, MessageCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';

import { ResourceContribRow } from '../components/ResourceContribRow';
import { getRevealedResourceContribution, getRevealedTrait } from '../helpers';
import { type BunkerCharacter, type DifficultyLevel } from '../types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TimerBar } from '@/shared/components/TimerBar';
import { Typography } from '@/shared/components/Typography';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface DiscussionPhaseProps {
  characters: BunkerCharacter[];
  revealRound: number;
  totalRounds: number;
  difficulty: DifficultyLevel;
  onNext: () => void;
}

/**
 * Списки раскрытий + кнопка «дальше» — вынесены в memo-компонент: их пропсы
 * не меняются каждую секунду (в отличие от timeLeft у родителя), поэтому
 * 1Hz-тик таймера не должен перерендеривать эти списки.
 */
const DiscussionBody: React.FC<{
  characters: BunkerCharacter[];
  revealRound: number;
  totalRounds: number;
  difficulty: DifficultyLevel;
  onNext: () => void;
}> = React.memo(({ characters, revealRound, totalRounds, difficulty, onNext }) => {
  const { t } = useTranslation();
  const isLastRound = revealRound === totalRounds;

  return (
    <>
      {/* Раскрытое в этом раунде */}
      <View className="gap-2">
        <Typography.Label size="xs" color="muted">
          {t(`${NS.BUNKER}.revealedThisRound`)}
        </Typography.Label>
        <View className="gap-1.5">
          {characters.map((char) => {
            const rev = getRevealedTrait(char, revealRound);
            if (!rev) return null;
            return (
              <View
                key={char.playerName}
                className="rounded-premium-sm flex-row items-center gap-3 border border-white/10 bg-white/5 p-3"
              >
                <Text className="w-7 shrink-0 text-center text-xl">{rev.entry.emoji}</Text>
                <View className="flex-1">
                  <Text
                    className="text-micro font-black uppercase text-white/30"
                    style={{ letterSpacing: 2 }}
                  >
                    {char.playerName} · {t(`${NS.BUNKER}.ageShort`, { n: char.age })} ·{' '}
                    {char.gender} · {t(`${NS.BUNKER}.traitLabels.${rev.traitKey}`)}
                  </Text>
                  <Text numberOfLines={1} className="text-sm font-bold text-white">
                    {rev.entry.name}
                  </Text>
                </View>
                {!rev.entry.isPositive && (
                  <Text className="text-premium-red/70 text-xs">⚠</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Сводка предыдущих раундов */}
      {revealRound > 1 && (
        <View className="gap-2">
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.revealedBefore`)}
          </Typography.Label>
          <View className="gap-1">
            {characters.map((char) => {
              const prev: string[] = [];
              for (let r = 1; r < revealRound; r++) {
                const rev = getRevealedTrait(char, r);
                if (rev) prev.push(`${rev.entry.emoji} ${rev.entry.name}`);
              }
              return (
                <View key={char.playerName} className="flex-row items-start gap-2">
                  <Text
                    numberOfLines={1}
                    className="text-label w-20 shrink-0 font-black text-white/50"
                  >
                    {char.playerName}
                  </Text>
                  <Text className="text-label flex-1 text-white/30">{prev.join(' · ')}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Вклад в ресурсы (только на лёгкой сложности) */}
      {difficulty === DIFFICULTY.EASY && (
        <View className="gap-2">
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.resourceContribution`)}
          </Typography.Label>
          <View className="gap-1">
            {characters.map((char) => {
              const contrib = getRevealedResourceContribution(char, revealRound);
              if (Object.values(contrib).every((v) => v === 0)) return null;
              return (
                <View key={char.playerName} className="flex-row items-center gap-2">
                  <Text
                    numberOfLines={1}
                    className="w-20 shrink-0 text-xs font-black text-white/50"
                  >
                    {char.playerName}
                  </Text>
                  <ResourceContribRow contrib={contrib} className="flex-row flex-wrap gap-2" />
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Дальше */}
      <View className="mt-auto">
        <PrimaryButton
          onClick={onNext}
          variant={isLastRound ? 'premium' : 'outline'}
          icon={ChevronRight}
        >
          {isLastRound
            ? t(`${NS.BUNKER}.toVoting`)
            : t(`${NS.BUNKER}.nextRoundBtn`, { next: revealRound + 1, total: totalRounds })}
        </PrimaryButton>
      </View>
    </>
  );
});

export const DiscussionPhase: React.FC<DiscussionPhaseProps> = ({
  characters,
  revealRound,
  totalRounds,
  difficulty,
  onNext,
}) => {
  const { t } = useTranslation();
  const { timerSeconds } = useGameSettings();

  const { timeLeft, start, reset } = useTimer({
    initialTime: timerSeconds,
    onTimeUp: () => {
      feedbackService.vibrate(VIBRATE.timeout);
    },
  });

  useEffect(() => {
    reset(timerSeconds);
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealRound, timerSeconds]);

  // useCallback — стабильная ссылка для memo-компонента DiscussionBody, иначе
  // 1Hz-тик таймера (DiscussionPhase перерендеривается каждую секунду через
  // useTimer) заново перерендеривал бы все списки раскрытий.
  const handleNext = useCallback(() => {
    feedbackService.vibrate(VIBRATE.tap);
    onNext();
  }, [onNext]);

  const timerPct = (timeLeft / timerSeconds) * 100;
  const timerColor = timerPct > 50 ? '#00D88A' : timerPct > 20 ? '#FFCC1F' : '#FF2E4D';

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <MotiView
      key={`discussion-${revealRound}`}
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-5 px-5 py-6"
    >
      {/* Шапка */}
      <View className="items-center gap-1">
        <View className="flex-row items-center justify-center gap-2">
          <MessageCircle size={16} color={rgba('green', 1)} />
          <Typography.Label size="sm" color="green">
            {t(`${NS.BUNKER}.discussionOf`)} —{' '}
            {t(`${NS.BUNKER}.discussionRoundNames.r${revealRound}`)}
          </Typography.Label>
        </View>
        <Typography.Caption color="faint">
          {t(`${NS.BUNKER}.roundOf`, { current: revealRound, total: totalRounds })}
        </Typography.Caption>
      </View>

      {/* Таймер */}
      <View className="gap-2">
        <TimerBar pct={timerPct} color={timerColor} />
        <View className="flex-row items-center justify-center gap-2">
          <Clock size={14} color="rgba(255,255,255,0.3)" />
          <Text
            className="text-2xl font-black italic"
            style={{ color: timerColor, fontVariant: ['tabular-nums'] }}
          >
            {minutes}:{String(seconds).padStart(2, '0')}
          </Text>
        </View>
      </View>

      <DiscussionBody
        characters={characters}
        revealRound={revealRound}
        totalRounds={totalRounds}
        difficulty={difficulty}
        onNext={handleNext}
      />
    </MotiView>
  );
};
