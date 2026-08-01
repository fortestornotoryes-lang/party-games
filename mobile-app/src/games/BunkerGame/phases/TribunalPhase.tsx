import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Scale, X } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { getHiddenTraits } from '../helpers';
import { type AttributeEntry, type BunkerCharacter, type TraitKey } from '../types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { pickRandom } from '@/shared/helpers/random';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface TribunalPhaseProps {
  characters: BunkerCharacter[];
  eliminatedNames: string[];
  bunkerTeam: BunkerCharacter[];
  onDone: (finalEliminatedNames: string[]) => void;
}

type TribunalStep = 'choose' | 'reveal' | 'vote' | 'swap' | 'result';

interface AppealTrait {
  key: TraitKey;
  label: string;
  entry: AttributeEntry;
}

const SLIDE = {
  from: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: -20 },
} as const;

/** Строка игрока с бейджем действия (апелляция / исключение) */
const PlayerActionRow: React.FC<{
  char: BunkerCharacter;
  ageLabel: string;
  badge: React.ReactNode;
  bgColor: string;
  borderColor: string;
  onPress: () => void;
}> = ({ char, ageLabel, badge, bgColor, borderColor, onPress }) => (
  <Pressable
    onPress={onPress}
    className="rounded-premium-md w-full flex-row items-center justify-between p-4"
    style={({ pressed }) => [
      { backgroundColor: bgColor, borderWidth: 1, borderColor },
      pressed && { transform: [{ scale: 0.97 }] },
    ]}
  >
    <View className="flex-1">
      <Text className="font-black uppercase italic text-white">{char.playerName}</Text>
      <Text className="mt-1 text-xs text-white/40">
        {ageLabel} · {char.gender} · {char.profession.emoji} {char.profession.name}
      </Text>
    </View>
    {badge}
  </Pressable>
);

