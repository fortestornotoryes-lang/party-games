import { BarChart3, ChevronLeft, Play, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import type { SimReport } from './bunkerBalance';
import { runBunkerSimulation } from './bunkerBalance';

import { OUTCOME_CONFIG, RESOURCE_META } from '@/games/BunkerGame/constants.ts';

// ─── Constants ────────────────────────────────────────────────────────────────

const RUN_OPTIONS = [50, 200, 1000, 5000];

const FACTOR_META = [
  {
    key: 'scenario' as const,
    label: 'Катастрофа',
    color: '#FF2E4D',
    netKey: 'scenarioNet' as const,
  },
  { key: 'team' as const, label: 'Команда', color: '#00D88A', netKey: 'teamNet' as const },
  { key: 'events' as const, label: 'Ивенты', color: '#60A5FA', netKey: 'eventsNet' as const },
];

const DIFF_COLOR = { easy: '#00D88A', medium: '#FFCC1F', hard: '#FF2E4D' };

// ─── Helper sub-components ───────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-micro mb-2 font-black tracking-[0.2em] text-white/30 uppercase">
      {children}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {children}
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
  color,
  suffix = '%',
  extra,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
  extra?: React.ReactNode;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 flex-shrink-0 truncate text-xs text-white/50">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ background: color }}
        />
      </div>
      <span
        className="w-10 flex-shrink-0 text-right text-xs font-black tabular-nums"
        style={{ color }}
      >
        {value}
        {suffix}
      </span>
      {extra}
    </div>
  );
}

