import { Cpu, RotateCcw } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ResourceContribRow } from '../components/ResourceContribRow';
import type { Step } from '../constants';
import { OUTCOME_COLOR_MAP, OUTCOME_CONFIG, RESOURCE_META } from '../constants';
import { atLeast, barColor, getPlayerResourceContribution } from '../helpers';
import type {
  BunkerCharacter,
  BunkerResources,
  CatastropheScenario,
  ResourceKey,
  SurvivalEvent,
  SurvivalOutcome,
} from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface SurvivalPhaseProps {
  bunkerTeam: BunkerCharacter[];
  eliminated: BunkerCharacter[];
  scenario: CatastropheScenario;
  events: SurvivalEvent[];
  finalResources: BunkerResources;
  outcome: SurvivalOutcome;
  onRestart: () => void;
}

export const SurvivalPhase: React.FC<SurvivalPhaseProps> = ({
  bunkerTeam,
  eliminated,
  scenario,
  events,
  finalResources,
  outcome,
  onRestart,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('team');
  const [displayedResources, setDisplayedResources] = useState<BunkerResources>({
    food: 100,
    water: 100,
    medicine: 100,
    energy: 100,
    morale: 100,
  });

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep('events');
    }, 800);
    const t2 = setTimeout(() => {
      setStep('resources');
    }, 1500);
    const t3 = setTimeout(() => {
      setDisplayedResources(finalResources);
      feedbackService.vibrate(VIBRATE.celebrate);
    }, 2000);
    const t4 = setTimeout(() => {
      setStep('results');
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [finalResources]);

  // Веб скроллит к итогам через scrollIntoView — в RN секция просто появляется ниже.
  useEffect(() => {
    if (step === 'results') {
      if (outcome === 'full_victory') feedbackService.vibrate(VIBRATE.celebrate);
      else if (outcome === 'defeat') feedbackService.vibrate(VIBRATE.error);
    }
  }, [step, outcome]);

  const cfg = OUTCOME_CONFIG[outcome];
  const OutcomeIcon = cfg.icon;
  const eliminatedBaseDelay = 400 + bunkerTeam.length * 70 + 150;

  return (
    <MotiView
      key="survival"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gap-5 px-5 py-6"
    >
      {/* Метка симуляции */}
      <View className="flex-row items-center justify-center gap-2">
        <MotiView
          from={{ opacity: 1 }}
          animate={{ opacity: 0.4 }}
          transition={{ type: 'timing', duration: 800, loop: true }}
        >
          <Cpu size={16} color={rgba('sky', 1)} />
        </MotiView>
        <Typography.Label size="sm" color="sky">
          {t(`${NS.BUNKER}.survivalLabel`)}
        </Typography.Label>
      </View>

      {/* Карточка катастрофы */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100, type: 'spring', stiffness: 280, damping: 24 }}
        className="rounded-premium-md gap-3 p-4"
        style={{
          backgroundColor: 'rgba(255,138,31,0.09)',
          borderWidth: 1,
          borderColor: 'rgba(255,138,31,0.28)',
        }}
      >
        <View className="flex-row items-start gap-3">
          <Text className="shrink-0 text-3xl">{scenario.emoji}</Text>
          <View className="flex-1">
            <Text className="text-sm font-black text-white">{scenario.title}</Text>
            <Text className="mt-1 text-xs text-white/55">{scenario.description}</Text>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-1.5">
          {(Object.entries(scenario.resourcePenalty) as [ResourceKey, number][]).map(
            ([key, val]) => {
              const meta = RESOURCE_META.find((m) => m.key === key);
              return (
                <View
                  key={key}
                  className="rounded-full px-2 py-1"
                  style={{
                    backgroundColor: 'rgba(255,46,77,0.12)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,46,77,0.3)',
                  }}
                >
                  <Text
                    className="text-tag font-bold"
                    style={{ color: '#FF6B7A', fontVariant: ['tabular-nums'] }}
                  >
                    {meta?.emoji} {val}
                  </Text>
                </View>
              );
            }
          )}
        </View>
      </MotiView>

      {/* Состав команды */}
      <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="gap-2">
        <Typography.Label size="xs" color="muted">
          {t(`${NS.BUNKER}.teamInBunker`)}
        </Typography.Label>
        <View className="flex-row flex-wrap gap-1.5">
          {bunkerTeam.map((c, i) => (
            <MotiView
              key={c.playerName}
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 120, type: 'spring' }}
              className="rounded-premium-sm px-3 py-1.5"
              style={{
                backgroundColor: 'rgba(0,216,138,0.1)',
                borderWidth: 1,
                borderColor: 'rgba(0,216,138,0.3)',
              }}
            >
              <Text className="text-xs font-bold" style={{ color: '#00D88A' }}>
                {c.profession.emoji} {c.playerName}
              </Text>
            </MotiView>
          ))}
          {eliminated.map((c, i) => (
            <MotiView
              key={c.playerName}
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.35 }}
              transition={{ delay: (bunkerTeam.length + i) * 120 }}
              className="rounded-premium-sm px-3 py-1.5"
              style={{
                backgroundColor: 'rgba(255,46,77,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255,46,77,0.2)',
              }}
            >
              <Text className="text-xs font-bold line-through" style={{ color: '#FF2E4D' }}>
                {c.playerName}
              </Text>
            </MotiView>
          ))}
        </View>
      </MotiView>

      {/* События */}
      {atLeast(step, 'events') && (
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="gap-2">
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.eventsInBunker`)}
          </Typography.Label>
          <View className="gap-1.5">
            {events.map((ev, i) => (
              <MotiView
                key={ev.title}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: i * 250 }}
                className="rounded-premium-sm flex-row items-center gap-3 p-2.5"
                style={{
                  backgroundColor: ev.positive ? 'rgba(0,216,138,0.07)' : 'rgba(255,138,31,0.07)',
                  borderWidth: 1,
                  borderColor: ev.positive ? 'rgba(0,216,138,0.2)' : 'rgba(255,138,31,0.2)',
                }}
              >
                <Text className="shrink-0 text-lg">{ev.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-white/80">{ev.title}</Text>
                  <Text className="text-tag mt-0.5 text-white/40">{ev.description}</Text>
                </View>
                <Text
                  className="text-tag shrink-0 font-black"
                  style={{ color: ev.positive ? '#00D88A' : '#FF8A1F' }}
                >
                  {Object.entries(ev.effect)
                    .map(([k, v]) => `${k}:${v > 0 ? '+' : ''}${v}`)
                    .join(' ')}
                </Text>
              </MotiView>
            ))}
          </View>
        </MotiView>
      )}

      {/* Шкалы ресурсов */}
      {atLeast(step, 'resources') && (
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="gap-2">
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.resourcesLabel`)}
          </Typography.Label>
          <View className="gap-2">
            {RESOURCE_META.map(({ key, emoji }) => {
              const val = displayedResources[key];
              const color = barColor(val);
              return (
                <View key={key} className="gap-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-sm">{emoji}</Text>
                      <Text
                        className="text-tag font-black uppercase text-white/50"
                        style={{ letterSpacing: 1 }}
                      >
                        {t(`${NS.BUNKER}.resources.${key}`)}
                      </Text>
                    </View>
                    <MotiView key={val} from={{ scale: 1.2 }} animate={{ scale: 1 }}>
                      <Text
                        className="text-sm font-black"
                        style={{ color, fontVariant: ['tabular-nums'] }}
                      >
                        {val}%
                      </Text>
                    </MotiView>
                  </View>
                  <View className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <MotiView
                      className="h-full rounded-full"
                      from={{ width: '100%' }}
                      animate={{ width: `${val}%` }}
                      transition={{ type: 'timing', duration: 800 }}
                      style={{ backgroundColor: color }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </MotiView>
      )}

      {/* ── Итоги ─────────────────────────────────────────────────────── */}
      {step === 'results' && (
        <View className="gap-5 pt-2">
          {/* Разделитель */}
          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-white/10" />
            <Text
              className="text-tag font-black uppercase text-white/20"
              style={{ letterSpacing: 2 }}
            >
              {t(`${NS.BUNKER}.summaryTag`)}
            </Text>
            <View className="h-px flex-1 bg-white/10" />
          </View>

          {/* Карточка исхода */}
          <MotiView
            from={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="rounded-premium-md items-center gap-3 p-7"
            style={{
              backgroundColor: cfg.bgColor,
              borderWidth: 2,
              borderColor: cfg.borderColor,
            }}
          >
            <OutcomeIcon size={32} color={cfg.color} />
            <Typography.Display size="md" glow align="center" color={OUTCOME_COLOR_MAP[outcome]}>
              {t(`${NS.BUNKER}.outcomes.${outcome}.title`)}
            </Typography.Display>
            <Typography.Body size="sm" color="body" align="center">
              {t(`${NS.BUNKER}.outcomes.${outcome}.subtitle`)}
            </Typography.Body>
          </MotiView>

          {/* Выжившие */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
            className="gap-2"
          >
            <Typography.Label size="xs" color="muted">
              {t(`${NS.BUNKER}.survivorsLabel`)}
            </Typography.Label>
            <View className="gap-1.5">
              {bunkerTeam.map((char, idx) => (
                <MotiView
                  key={char.playerName}
                  from={{ opacity: 0, translateX: -16 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 300 + idx * 70, type: 'spring', stiffness: 280, damping: 26 }}
                  className="rounded-premium-sm p-3"
                  style={{
                    backgroundColor: 'rgba(0,216,138,0.06)',
                    borderWidth: 1,
                    borderColor: 'rgba(0,216,138,0.2)',
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-xl">{char.profession.emoji}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-black text-white">{char.playerName}</Text>
                      <Text className="text-tag text-white/40">
                        {char.profession.name} · {t(`${NS.BUNKER}.ageShort`, { n: char.age })} ·{' '}
                        {char.gender}
                      </Text>
                    </View>
                    <View className="flex-row flex-wrap justify-end gap-1">
                      {[char.health, char.hobby, char.trait].map(
                        (a, i) =>
                          a.isPositive && (
                            <Text key={i} className="text-sm">
                              {a.emoji}
                            </Text>
                          )
                      )}
                    </View>
                  </View>
                  <ResourceContribRow contrib={getPlayerResourceContribution(char)} />
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* Не прошедшие */}
          {eliminated.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: eliminatedBaseDelay }}
              className="gap-2"
            >
              <Typography.Label size="xs" color="muted">
                {t(`${NS.BUNKER}.outsidersLabel`)}
              </Typography.Label>
              <View className="gap-1.5">
                {eliminated.map((char, idx) => (
                  <MotiView
                    key={char.playerName}
                    from={{ opacity: 0, translateX: -16 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{
                      delay: eliminatedBaseDelay + 100 + idx * 70,
                      type: 'spring',
                      stiffness: 280,
                      damping: 26,
                    }}
                    className="rounded-premium-sm p-3"
                    style={{
                      backgroundColor: 'rgba(255,46,77,0.05)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,46,77,0.18)',
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-xl opacity-50">{char.profession.emoji}</Text>
                      <View className="flex-1">
                        <Text
                          className="text-sm font-black"
                          style={{ color: 'rgba(255,100,120,0.8)' }}
                        >
                          {char.playerName}
                        </Text>
                        <Text className="text-tag text-white/30">
                          {char.profession.name} · {t(`${NS.BUNKER}.ageShort`, { n: char.age })} ·{' '}
                          {char.gender}
                        </Text>
                      </View>
                    </View>
                    <ResourceContribRow contrib={getPlayerResourceContribution(char)} />
                  </MotiView>
                ))}
              </View>
            </MotiView>
          )}

          {/* Новая партия */}
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: eliminatedBaseDelay + eliminated.length * 70 + 150 }}
            className="pb-2"
          >
            <PrimaryButton onClick={onRestart} variant="outline" icon={RotateCcw}>
              {t(`${NS.BUNKER}.newGameBtn`)}
            </PrimaryButton>
          </MotiView>
        </View>
      )}
    </MotiView>
  );
};
