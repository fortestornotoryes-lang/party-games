import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Skull, Trophy, AlertTriangle, Zap } from 'lucide-react';
import { PrimaryButton, Typography } from '@/components/UI';
import { feedbackService, VIBRATE } from '@/services/feedbackService';
import { useTranslation } from '@/i18n';
import { NS } from '@/i18n/keys';
import type { BunkerCharacter, BunkerResources, SurvivalOutcome } from '../types';

interface ResultsPhaseProps {
  bunkerTeam: BunkerCharacter[];
  eliminated: BunkerCharacter[];
  resources: BunkerResources;
  outcome: SurvivalOutcome;
  onRestart: () => void;
}

const OUTCOME_COLOR_MAP: Record<SurvivalOutcome, 'green' | 'yellow' | 'orange' | 'red'> = {
  full_victory: 'green',
  partial: 'yellow',
  pyrrhic: 'orange',
  defeat: 'red',
};

const OUTCOME_CONFIG: Record<
  SurvivalOutcome,
  {
    emoji: string;
    color: string;
    bgColor: string;
    borderColor: string;
    shadow: string;
    icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  }
> = {
  full_victory: {
    emoji: '🏆',
    color: '#00D88A',
    bgColor: 'rgba(0,216,138,0.1)',
    borderColor: 'rgba(0,216,138,0.5)',
    shadow: '0 0 80px rgba(0,216,138,0.3)',
    icon: Trophy,
  },
  partial: {
    emoji: '⚠️',
    color: '#FFCC1F',
    bgColor: 'rgba(255,204,31,0.1)',
    borderColor: 'rgba(255,204,31,0.4)',
    shadow: '0 0 60px rgba(255,204,31,0.2)',
    icon: AlertTriangle,
  },
  pyrrhic: {
    emoji: '💀',
    color: '#FF8A1F',
    bgColor: 'rgba(255,138,31,0.1)',
    borderColor: 'rgba(255,138,31,0.4)',
    shadow: '0 0 60px rgba(255,138,31,0.2)',
    icon: Zap,
  },
  defeat: {
    emoji: '☠️',
    color: '#FF2E4D',
    bgColor: 'rgba(255,46,77,0.1)',
    borderColor: 'rgba(255,46,77,0.45)',
    shadow: '0 0 80px rgba(255,46,77,0.3)',
    icon: Skull,
  },
};

const RESOURCE_META: { key: keyof BunkerResources; emoji: string }[] = [
  { key: 'food', emoji: '🍎' },
  { key: 'water', emoji: '💧' },
  { key: 'medicine', emoji: '💊' },
  { key: 'energy', emoji: '⚡' },
  { key: 'morale', emoji: '🧠' },
];

function barColor(val: number) {
  if (val >= 60) return '#00D88A';
  if (val >= 35) return '#FFCC1F';
  if (val >= 15) return '#FF8A1F';
  return '#FF2E4D';
}

export const ResultsPhase: React.FC<ResultsPhaseProps> = ({
  bunkerTeam,
  eliminated,
  resources,
  outcome,
  onRestart,
}) => {
  const { t } = useTranslation();
  const cfg = OUTCOME_CONFIG[outcome];
  const Icon = cfg.icon;

  React.useEffect(() => {
    if (outcome === 'full_victory') {
      feedbackService.vibrate(VIBRATE.celebrate);
    } else if (outcome === 'defeat') {
      feedbackService.vibrate(VIBRATE.error);
    }
  }, [outcome]);

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col px-5 py-6 gap-5 min-h-full"
    >
      {/* Outcome card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className="rounded-2xl p-7 text-center space-y-3"
        style={{
          background: cfg.bgColor,
          border: `2px solid ${cfg.borderColor}`,
          boxShadow: `${cfg.shadow}, 0 24px 64px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="text-6xl">{cfg.emoji}</div>
        <Icon className="w-8 h-8 mx-auto" style={{ color: cfg.color }} />
        <Typography.Display size="md" glow align="center" color={OUTCOME_COLOR_MAP[outcome]}>
          {t(`${NS.BUNKER}.outcomes.${outcome}.title`)}
        </Typography.Display>
        <Typography.Body size="sm" color="body" align="center">
          {t(`${NS.BUNKER}.outcomes.${outcome}.subtitle`)}
        </Typography.Body>
      </motion.div>

      {/* Resource summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-2"
      >
        <Typography.Label size="xs" color="muted">
          {t(`${NS.BUNKER}.finalResources`)}
        </Typography.Label>
        <div className="space-y-1.5">
          {RESOURCE_META.map(({ key, emoji }) => {
            const val = resources[key];
            const color = barColor(val);
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-base w-5 text-center flex-shrink-0">{emoji}</span>
                <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
                    style={{ background: color }}
                  />
                </div>
                <span
                  className="text-xs font-black tabular-nums w-8 text-right flex-shrink-0"
                  style={{ color }}
                >
                  {val}%
                </span>
                <span className="text-tag text-white/25 w-14 flex-shrink-0">
                  {t(`${NS.BUNKER}.resources.${key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bunker team */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <Typography.Label size="xs" color="muted">
          {t(`${NS.BUNKER}.survivorsLabel`)}
        </Typography.Label>
        <div className="space-y-1.5">
          {bunkerTeam.map((char) => (
            <div
              key={char.playerName}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: 'rgba(0,216,138,0.06)',
                border: '1px solid rgba(0,216,138,0.2)',
              }}
            >
              <span className="text-xl">{char.profession.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white">{char.playerName}</div>
                <div className="text-tag text-white/40">{char.profession.name}</div>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
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
          ))}
        </div>
      </motion.div>

      {/* Eliminated */}
      {eliminated.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.outsidersLabel`)}
          </Typography.Label>
          <div className="flex flex-wrap gap-1.5">
            {eliminated.map((char) => (
              <div
                key={char.playerName}
                className="px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{
                  background: 'rgba(255,46,77,0.07)',
                  border: '1px solid rgba(255,46,77,0.2)',
                  color: 'rgba(255,100,120,0.7)',
                }}
              >
                {char.profession.emoji} {char.playerName}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Restart */}
      <div className="mt-auto pt-2">
        <PrimaryButton onClick={onRestart} variant="outline" icon={RotateCcw}>
          {t(`${NS.BUNKER}.newGameBtn`)}
        </PrimaryButton>
      </div>
    </motion.div>
  );
};