function NetBadge({ net }: { net: number }) {
  const color = net >= 0 ? '#00D88A' : '#FF2E4D';
  return (
    <span
      className="text-micro w-12 flex-shrink-0 text-right font-black tabular-nums"
      style={{ color }}
    >
      {net >= 0 ? '+' : ''}
      {net}
    </span>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

interface BunkerBalanceViewProps {
  onClose: () => void;
}

export const BunkerBalanceView: React.FC<BunkerBalanceViewProps> = ({ onClose }) => {
  const [runCount, setRunCount] = useState(200);
  const [countHidden, setCountHidden] = useState(true);
  const [report, setReport] = useState<SimReport | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      const result = runBunkerSimulation(runCount, countHidden);
      setReport(result);
      setRunning(false);
    }, 16);
  };

  return (
    <motion.div
      key="balance-view"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(160deg,#0e0e12 0%,#080809 100%)' }}
    >
      {/* Header */}
      <div
        className="flex flex-shrink-0 items-center gap-3 px-4 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition-all hover:text-white/70 active:scale-90"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <BarChart3 className="h-5 w-5 text-orange-400" />
        <div className="flex-1">
          <div className="text-sm font-black tracking-wide text-white uppercase">
            Симуляция баланса
          </div>
          <div className="text-micro text-white/30">Бункер</div>
        </div>
        {!!report && (
          <span className="text-micro text-white/25 tabular-nums">{report.durationMs} мс</span>
        )}
      </div>

      {/* Controls */}
      <div
        className="flex flex-shrink-0 flex-wrap items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="mr-1 text-xs text-white/40">Попыток:</span>
        {RUN_OPTIONS.map((n) => (
          <button
            key={n}
            onClick={() => {
              setRunCount(n);
            }}
            className="rounded-lg px-3 py-1.5 text-xs font-black transition-all active:scale-95"
            style={{
              background: runCount === n ? 'rgba(255,138,31,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${runCount === n ? 'rgba(255,138,31,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: runCount === n ? '#FF8A1F' : 'rgba(255,255,255,0.45)',
            }}
          >
            {n}
          </button>
        ))}
        <div className="mx-1 h-4 w-px bg-white/10" />
        <button
          onClick={() => {
            setCountHidden((v) => !v);
          }}
          className="rounded-lg px-3 py-1.5 text-xs font-black transition-all active:scale-95"
          style={{
            background: countHidden ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${countHidden ? 'rgba(96,165,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: countHidden ? '#60A5FA' : 'rgba(255,255,255,0.35)',
          }}
        >
          {countHidden ? '👁 все черты' : '👁 раскрытые'}
        </button>
        <div className="flex-1" />
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black tracking-wide uppercase transition-all active:scale-95 disabled:opacity-50"
          style={{ background: 'rgba(255,138,31,0.85)', color: '#000' }}
        >
          {running ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          {running ? 'Считаю...' : 'Запустить'}
        </button>
      </div>

      {/* Results */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
        <AnimatePresence mode="wait">
          {!report && !running && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-48 flex-col items-center justify-center gap-3"
            >
              <BarChart3 className="h-10 w-10 text-white/10" />
              <p className="text-center text-sm text-white/25">
                Выберите количество попыток и нажмите «Запустить»
              </p>
            </motion.div>
          )}

          {!!report && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Summary row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Игроков', value: report.avgPlayerCount.toFixed(1) },
                  { label: 'В бункере', value: report.avgBunkerSize.toFixed(1) },
                  { label: 'Ивентов', value: report.avgEventCount.toFixed(1) },
                ].map(({ label, value }) => (
                  <Card key={label} className="text-center">
                    <div className="text-lg font-black text-white">{value}</div>
                    <div className="text-micro mt-0.5 text-white/35">{label}</div>
                  </Card>
                ))}
              </div>

              {/* Outcome distribution */}
              <div>
                <SectionTitle>Распределение исходов</SectionTitle>
                <Card className="space-y-2.5">
                  {(Object.keys(OUTCOME_CONFIG) as (keyof typeof OUTCOME_CONFIG)[]).map((key) => {
                    const meta = OUTCOME_CONFIG[key];
                    const pct = report.outcomesPct[key];
                    const cnt = report.outcomes[key];
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="w-20 flex-shrink-0 text-xs text-white/50">
                          {meta.label}
                        </span>
                        <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-white/5">
                          <motion.div
                            className="absolute inset-y-0 left-0 flex items-center rounded-md pl-2"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            style={{ background: meta.bgColor, minWidth: pct > 5 ? undefined : 0 }}
                          />
                          {pct > 7 && (
                            <span
                              className="text-micro absolute inset-y-0 left-2 flex items-center font-black"
                              style={{ color: meta.color }}
                            >
                              {cnt}×
                            </span>
                          )}
                        </div>
                        <span
                          className="w-10 flex-shrink-0 text-right text-sm font-black tabular-nums"
                          style={{ color: meta.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </Card>
              </div>

              {/* Factor influence */}
              <div>
                <SectionTitle>Влияние факторов на исход</SectionTitle>
                <Card className="space-y-2.5">
                  <div className="text-micro mb-1 flex justify-between text-white/25">
                    <span>Фактор</span>
                    <span className="pr-1">% движения · Нетто</span>
                  </div>
                  {FACTOR_META.map(({ key, label, color, netKey }) => {
                    const pct = report.factorInfluence[key];
                    const net = report.factorInfluence[netKey];
                    return (
                      <BarRow
                        key={key}
                        label={label}
                        value={pct}
                        max={100}
                        color={color}
                        extra={<NetBadge net={net} />}
                      />
                    );
                  })}
                  <p className="text-micro pt-1 leading-relaxed text-white/20">
                    % движения — доля абс. изменений ресурсов от каждого фактора. Нетто — среднее
                    суммарное изменение за игру.
                  </p>
                </Card>
              </div>

              {/* Average resources */}
              <div>
                <SectionTitle>Средние финальные ресурсы</SectionTitle>
                <Card className="space-y-2.5">
                  {RESOURCE_META.map(({ key, emoji, label }) => {
                    const val = report.avgResources[key];
                    const color =
                      val >= 55
                        ? '#00D88A'
                        : val >= 35
                          ? '#FFCC1F'
                          : val >= 15
                            ? '#FF8A1F'
                            : '#FF2E4D';
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="w-5 flex-shrink-0 text-center text-base">{emoji}</span>
                        <span className="w-16 flex-shrink-0 text-xs text-white/40">{label}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{ background: color }}
                          />
                        </div>
                        <span
                          className="w-8 flex-shrink-0 text-right text-xs font-black tabular-nums"
                          style={{ color }}
                        >
                          {val}%
                        </span>
                      </div>
                    );
                  })}
                </Card>
              </div>

              {/* By difficulty */}
              <div>
                <SectionTitle>По сложности</SectionTitle>
                <div className="space-y-2">
                  {report.difficultyStats
                    .filter((d) => d.runs > 0)
                    .map((d) => (
                      <Card key={d.difficulty}>
                        <div className="mb-2 flex items-center gap-3">
                          <span
                            className="text-xs font-black tracking-wide uppercase"
                            style={{ color: DIFF_COLOR[d.difficulty] }}
                          >
                            {d.label}
                          </span>
                          <span className="text-micro text-white/25">{d.runs} попыток</span>
                          <div className="flex-1" />
                          <span
                            className="text-sm font-black"
                            style={{ color: DIFF_COLOR[d.difficulty] }}
                          >
                            {d.winRate}% побед
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {(Object.keys(OUTCOME_CONFIG) as (keyof typeof OUTCOME_CONFIG)[]).map(
                            (key) => {
                              const cnt = d.outcomes[key];
                              if (!cnt) return null;
                              const pct = Math.round((cnt / d.runs) * 100);
                              return (
                                <div
                                  key={key}
                                  className="h-1 flex-1 rounded-full"
                                  style={{
                                    background: OUTCOME_CONFIG[key].color,
                                    opacity: 0.6 + pct / 200,
                                    flexBasis: `${pct}%`,
                                  }}
                                  title={`${OUTCOME_CONFIG[key].label}: ${pct}%`}
                                />
                              );
                            }
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {RESOURCE_META.map(({ key, emoji }) => {
                            const val = d.avgResources[key];
                            const color = val >= 55 ? '#00D88A' : val >= 35 ? '#FFCC1F' : '#FF2E4D';
                            return (
                              <span key={key} className="text-micro tabular-nums" style={{ color }}>
                                {emoji}
                                {val}%
                              </span>
                            );
                          })}
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Scenario ranking */}
              <div>
                <SectionTitle>
                  Катастрофы: рейтинг выживаемости ({report.scenarioStats.length} сценариев)
                </SectionTitle>
                <div className="space-y-1.5">
                  {report.scenarioStats.map((sc, idx) => (
                    <motion.div
                      key={sc.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.015 }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <span className="text-micro w-4 flex-shrink-0 text-right text-white/20 tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="flex-shrink-0 text-sm">{sc.emoji}</span>
                      <span className="flex-1 truncate text-xs text-white/70">{sc.title}</span>
                      <div className="flex flex-shrink-0 gap-0.5">
                        {(Object.keys(OUTCOME_CONFIG) as (keyof typeof OUTCOME_CONFIG)[]).map(
                          (key) => {
                            const cnt = sc.outcomes[key];
                            if (!cnt) return null;
                            return (
                              <span
                                key={key}
                                className="text-micro rounded px-1 tabular-nums"
                                style={{
                                  color: OUTCOME_CONFIG[key].color,
                                  background: OUTCOME_CONFIG[key].bgColor,
                                }}
                                title={OUTCOME_CONFIG[key].label}
                              >
                                {cnt}
                              </span>
                            );
                          }
                        )}
                      </div>
                      <span
                        className="w-9 flex-shrink-0 text-right text-xs font-black tabular-nums"
                        style={{
                          color:
                            sc.winRate >= 60 ? '#00D88A' : sc.winRate >= 40 ? '#FFCC1F' : '#FF2E4D',
                        }}
                      >
                        {sc.winRate}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