export const TribunalPhase: React.FC<TribunalPhaseProps> = ({
  characters,
  eliminatedNames,
  bunkerTeam,
  onDone,
}) => {
  const { t } = useTranslation();
  const { rounds } = useGameSettings();
  const totalRounds = Math.max(3, Math.min(7, rounds));

  // ── Состояние серии апелляций ──────────────────────────────────────────────
  const [pendingNames, setPendingNames] = useState<string[]>(() => [...eliminatedNames]);
  const [currentEliminatedNames, setCurrentEliminatedNames] = useState<string[]>(() => [
    ...eliminatedNames,
  ]);
  const [currentBunkerTeam, setCurrentBunkerTeam] = useState<BunkerCharacter[]>(() => [
    ...bunkerTeam,
  ]);

  // ── Состояние текущей апелляции ────────────────────────────────────────────
  const [step, setStep] = useState<TribunalStep>('choose');
  const [appellant, setAppellant] = useState<BunkerCharacter | null>(null);
  const [appealTrait, setAppealTrait] = useState<AppealTrait | null>(null);
  const [voteResult, setVoteResult] = useState<'pardoned' | 'rejected' | null>(null);
  const [swapTarget, setSwapTarget] = useState<string | null>(null);

  const pendingEliminated = characters.filter((c) => pendingNames.includes(c.playerName));
  const hasMoreAfterThis = pendingNames.length > 1;

  // ── Обработчики ────────────────────────────────────────────────────────────

  const handleAppeal = (char: BunkerCharacter) => {
    feedbackService.vibrate(VIBRATE.tap);
    const hidden = getHiddenTraits(char, totalRounds);
    setAppellant(char);
    if (hidden.length > 0) {
      setAppealTrait(pickRandom(hidden));
      setStep('reveal');
    } else {
      setAppealTrait(null);
      setStep('vote');
    }
  };

  const handleSkip = () => {
    feedbackService.vibrate(VIBRATE.tap);
    onDone(currentEliminatedNames);
  };

  const handleRevealContinue = () => {
    feedbackService.vibrate(VIBRATE.tap);
    setStep('vote');
  };

  const handleVote = (result: 'pardoned' | 'rejected') => {
    feedbackService.vibrate(result === 'pardoned' ? VIBRATE.win : VIBRATE.tap);
    setVoteResult(result);
    setStep(result === 'pardoned' ? 'swap' : 'result');
  };

  const handleSwap = (targetName: string) => {
    feedbackService.vibrate(VIBRATE.tap);
    setSwapTarget(targetName);
    setStep('result');
  };

  const handleContinue = () => {
    feedbackService.vibrate(VIBRATE.tap);

    // Применяем результат этой апелляции
    let newEliminated = [...currentEliminatedNames];
    let newTeam = [...currentBunkerTeam];

    if (voteResult === 'pardoned' && appellant && swapTarget) {
      newEliminated = newEliminated.filter((n) => n !== appellant.playerName);
      newEliminated.push(swapTarget);
      const appellantChar = characters.find((c) => c.playerName === appellant.playerName)!;
      newTeam = newTeam.filter((c) => c.playerName !== swapTarget);
      newTeam.push(appellantChar);
    }

    const newPending = pendingNames.filter((n) => n !== appellant?.playerName);

    setCurrentEliminatedNames(newEliminated);
    setCurrentBunkerTeam(newTeam);
    setPendingNames(newPending);

    // Сброс состояния текущей апелляции
    setAppellant(null);
    setAppealTrait(null);
    setVoteResult(null);
    setSwapTarget(null);

    if (newPending.length === 0) {
      onDone(newEliminated);
    } else {
      setStep('choose');
    }
  };

  // ── Рендер шага ────────────────────────────────────────────────────────────

  const stepContent = (() => {
    // ── ВЫБОР АПЕЛЛЯНТА ────────────────────────────────────────────────────
    if (step === 'choose')
      return (
        <MotiView key="choose" {...SLIDE} className="flex-1 gap-5 px-5 py-6">
          <View className="items-center gap-1">
            <View className="flex-row items-center justify-center gap-2">
              <Scale size={16} color={rgba('yellow', 1)} />
              <Typography.Label size="sm" color="muted">
                {t(`${NS.BUNKER}.tribunalLabel`)}
              </Typography.Label>
            </View>
            <Typography.Title size="sm" color="white" align="center">
              {t(`${NS.BUNKER}.eliminatedCanAppeal`)}
            </Typography.Title>
            <Typography.Caption color="faint" align="center">
              {t(`${NS.BUNKER}.tribunalDesc`)}
            </Typography.Caption>
          </View>

          <View className="gap-2">
            <Typography.Label size="xs" color="muted">
              {t(`${NS.BUNKER}.eliminatedPlayers`)}
              {pendingEliminated.length > 0 ? ` (${pendingEliminated.length})` : ''}
            </Typography.Label>
            <View className="gap-2">
              {pendingEliminated.map((char) => (
                <PlayerActionRow
                  key={char.playerName}
                  char={char}
                  ageLabel={t(`${NS.BUNKER}.ageShort`, { n: char.age })}
                  bgColor={rgba('yellow', 0.05)}
                  borderColor={rgba('yellow', 0.2)}
                  onPress={() => {
                    handleAppeal(char);
                  }}
                  badge={
                    <View
                      className="rounded-premium-sm shrink-0 flex-row items-center gap-1.5 px-3 py-1.5"
                      style={{
                        backgroundColor: rgba('yellow', 0.12),
                        borderWidth: 1,
                        borderColor: rgba('yellow', 0.3),
                      }}
                    >
                      <Scale size={14} color={rgba('yellow', 1)} />
                      <Text
                        className="text-tag font-black uppercase"
                        style={{ color: rgba('yellow', 1), letterSpacing: 1 }}
                      >
                        {t(`${NS.BUNKER}.appealBtn`)}
                      </Text>
                    </View>
                  }
                />
              ))}
            </View>
          </View>

          <View className="mt-auto">
            <PrimaryButton onClick={handleSkip} variant="outline" icon={ChevronRight}>
              {t(`${NS.BUNKER}.skipToSimBtn`)}
            </PrimaryButton>
          </View>
        </MotiView>
      );

    // ── РАСКРЫТИЕ СКРЫТОЙ ХАРАКТЕРИСТИКИ ───────────────────────────────────
    if (step === 'reveal' && appellant && appealTrait)
      return (
        <MotiView key="reveal" {...SLIDE} className="flex-1 gap-6 px-5 py-6">
          <View className="items-center gap-1">
            <Typography.Label size="sm" color="muted">
              {t(`${NS.BUNKER}.appealLabel`)}
            </Typography.Label>
            <Typography.Title size="sm" color="white" align="center">
              {t(`${NS.BUNKER}.revealingHiddenTrait`, { player: appellant.playerName })}
            </Typography.Title>
          </View>

          <View className="flex-1 items-center justify-center">
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="rounded-premium-2xl w-full items-center gap-4 overflow-hidden p-8"
              style={{ borderWidth: 1.5, borderColor: rgba('yellow', 0.35) }}
            >
              <LinearGradient
                colors={[rgba('yellow', 0.12), 'rgba(0,0,0,0.3)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View
                className="rounded-full px-3 py-1"
                style={{
                  backgroundColor: rgba('yellow', 0.15),
                  borderWidth: 1,
                  borderColor: rgba('yellow', 0.3),
                }}
              >
                <Text
                  className="text-tag font-black uppercase"
                  style={{ color: rgba('yellow', 1), letterSpacing: 3 }}
                >
                  {t(`${NS.BUNKER}.wasHidden`, {
                    label: t(`${NS.BUNKER}.traitLabels.${appealTrait.key}`),
                  })}
                </Text>
              </View>
              <MotiView
                from={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 100, type: 'spring', stiffness: 300 }}
              >
                <Text style={{ fontSize: 56, lineHeight: 62 }}>{appealTrait.entry.emoji}</Text>
              </MotiView>
              <MotiView
                from={{ translateY: 10, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                transition={{ delay: 180 }}
              >
                <Typography.Display size="sm" color="white" glow align="center">
                  {appealTrait.entry.name.toUpperCase()}
                </Typography.Display>
              </MotiView>
            </MotiView>
          </View>

          <PrimaryButton onClick={handleRevealContinue} icon={ChevronRight}>
            {t(`${NS.BUNKER}.toVoting`)}
          </PrimaryButton>
        </MotiView>
      );

    // ── ГОЛОСОВАНИЕ ────────────────────────────────────────────────────────
    if (step === 'vote' && appellant)
      return (
        <MotiView key="vote" {...SLIDE} className="flex-1 gap-6 px-5 py-6">
          <View className="items-center gap-1">
            <Typography.Label size="sm" color="muted">
              {t(`${NS.BUNKER}.tribunalVoteLabel`)}
            </Typography.Label>
            <Typography.Title size="sm" color="white" align="center">
              {t(`${NS.BUNKER}.includeInBunker`, { player: appellant.playerName })}
            </Typography.Title>
            <Typography.Caption color="faint" align="center">
              {t(`${NS.BUNKER}.majorityDecides`)}
            </Typography.Caption>
          </View>

          <View className="flex-1 justify-center gap-4">
            <Pressable
              onPress={() => {
                handleVote('pardoned');
              }}
              className="rounded-premium-2xl w-full items-center gap-2 p-6"
              style={({ pressed }) => [
                {
                  backgroundColor: rgba('green', 0.08),
                  borderWidth: 2,
                  borderColor: rgba('green', 0.35),
                },
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text className="text-4xl">🕊️</Text>
              <Typography.Heading size="sm" color="white" align="center">
                {t(`${NS.BUNKER}.pardonBtn`)}
              </Typography.Heading>
              <Typography.Caption color="faint" align="center">
                {t(`${NS.BUNKER}.pardonDesc`)}
              </Typography.Caption>
            </Pressable>

            <Pressable
              onPress={() => {
                handleVote('rejected');
              }}
              className="rounded-premium-2xl w-full items-center gap-2 p-6"
              style={({ pressed }) => [
                {
                  backgroundColor: rgba('red', 0.06),
                  borderWidth: 2,
                  borderColor: rgba('red', 0.25),
                },
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text className="text-4xl">⛔</Text>
              <Typography.Heading size="sm" color="white" align="center">
                {t(`${NS.BUNKER}.excludeBtn`)}
              </Typography.Heading>
              <Typography.Caption color="faint" align="center">
                {t(`${NS.BUNKER}.excludeDesc`)}
              </Typography.Caption>
            </Pressable>
          </View>
        </MotiView>
      );

    // ── ОБМЕН МЕСТАМИ ──────────────────────────────────────────────────────
    if (step === 'swap' && appellant)
      return (
        <MotiView key="swap" {...SLIDE} className="flex-1 gap-5 px-5 py-6">
          <View className="items-center gap-2">
            <View
              className="flex-row items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                backgroundColor: rgba('green', 0.12),
                borderWidth: 1,
                borderColor: rgba('green', 0.3),
              }}
            >
              <Text
                className="text-tag font-black uppercase"
                style={{ color: rgba('green', 1), letterSpacing: 2 }}
              >
                {t(`${NS.BUNKER}.playerPardonedBadge`, { player: appellant.playerName })}
              </Text>
            </View>
            <Typography.Title size="sm" color="white" align="center">
              {t(`${NS.BUNKER}.whoFreesSpot`)}
            </Typography.Title>
            <Typography.Caption color="faint" align="center">
              {t(`${NS.BUNKER}.chooseFromBunker`)}
            </Typography.Caption>
          </View>

          <View className="gap-2">
            {currentBunkerTeam.map((char) => (
              <PlayerActionRow
                key={char.playerName}
                char={char}
                ageLabel={t(`${NS.BUNKER}.ageShort`, { n: char.age })}
                bgColor={rgba('red', 0.05)}
                borderColor={rgba('red', 0.2)}
                onPress={() => {
                  handleSwap(char.playerName);
                }}
                badge={
                  <View
                    className="rounded-premium-sm shrink-0 flex-row items-center gap-1.5 px-3 py-1.5"
                    style={{
                      backgroundColor: rgba('red', 0.12),
                      borderWidth: 1,
                      borderColor: rgba('red', 0.3),
                    }}
                  >
                    <X size={14} color={rgba('red', 1)} />
                    <Text
                      className="text-tag text-premium-red font-black uppercase"
                      style={{ letterSpacing: 1 }}
                    >
                      {t(`${NS.BUNKER}.excludeSmall`)}
                    </Text>
                  </View>
                }
              />
            ))}
          </View>
        </MotiView>
      );

    // ── РЕЗУЛЬТАТ ──────────────────────────────────────────────────────────
    if (step === 'result') {
      const pardoned = voteResult === 'pardoned';
      return (
        <MotiView
          key="result"
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, translateY: -20 }}
          className="flex-1 items-center justify-center gap-6 px-5 py-6"
        >
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Text style={{ fontSize: 68, lineHeight: 76 }}>{pardoned ? '🕊️' : '⛔'}</Text>
          </MotiView>

          <View className="items-center gap-2">
            <Typography.Display size="sm" color="white" glow align="center">
              {pardoned
                ? t(`${NS.BUNKER}.playerPardonedTitle`, { player: appellant?.playerName ?? '' })
                : t(`${NS.BUNKER}.playerExcludedTitle`, { player: appellant?.playerName ?? '' })}
            </Typography.Display>
            {!!pardoned && !!swapTarget && (
              <Typography.Body size="sm" color="muted" align="center">
                {t(`${NS.BUNKER}.spotFreedBy`, { player: swapTarget })}
              </Typography.Body>
            )}
          </View>

          <View className="mt-auto w-full">
            <PrimaryButton
              onClick={handleContinue}
              variant={pardoned ? 'premium' : 'outline'}
              icon={ChevronRight}
            >
              {hasMoreAfterThis
                ? t(`${NS.BUNKER}.nextAppellantBtn`)
                : t(`${NS.BUNKER}.toSurvivalBtn`)}
            </PrimaryButton>
          </View>
        </MotiView>
      );
    }

    return null;
  })();

  return <AnimatePresence exitBeforeEnter>{stepContent}</AnimatePresence>;
};
