import {
  BUNKER_BASE_RESOURCES,
  BUNKER_DIFFICULTY_OFFSET,
  BUNKER_DIFFICULTY_SCALE,
} from '@/games/BunkerGame/constants.ts';
import { SURVIVAL_EVENTS, CATASTROPHE_SCENARIOS } from '@/games/BunkerGame/contents';
import {
  applyBonus,
  applyBonusScaled,
  generateCharacter,
  getAgeBonuses,
} from '@/games/BunkerGame/helpers.ts';
import type {
  BunkerResources,
  DifficultyLevel,
  ResourceKey,
  SurvivalOutcome,
} from '@/games/BunkerGame/types';
import { pickRandom, shuffle } from '@/shared/helpers/random';
import { DIFFICULTY } from '@/shared/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = DifficultyLevel;

export interface ScenarioStat {
  title: string;
  emoji: string;
  runs: number;
  winRate: number; // % of full_victory + partial
  avgScore: number; // weighted 0-3
  outcomes: Record<SurvivalOutcome, number>;
  avgResources: BunkerResources;
}

export interface DifficultyStat {
  difficulty: Difficulty;
  label: string;
  runs: number;
  winRate: number;
  outcomes: Record<SurvivalOutcome, number>;
  avgResources: BunkerResources;
}

export interface FactorInfluence {
  scenario: number; // % of total absolute resource movement
  team: number;
  events: number;
  // Net direction (positive = helped survival, negative = hurt)
  scenarioNet: number;
  teamNet: number;
  eventsNet: number;
}

