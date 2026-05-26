import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { Siren } from 'lucide-react';
import { GameHeader } from '@/components/GameHeader';
import { GAMES_REGISTRY } from '@/registry/GameRegistry';
import { GameKey } from '@/types/games';
import { pickRandom, shuffle } from '@/utils/random';
import { useGameSettings } from '@/contexts/GameSettingsContext';
import {
  CATASTROPHE_SCENARIOS,
  SURVIVAL_EVENTS,
  generateCharacter,
  calculateSurvival,
} from '@/constants/bunkerContent';
import { BunkerPhase, getRevealedTrait } from './types';
import type { BunkerCharacter, CatastropheScenario, SurvivalEvent, BunkerResources, SurvivalOutcome } from './types';
import { BriefingPhase }        from './phases/BriefingPhase';
import { DictatorRevealPhase }  from './phases/DictatorRevealPhase';
import { RevealPhase }          from './phases/RevealPhase';
import { DiscussionPhase }      from './phases/DiscussionPhase';
import { VotingPhase }          from './phases/VotingPhase';
import { TribunalPhase }        from './phases/TribunalPhase';
import { SurvivalPhase }        from './phases/SurvivalPhase';
import { ResultsPhase }         from './phases/ResultsPhase';

interface BunkerGameProps {
  playerNames: string[];
  onBack: () => void;
}

const TOTAL_REVEAL_ROUNDS = 5;

export const BunkerGame: React.FC<BunkerGameProps> = ({ playerNames, onBack }) => {
  const { mode, difficulty } = useGameSettings();
  const isDictator = mode === 'dictator';
  const isTribunal = mode === 'tribunal';

  // ── Initial setup (stable for the lifetime of this game instance) ──────────
  const CAPACITY_PCT: Record<string, number> = { easy: 0.8, medium: 0.6, hard: 0.4 };

  const bunkerCapacity = useMemo(
    () => Math.max(2, Math.round(playerNames.length * (CAPACITY_PCT[difficulty] ?? 0.6))),
    [playerNames.length, difficulty],
  );

  const [scenario]   = useState<CatastropheScenario>(() => pickRandom(CATASTROPHE_SCENARIOS));
  const [characters] = useState<BunkerCharacter[]>(() =>
    shuffle(playerNames).map(name => generateCharacter(name)),
  );
  const [events]     = useState<SurvivalEvent[]>(() => {
    const pool = shuffle([...SURVIVAL_EVENTS]);
    return [pool[0], pool[1]]; // pick 2 events
  });

  // ── Mode-specific state ────────────────────────────────────────────────────
  const [directorName] = useState<string | null>(() =>
    isDictator ? pickRandom(characters).playerName : null,
  );

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
      case BunkerPhase.Briefing:        return 'Катастрофа';
      case BunkerPhase.DictatorReveal:  return 'Директор бункера';
      case BunkerPhase.RevealPass:
      case BunkerPhase.RevealShow:      return `Раунд ${revealRound} из ${TOTAL_REVEAL_ROUNDS}`;
      case BunkerPhase.Discussion:      return `Обсуждение · Раунд ${revealRound}`;
      case BunkerPhase.Voting:          return 'Голосование';
      case BunkerPhase.Tribunal:        return 'Трибунал';
      case BunkerPhase.SurvivalSim:     return 'Симуляция';
      case BunkerPhase.Results:         return 'Итоги';
      default:                          return '';
    }
  })();

  // ── Phase transitions ──────────────────────────────────────────────────────

  const handleBriefingStart = () => {
    setRevealRound(1);
    setRevealPlayerIdx(0);
    setPhase(isDictator ? BunkerPhase.DictatorReveal : BunkerPhase.RevealPass);
  };

  const handleDictatorRevealDone = () => {
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
    setPhase(isTribunal ? BunkerPhase.Tribunal : BunkerPhase.SurvivalSim);
  };

  // Tribunal done
  const handleTribunalDone = (finalEliminated: string[]) => {
    setEliminatedNames(finalEliminated);
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

          {phase === BunkerPhase.DictatorReveal && directorName && (
            <DictatorRevealPhase
              key="dictator-reveal"
              directorName={directorName}
              onContinue={handleDictatorRevealDone}
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
              directorName={directorName}
              onConfirm={handleVotingConfirm}
            />
          )}

          {phase === BunkerPhase.Tribunal && (
            <TribunalPhase
              key="tribunal"
              characters={characters}
              eliminatedNames={eliminatedNames}
              bunkerTeam={bunkerTeam}
              onDone={handleTribunalDone}
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
