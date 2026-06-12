import { Cpu, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

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
  const resultsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (step === 'results' && resultsRef.current) {
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        80
      );
    }
  }, [step]);

  useEffect(() => {
    if (step === 'results') {
      if (outcome === 'full_victory') feedbackService.vibrate(VIBRATE.celebrate);
      else if (outcome === 'defeat') feedbackService.vibrate(VIBRATE.error);
    }
  }, [step, outcome]);

  const cfg = OUTCOME_CONFIG[outcome];
  const OutcomeIcon = cfg.icon;
  const eliminatedBaseDelay = 0.4 + bunkerTeam.length * 0.07 + 0.15;

  return (
    <motion.div
      key="survival"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-5 px-5 py-6"
    >
      {/* Simulation label */}
      <div className="flex items-center justify-center gap-2">
        <Cpu className="text-premium-sky h-4 w-4 animate-pulse" />
        <Typography.Label size="sm" color="sky">
          {t(`${NS.BUNKER}.survivalLabel`)}
        </Typography.Label>
      </div>

      {/* Catastrophe card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 24 }}
        className="rounded-premium-md space-y-3 p-4"
        style={{
          background:
            'linear-gradient(160deg, rgba(255,138,31,0.09) 0%, rgba(255,46,77,0.06) 100%)',
          border: '1px solid rgba(255,138,31,0.28)',
        }}
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 text-3xl leading-none">{scenario.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm leading-tight font-black text-white">{scenario.title}</div>
            <div className="mt-1 text-xs leading-snug text-white/55">{scenario.description}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(scenario.resourcePenalty) as [ResourceKey, number][]).map(
            ([key, val]) => {
              const meta = RESOURCE_META.find((m) => m.key === key);
              return (
                <span
                  key={key}
                  className="text-tag rounded-full px-2 py-1 font-bold tabular-nums"
                  style={{
                    background: 'rgba(255,46,77,0.12)',
                    border: '1px solid rgba(255,46,77,0.3)',
                    color: '#FF6B7A',
                  }}
                >
                  {meta?.emoji} {val}
                </span>
              );
            }
          )}
        </div>
      </motion.div>

      {/* Team composition */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <Typography.Label size="xs" color="muted">
          {t(`${NS.BUNKER}.teamInBunker`)}
        </Typography.Label>
        <div className="flex flex-wrap gap-1.5">
          {bunkerTeam.map((c, i) => (
            <motion.div
              key={c.playerName}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12, type: 'spring' }}
              className="rounded-premium-sm px-3 py-1.5 text-xs font-bold"
              style={{
                background: 'rgba(0,216,138,0.1)',
                border: '1px solid rgba(0,216,138,0.3)',
                color: '#00D88A',
              }}
            >
              {c.profession.emoji} {c.playerName}
            </motion.div>
          ))}
          {eliminated.map((c, i) => (
            <motion.div
              key={c.playerName}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.35 }}
              transition={{ delay: (bunkerTeam.length + i) * 0.12 }}
              className="rounded-premium-sm px-3 py-1.5 text-xs font-bold line-through"
              style={{
                background: 'rgba(255,46,77,0.08)',
                border: '1px solid rgba(255,46,77,0.2)',
                color: '#FF2E4D',
              }}
            >
              {c.playerName}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Events */}
      {atLeast(step, 'events') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.eventsInBunker`)}
          </Typography.Label>
          <div className="space-y-1.5">
            {events.map((ev, i) => (
              <motion.div
                key={ev.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.25 }}
                className="rounded-premium-sm flex items-center gap-3 p-2.5"
                style={{
                  background: ev.positive ? 'rgba(0,216,138,0.07)' : 'rgba(255,138,31,0.07)',
                  border: `1px solid ${ev.positive ? 'rgba(0,216,138,0.2)' : 'rgba(255,138,31,0.2)'}`,
                }}
              >
                <span className="flex-shrink-0 text-lg">{ev.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs leading-tight font-bold text-white/80">{ev.title}</div>
                  <div className="text-tag mt-0.5 leading-tight text-white/40">
                    {ev.description}
                  </div>
                </div>
                <div
                  className="text-tag flex-shrink-0 font-black"
                  style={{ color: ev.positive ? '#00D88A' : '#FF8A1F' }}
                >
                  {Object.entries(ev.effect)
                    .map(([k, v]) => `${k}:${v > 0 ? '+' : ''}${v}`)
                    .join(' ')}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Resource bars */}
      {atLeast(step, 'resources') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.resourcesLabel`)}
          </Typography.Label>
          <div className="space-y-2">
            {RESOURCE_META.map(({ key, emoji }) => {
              const val = displayedResources[key];
              const color = barColor(val);
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{emoji}</span>
                      <span className="text-tag font-black tracking-wider text-white/50 uppercase">
                        {t(`${NS.BUNKER}.resources.${key}`)}
                      </span>
                    </div>
                    <motion.span
                      key={val}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-sm font-black tabular-nums"
                      style={{ color }}
                    >
                      {val}%
                    </motion.span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Results (merged) ──────────────────────────────────────────── */}
      {step === 'results' && (
        <div ref={resultsRef} className="flex flex-col gap-5 pt-2">
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-tag font-black tracking-widest text-white/20 uppercase">
              {t(`${NS.BUNKER}.summaryTag`)}
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          {/* Outcome card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="rounded-premium-md space-y-3 p-7 text-center"
            style={{
              background: cfg.bgColor,
              border: `2px solid ${cfg.borderColor}`,
              boxShadow: `${cfg.shadow}, 0 24px 64px rgba(0,0,0,0.5)`,
            }}
          >
            <OutcomeIcon className="mx-auto h-8 w-8" style={{ color: cfg.color }} />
            <Typography.Display size="md" glow align="center" color={OUTCOME_COLOR_MAP[outcome]}>
              {t(`${NS.BUNKER}.outcomes.${outcome}.title`)}
            </Typography.Display>
            <Typography.Body size="sm" color="body" align="center">
              {t(`${NS.BUNKER}.outcomes.${outcome}.subtitle`)}
            </Typography.Body>
          </motion.div>

          {/* Survivors */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Typography.Label size="xs" color="muted">
              {t(`${NS.BUNKER}.survivorsLabel`)}
            </Typography.Label>
            <div className="space-y-1.5">
              {bunkerTeam.map((char, idx) => (
                <motion.div
                  key={char.playerName}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3 + idx * 0.07,
                    type: 'spring',
                    stiffness: 280,
                    damping: 26,
                  }}
                  className="rounded-premium-sm p-3"
                  style={{
                    background: 'rgba(0,216,138,0.06)',
                    border: '1px solid rgba(0,216,138,0.2)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{char.profession.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-black text-white">{char.playerName}</div>
                      <div className="text-tag text-white/40">
                        {char.profession.name} · {t(`${NS.BUNKER}.ageShort`, { n: char.age })} ·{' '}
                        {char.gender}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1">
                      {[char.health, char.hobby, char.trait].map(
                        (a, i) =>
                          a.isPositive && (
                            <span key={i} className="text-sm" title={a.name}>
                              {a.emoji}
                            </span>
                          )
                      )}
                    </div>
                  </div>
                  <ResourceContribRow contrib={getPlayerResourceContribution(char)} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Eliminated */}
          {eliminated.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: eliminatedBaseDelay }}
              className="space-y-2"
            >
              <Typography.Label size="xs" color="muted">
                {t(`${NS.BUNKER}.outsidersLabel`)}
              </Typography.Label>
              <div className="space-y-1.5">
                {eliminated.map((char, idx) => (
                  <motion.div
                    key={char.playerName}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: eliminatedBaseDelay + 0.1 + idx * 0.07,
                      type: 'spring',
                      stiffness: 280,
                      damping: 26,
                    }}
                    className="rounded-premium-sm p-3"
                    style={{
                      background: 'rgba(255,46,77,0.05)',
                      border: '1px solid rgba(255,46,77,0.18)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl opacity-50">{char.profession.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-sm font-black"
                          style={{ color: 'rgba(255,100,120,0.8)' }}
                        >
                          {char.playerName}
                        </div>
                        <div className="text-tag text-white/30">
                          {char.profession.name} · {t(`${NS.BUNKER}.ageShort`, { n: char.age })} ·{' '}
                          {char.gender}
                        </div>
                      </div>
                    </div>
                    <ResourceContribRow contrib={getPlayerResourceContribution(char)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* New game */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: eliminatedBaseDelay + eliminated.length * 0.07 + 0.15 }}
            className="pb-2"
          >
            <PrimaryButton onClick={onRestart} variant="outline" icon={RotateCcw}>
              {t(`${NS.BUNKER}.newGameBtn`)}
            </PrimaryButton>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
