import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu } from 'lucide-react';
import { Typography } from '@/components/UI';
import { feedbackService, VIBRATE } from '@/services/feedbackService';
import type { BunkerCharacter, BunkerResources, CatastropheScenario, SurvivalEvent } from '../types';

interface SurvivalPhaseProps {
  bunkerTeam: BunkerCharacter[];
  eliminated: BunkerCharacter[];
  scenario: CatastropheScenario;
  events: SurvivalEvent[];
  finalResources: BunkerResources;
  outcome: 'full_victory' | 'partial' | 'pyrrhic' | 'defeat';
  onReveal: () => void;
}

const RESOURCE_META: { key: keyof BunkerResources; label: string; emoji: string }[] = [
  { key: 'food',     label: 'Питание',    emoji: '🍎' },
  { key: 'water',    label: 'Вода',       emoji: '💧' },
  { key: 'medicine', label: 'Медицина',   emoji: '💊' },
  { key: 'energy',   label: 'Энергия',    emoji: '⚡' },
  { key: 'morale',   label: 'Моральный дух', emoji: '🧠' },
];

function barColor(val: number) {
  if (val >= 60) return '#00D88A';
  if (val >= 35) return '#FFCC1F';
  if (val >= 15) return '#FF8A1F';
  return '#FF2E4D';
}

type Step = 'team' | 'events' | 'resources' | 'done';

export const SurvivalPhase: React.FC<SurvivalPhaseProps> = ({
  bunkerTeam,
  eliminated,
  scenario,
  events,
  finalResources,
  outcome,
  onReveal,
}) => {
  const [step, setStep] = useState<Step>('team');
  const [displayedResources, setDisplayedResources] = useState<BunkerResources>({
    food: 100, water: 100, medicine: 100, energy: 100, morale: 100,
  });

  // Step progression
  useEffect(() => {
    const t1 = setTimeout(() => setStep('events'), 1800);
    const t2 = setTimeout(() => setStep('resources'), 3500);
    const t3 = setTimeout(() => {
      setDisplayedResources(finalResources);
      feedbackService.vibrate(VIBRATE.celebrate);
    }, 4000);
    const t4 = setTimeout(() => {
      setStep('done');
    }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [finalResources]);

  return (
    <motion.div
      key="survival"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full px-5 py-6 gap-5"
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Cpu className="w-4 h-4 text-premium-sky animate-pulse" />
          <Typography.Label size="sm" color="sky">СИМУЛЯЦИЯ ВЫЖИВАНИЯ</Typography.Label>
        </div>
        <Typography.Caption color="faint">{scenario.emoji} {scenario.title}</Typography.Caption>
      </div>

      {/* Team in bunker */}
      <AnimatePresence>
        {(step === 'team' || step === 'events' || step === 'resources' || step === 'done') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Typography.Label size="xs" color="muted">🏠 Команда в бункере</Typography.Label>
            <div className="flex flex-wrap gap-1.5">
              {bunkerTeam.map((c, i) => (
                <motion.div
                  key={c.playerName}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.12, type: 'spring' }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold"
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
                  className="px-3 py-1.5 rounded-xl text-xs font-bold line-through"
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
        )}
      </AnimatePresence>

      {/* Events */}
      <AnimatePresence>
        {(step === 'events' || step === 'resources' || step === 'done') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Typography.Label size="xs" color="muted">⚡ События в бункере</Typography.Label>
            <div className="space-y-1.5">
              {events.map((ev, i) => (
                <motion.div
                  key={ev.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.25 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{
                    background: ev.positive ? 'rgba(0,216,138,0.07)' : 'rgba(255,138,31,0.07)',
                    border: `1px solid ${ev.positive ? 'rgba(0,216,138,0.2)' : 'rgba(255,138,31,0.2)'}`,
                  }}
                >
                  <span className="text-lg flex-shrink-0">{ev.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white/80 leading-tight">{ev.title}</div>
                    <div className="text-[10px] text-white/40 leading-tight mt-0.5">{ev.description}</div>
                  </div>
                  <div className="text-[10px] font-black flex-shrink-0" style={{ color: ev.positive ? '#00D88A' : '#FF8A1F' }}>
                    {ev.positive ? '+' : ''}
                    {Object.entries(ev.effect).map(([k, v]) => `${k}:${v > 0 ? '+' : ''}${v}`).join(', ')}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resource bars */}
      <AnimatePresence>
        {(step === 'resources' || step === 'done') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Typography.Label size="xs" color="muted">📊 Ресурсы бункера</Typography.Label>
            <div className="space-y-2">
              {RESOURCE_META.map(({ key, label, emoji }) => {
                const val = displayedResources[key];
                const color = barColor(val);
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{emoji}</span>
                        <span className="text-[10px] text-white/50 font-black uppercase tracking-wider">{label}</span>
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
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
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
      </AnimatePresence>

      {/* See results button */}
      <AnimatePresence>
        {step === 'done' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReveal}
            className="mt-auto w-full h-16 rounded-premium-md font-black italic text-xl text-black uppercase transition-all active:scale-95"
            style={{
              background: outcome === 'defeat'
                ? 'linear-gradient(135deg, #FF2E4D, #FF8A1F)'
                : 'linear-gradient(135deg, #00D88A, #1FB6FF)',
              boxShadow: outcome === 'defeat'
                ? '0 20px 50px rgba(255,46,77,0.4)'
                : '0 20px 50px rgba(0,216,138,0.4)',
            }}
          >
            УЗНАТЬ ИТОГ →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
