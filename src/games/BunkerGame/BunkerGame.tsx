import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { Siren } from 'lucide-react';
import { GameHeader } from '@/components/GameHeader';
import { GAMES_REGISTRY } from '@/registry/GameRegistry';
import { GameKey } from '@/types/games';
import { pickRandom, shuffle } from '@/utils/random';
import {
  CATASTROPHE_SCENARIOS,
  SURVIVAL_EVENTS,
  generateCharacter,
  calculateSurvival,
} from '@/constants/bunkerContent';
import { BunkerPhase, getRevealedTrait } from './types';
import type { BunkerCharacter, CatastropheScenario, SurvivalEvent, BunkerResources, SurvivalOutcome } from './types';
import { BriefingPhase }    from './phases/BriefingPhase';
import { RevealPhase }       from './phases/RevealPhase';
import { DiscussionPhase }   from './phases/DiscussionPhase';
import { VotingPhase }       from './phases/VotingPhase';
import { SurvivalPhase }     from './phases/SurvivalPhase';
import { ResultsPhase }      from './phases/ResultsPhase';

interface BunkerGameProps {
  playerNames: string[];
  onBack: () => void;
}

const TOTAL_REVEAL_ROUNDS = 5;

export const BunkerGame: React.FC<BunkerGameProps> = ({ playerNames, onBack }) => {
  // ── Initial setup (stable for the lifetime of this game instance) ──────────
  const bunkerCapacity = useMemo(
    () => Math.max(2, Math.round(playerNames.length / 2)),
    [playerNames.length],
  );

  const [scenario]   = useState<CatastropheScenario>(() => pickRandom(CATASTROPHE_SCENARIOS));
  const [characters] = useState<BunkerCharacter[]>(() =>
    shuffle(playerNames).map(name => generateCharacter(name)),
  );
  const [events]     = useState<SurvivalEvent[]>(() => {
    const pool = shuffle([...SURVIVAL_EVENTS]);
    return [pool[0], pool[1]]; // pick 2 events
  });

  // ── Phase state ────────────────────────────────────────────────────────────
  const [phase,          setPhase]          = useState<BunkerPhase>(BunkerPhase.Briefing);
  const [revealRound,    setRevealRound]    = useState(1);
  const [revealPlayerIdx, setRevealPlayerIdx] = useState(0);
  const [eliminatedNames, setEliminatedNames] = useState<string[]>([]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const bunkerTeam = characters.filter(c => !eliminatedNames.includes(c.playerName));
  const eliminated = characters.filter(c =>  eliminatedNames.includes(c.playerName));

  const { resources, outcome } = useMemo<{ resources: BunkerResources; outcome: SurvivalOutcome }>(() => {
    if (eliminatedNames.length === 0) {
      return { resources: { food: 100, water: 100, medicine: 100, energy: 100, morale: 100 }, outcome: 'full_victory' };
    }
    return calculateSurvival(bunkerTeam, scenario, events);
  }, [eliminatedNames, bunkerTeam, scenario, events]);

  // ── Subtitle for GameHeader ────────────────────────────────────────────────
  const subtitle = (() => {
    switch (phase) {
      case BunkerPhase.Briefing:     return 'Катастрофа';
      case BunkerPhase.RevealPass:
      case BunkerPhase.RevealShow:   return `Раунд ${revealRound} из ${TOTAL_REVEAL_ROUNDS}`;
      case BunkerPhase.Discussion:   return `Обсуждение · Раунд ${revealRound}`;
      case BunkerPhase.Voting:       return 'Голосование';
      case BunkerPhase.SurvivalSim:  return 'Симуляция';
      case BunkerPhase.Results:      return 'Итоги';
      default:                       return '';
    }
  })();

  // ── Phase transitions ──────────────────────────────────────────────────────

  const handleBriefingStart = () => {
    setRevealRound(1);
    setRevealPlayerIdx(0);
    setPhase(BunkerPhase.RevealPass);
  };

  // A player confirmed they announced their trait
  const handleRevealConfirm = () => {
    const isLastPlayer = revealPlayerIdx >= characters.length - 1;
    if (isLastPlayer) {
      // All players revealed — go to discussion
      setPhase(BunkerPhase.Discussion);
    } else {
      // Next player
      setRevealPlayerIdx(prev => prev + 1);
      // Stay in RevealPass (the key change re-mounts the phase component)
      setPhase(BunkerPhase.RevealPass);
    }
  };

  // Discussion "next" button
  const handleDiscussionNext = () => {
    const isLastRound = revealRound >= TOTAL_REVEAL_ROUNDS;
    if (isLastRound) {
      setPhase(BunkerPhase.Voting);
    } else {
      setRevealRound(prev => prev + 1);
      setRevealPlayerIdx(0);
      setPhase(BunkerPhase.RevealPass);
    }
  };

  // Voting confirmed
  const handleVotingConfirm = (names: string[]) => {
    setEliminatedNames(names);
    setPhase(BunkerPhase.SurvivalSim);
  };

  // Survival → Results
  const handleRevealResults = () => setPhase(BunkerPhase.Results);

  // Restart
  const handleRestart = () => onBack();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen">
      <GameHeader
        title={GAMES_REGISTRY[GameKey.Bunker].title}
        subtitle={subtitle}
        icon={Siren}
        theme="orange"
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait">
          {phase === BunkerPhase.Briefing && (
            <BriefingPhase
              key="briefing"
              scenario={scenario}
              playerCount={playerNames.length}
              bunkerCapacity={bunkerCapacity}
              onStart={handleBriefingStart}
            />
          )}

          {(phase === BunkerPhase.RevealPass || phase === BunkerPhase.RevealShow) && (
            <RevealPhase
              key={`reveal-${revealRound}-${revealPlayerIdx}`}
              characters={characters}
              revealRound={revealRound}
              revealPlayerIdx={revealPlayerIdx}
              onConfirm={handleRevealConfirm}
            />
          )}

          {phase === BunkerPhase.Discussion && (
            <DiscussionPhase
              key={`discussion-${revealRound}`}
              characters={characters}
              revealRound={revealRound}
              totalRounds={TOTAL_REVEAL_ROUNDS}
              onNext={handleDiscussionNext}
            />
          )}

          {phase === BunkerPhase.Voting && (
            <VotingPhase
              key="voting"
              characters={characters}
              bunkerCapacity={bunkerCapacity}
              onConfirm={handleVotingConfirm}
            />
          )}

          {phase === BunkerPhase.SurvivalSim && (
            <SurvivalPhase
              key="survival"
              bunkerTeam={bunkerTeam}
              eliminated={eliminated}
              scenario={scenario}
              events={events}
              finalResources={resources}
              outcome={outcome}
              onReveal={handleRevealResults}
            />
          )}

          {phase === BunkerPhase.Results && (
            <ResultsPhase
              key="results"
              bunkerTeam={bunkerTeam}
              eliminated={eliminated}
              resources={resources}
              outcome={outcome}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