export interface SimReport {
  totalRuns: number;
  durationMs: number;
  outcomes: Record<SurvivalOutcome, number>;
  outcomesPct: Record<SurvivalOutcome, number>;
  avgResources: BunkerResources;
  factorInfluence: FactorInfluence;
  scenarioStats: ScenarioStat[]; // sorted best → worst
  difficultyStats: DifficultyStat[];
  avgEventCount: number;
  avgPlayerCount: number;
  avgBunkerSize: number;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const RESOURCE_KEYS: ResourceKey[] = ['food', 'water', 'medicine', 'energy', 'morale'];
const CAPACITY_PCT: Record<Difficulty, number> = { easy: 0.8, medium: 0.6, hard: 0.4 };
const DIFFICULTIES: Difficulty[] = Object.values(DIFFICULTY);

function cloneRes(r: BunkerResources): BunkerResources {
  return { ...r };
}

function sumAbsDelta(before: BunkerResources, after: BunkerResources): number {
  return RESOURCE_KEYS.reduce((s, k) => s + Math.abs(after[k] - before[k]), 0);
}

function sumNetDelta(before: BunkerResources, after: BunkerResources): number {
  return RESOURCE_KEYS.reduce((s, k) => s + (after[k] - before[k]), 0);
}

function avgRes(list: BunkerResources[]): BunkerResources {
  const out: BunkerResources = { food: 0, water: 0, medicine: 0, energy: 0, morale: 0 };
  if (!list.length) return out;
  for (const r of list)
    RESOURCE_KEYS.forEach((k) => {
      out[k] += r[k];
    });
  RESOURCE_KEYS.forEach((k) => {
    out[k] = Math.round(out[k] / list.length);
  });
  return out;
}

function emptyOutcomes(): Record<SurvivalOutcome, number> {
  return { full_victory: 0, partial: 0, pyrrhic: 0, defeat: 0 };
}

function computeOutcome(res: BunkerResources): SurvivalOutcome {
  const values = RESOURCE_KEYS.map((k) => res[k]);
  if (values.filter((v) => v <= 0).length >= 1) return 'defeat';
  if (values.filter((v) => v < 25).length >= 2) return 'pyrrhic';
  if (values.filter((v) => v >= 40).length >= 5) return 'full_victory';
  return 'partial';
}

// ─── Main simulation ──────────────────────────────────────────────────────────

interface RunData {
  difficulty: Difficulty;
  scenarioTitle: string;
  scenarioEmoji: string;
  eventCount: number;
  playerCount: number;
  bunkerSize: number;
  outcome: SurvivalOutcome;
  finalResources: BunkerResources;
  scenarioDelta: number;
  scenarioNet: number;
  teamDelta: number;
  teamNet: number;
  eventDelta: number;
  eventNet: number;
}

export function runBunkerSimulation(runs: number, countHiddenTraits = true): SimReport {
  const t0 = performance.now();
  const data: RunData[] = [];

  for (let i = 0; i < runs; i++) {
    const playerCount = 4 + Math.floor(Math.random() * 5); // 4–8
    const difficulty = DIFFICULTIES[Math.floor(Math.random() * 3)];
    const bunkerSize = Math.max(2, Math.round(playerCount * CAPACITY_PCT[difficulty]));
    const totalRounds = 3 + Math.floor(Math.random() * 3) * 2; // 3, 5, or 7

    const allChars = Array.from({ length: playerCount }, (_, j) => generateCharacter(`P${j + 1}`));
    const bunkerTeam = shuffle(allChars).slice(0, bunkerSize);

    const scenario = pickRandom(CATASTROPHE_SCENARIOS);
    const eventCount = Math.floor(Math.random() * 10) + 1;
    const events = shuffle([...SURVIVAL_EVENTS]).slice(0, eventCount);

    // Replicate calculateSurvival step-by-step to capture per-phase deltas
    const res = cloneRes(BUNKER_BASE_RESOURCES);

    // Phase 1 — catastrophe (with difficulty offset + scaled penalty)
    const snap0 = cloneRes(res);
    const diffOffset = BUNKER_DIFFICULTY_OFFSET[difficulty];
    if (diffOffset !== 0)
      RESOURCE_KEYS.forEach((k) => {
        res[k] += diffOffset;
      });
    const scenarioScale = BUNKER_DIFFICULTY_SCALE[difficulty];
    (Object.entries(scenario.resourcePenalty) as [ResourceKey, number][]).forEach(([k, v]) => {
      res[k] += Math.round(v * scenarioScale);
    });
    const scenarioDelta = sumAbsDelta(snap0, res);
    const scenarioNet = sumNetDelta(snap0, res);

    // Phase 2 — team
    const snap1 = cloneRes(res);
    const teamScale = Math.max(0.4, 1 - (bunkerTeam.length - 2) * 0.08);
    for (const char of bunkerTeam) {
      let attrs: { bonus: Partial<BunkerResources> }[];
      if (!countHiddenTraits) {
        const revealed = new Set<string>([
          'profession',
          ...char.revealOrder.slice(0, totalRounds - 1),
        ]);
        attrs = (
          [
            ['profession', char.profession],
            ['health', char.health],
            ['hobby', char.hobby],
            ['phobia', char.phobia],
            ['trait', char.trait],
            ['item', char.item],
            ['specialFact', char.specialFact],
          ] as [string, { bonus: Partial<BunkerResources> }][]
        )
          .filter(([k]) => revealed.has(k))
          .map(([, a]) => a);
      } else {
        attrs = [
          char.profession,
          char.health,
          char.hobby,
          char.trait,
          char.item,
          char.specialFact,
          char.phobia,
        ];
      }
      for (const attr of attrs) {
        applyBonusScaled(res, attr.bonus, teamScale);
      }
      applyBonusScaled(res, getAgeBonuses(char.age), teamScale);
    }
    const teamDelta = sumAbsDelta(snap1, res);
    const teamNet = sumNetDelta(snap1, res);

    // Phase 3 — events
    const snap2 = cloneRes(res);
    for (const event of events) {
      applyBonus(res, event.effect);
    }
    const eventDelta = sumAbsDelta(snap2, res);
    const eventNet = sumNetDelta(snap2, res);

    // Clamp & determine outcome
    RESOURCE_KEYS.forEach((k) => {
      res[k] = Math.max(0, Math.min(100, Math.round(res[k])));
    });

    data.push({
      difficulty,
      scenarioTitle: scenario.title,
      scenarioEmoji: scenario.emoji,
      eventCount,
      playerCount,
      bunkerSize,
      outcome: computeOutcome(res),
      finalResources: res,
      scenarioDelta,
      scenarioNet,
      teamDelta,
      teamNet,
      eventDelta,
      eventNet,
    });
  }

  // ── Aggregate ──────────────────────────────────────────────────────────────

  const outcomes = emptyOutcomes();
  for (const r of data) outcomes[r.outcome]++;
  const outcomesPct = Object.fromEntries(
    (Object.keys(outcomes) as SurvivalOutcome[]).map((k) => [
      k,
      Math.round((outcomes[k] / runs) * 100),
    ])
  ) as Record<SurvivalOutcome, number>;

  // Factor influence
  const totScenario = data.reduce((s, r) => s + r.scenarioDelta, 0);
  const totTeam = data.reduce((s, r) => s + r.teamDelta, 0);
  const totEvents = data.reduce((s, r) => s + r.eventDelta, 0);
  const totAll = totScenario + totTeam + totEvents || 1;
  const factorInfluence: FactorInfluence = {
    scenario: Math.round((totScenario / totAll) * 100),
    team: Math.round((totTeam / totAll) * 100),
    events: Math.round((totEvents / totAll) * 100),
    scenarioNet: Math.round(data.reduce((s, r) => s + r.scenarioNet, 0) / runs),
    teamNet: Math.round(data.reduce((s, r) => s + r.teamNet, 0) / runs),
    eventsNet: Math.round(data.reduce((s, r) => s + r.eventNet, 0) / runs),
  };

  // Per-scenario
  const scMap = new Map<string, RunData[]>();
  for (const r of data) {
    const list = scMap.get(r.scenarioTitle) ?? [];
    list.push(r);
    scMap.set(r.scenarioTitle, list);
  }
  const scenarioStats: ScenarioStat[] = Array.from(scMap.entries())
    .map(([title, list]) => {
      const oc = emptyOutcomes();
      for (const r of list) oc[r.outcome]++;
      const winRate = Math.round(((oc.full_victory + oc.partial) / list.length) * 100);
      const avgScore =
        Math.round(((oc.full_victory * 3 + oc.partial * 2 + oc.pyrrhic * 1) / list.length) * 10) /
        10;
      return {
        title,
        emoji: list[0].scenarioEmoji,
        runs: list.length,
        winRate,
        avgScore,
        outcomes: oc,
        avgResources: avgRes(list.map((r) => r.finalResources)),
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  // Per-difficulty
  const difficultyStats: DifficultyStat[] = DIFFICULTIES.map((diff) => {
    const list = data.filter((r) => r.difficulty === diff);
    const oc = emptyOutcomes();
    for (const r of list) oc[r.outcome]++;
    const winRate = list.length
      ? Math.round(((oc.full_victory + oc.partial) / list.length) * 100)
      : 0;
    return {
      difficulty: diff,
      label: { easy: 'Легко', medium: 'Средне', hard: 'Сложно' }[diff],
      runs: list.length,
      winRate,
      outcomes: oc,
      avgResources: avgRes(list.map((r) => r.finalResources)),
    };
  });

  return {
    totalRuns: runs,
    durationMs: Math.round(performance.now() - t0),
    outcomes,
    outcomesPct,
    avgResources: avgRes(data.map((r) => r.finalResources)),
    factorInfluence,
    scenarioStats,
    difficultyStats,
    avgEventCount: Math.round((data.reduce((s, r) => s + r.eventCount, 0) / runs) * 10) / 10,
    avgPlayerCount: Math.round((data.reduce((s, r) => s + r.playerCount, 0) / runs) * 10) / 10,
    avgBunkerSize: Math.round((data.reduce((s, r) => s + r.bunkerSize, 0) / runs) * 10) / 10,
  };
}
