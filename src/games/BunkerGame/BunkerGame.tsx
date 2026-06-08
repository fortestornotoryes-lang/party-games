import {Siren} from 'lucide-react';
import {AnimatePresence} from 'motion/react';
import React, {useMemo, useState} from 'react';

import {BriefingPhase} from './phases/BriefingPhase';
import {DictatorRevealPhase} from './phases/DictatorRevealPhase';
import {DiscussionPhase} from './phases/DiscussionPhase';
import {RevealPhase} from './phases/RevealPhase';
import {FullRevealPhase} from './phases/FullRevealPhase';
import {SurvivalPhase} from './phases/SurvivalPhase';
import {TribunalPhase} from './phases/TribunalPhase';
import {VotingPhase} from './phases/VotingPhase';
import type {BunkerCharacter, BunkerResources, CatastropheScenario, SurvivalEvent, SurvivalOutcome,} from './types';
import {BunkerPhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {
  BUNKER_MODES,
  calculateSurvival,
  CATASTROPHE_SCENARIOS,
  generateCharacter,
  SURVIVAL_EVENTS
} from '@/constants/bunkerContent';
import {useGameSettings} from '@/contexts/GameSettingsContext';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {GAMES_REGISTRY} from '@/registry/GameRegistry';
import {GameKey} from '@/types/games';
import {pickRandom, shuffle} from '@/utils/random';

interface BunkerGameProps {
    playerNames: string[];
    onBack: () => void;
    onRestart?: () => void;
}

const CAPACITY_PCT: Record<string, number> = {easy: 0.8, medium: 0.6, hard: 0.4};

export const BunkerGame: React.FC<BunkerGameProps> = ({playerNames, onBack, onRestart}) => {
    const {t} = useTranslation();
    const {mode, difficulty, rounds, countHiddenTraits} = useGameSettings();
    const totalRounds = Math.max(3, Math.min(7, rounds));
    const isDictator = mode === BUNKER_MODES.DICTATOR;
    const isTribunal = mode === BUNKER_MODES.TRIBUNAL;

    // ── Initial setup (stable for the lifetime of this game instance) ──────────

    const bunkerCapacity = useMemo(
        () => Math.max(2, Math.round(playerNames.length * (CAPACITY_PCT[difficulty] ?? 0.6))),
        [playerNames.length, difficulty]
    );

    const [scenario] = useState<CatastropheScenario>(() => pickRandom(CATASTROPHE_SCENARIOS));
    const [characters] = useState<BunkerCharacter[]>(() =>
        shuffle(playerNames).map((name) => generateCharacter(name))
    );
    const [events] = useState<SurvivalEvent[]>(() => {
        const pool = shuffle([...SURVIVAL_EVENTS]);
        const count = Math.floor(Math.random() * 5) + 1;
        return pool.slice(0, count);
    });

    // ── Mode-specific state ────────────────────────────────────────────────────
    const [directorName] = useState<string | null>(() =>
        isDictator ? pickRandom(characters).playerName : null
    );

    // ── Phase state ────────────────────────────────────────────────────────────
    const [phase, setPhase] = useState<BunkerPhase>(BunkerPhase.Briefing);
    const [revealRound, setRevealRound] = useState(1);
    const [eliminatedNames, setEliminatedNames] = useState<string[]>([]);

    // ── Derived ────────────────────────────────────────────────────────────────
    const bunkerTeam = characters.filter((c) => !eliminatedNames.includes(c.playerName));
    const eliminated = characters.filter((c) => eliminatedNames.includes(c.playerName));

    const {resources, outcome} = useMemo<{
        resources: BunkerResources;
        outcome: SurvivalOutcome;
    }>(() => {
        if (eliminatedNames.length === 0) {
            return {
                resources: {food: 100, water: 100, medicine: 100, energy: 100, morale: 100},
                outcome: 'full_victory',
            };
        }
        const team = characters.filter((c) => !eliminatedNames.includes(c.playerName));
        return calculateSurvival(team, scenario, events, {
            revealedTraitsOnly: !countHiddenTraits,
            totalRounds,
            difficulty,
        });
    }, [eliminatedNames, characters, scenario, events, countHiddenTraits, totalRounds, difficulty]);

    // ── Subtitle for GameHeader ────────────────────────────────────────────────
    const subtitle = (() => {
        switch (phase) {
            case BunkerPhase.Briefing:
                return t(`${NS.BUNKER}.subtitleCatastrophe`);
            case BunkerPhase.DictatorReveal:
                return t(`${NS.BUNKER}.subtitleDirector`);
            case BunkerPhase.RevealPass:
                return t(`${NS.BUNKER}.roundOf`, {current: revealRound, total: totalRounds});
            case BunkerPhase.Discussion:
                return t(`${NS.BUNKER}.subtitleDiscussion`, {n: revealRound});
            case BunkerPhase.Voting:
                return t(`${NS.BUNKER}.subtitleVoting`);
            case BunkerPhase.Tribunal:
                return t(`${NS.BUNKER}.subtitleTribunal`);
            case BunkerPhase.FullReveal:
                return t(`${NS.BUNKER}.subtitleFullReveal`);
            case BunkerPhase.SurvivalSim:
                return t(`${NS.BUNKER}.subtitleSurvival`);
            default:
                return '';
        }
    })();

    // ── Phase transitions ──────────────────────────────────────────────────────

    const handleBriefingStart = () => {
        setRevealRound(1);
        setPhase(isDictator ? BunkerPhase.DictatorReveal : BunkerPhase.RevealPass);
    };

    const handleDictatorRevealDone = () => {
        setPhase(BunkerPhase.RevealPass);
    };

    // Discussion "next" button
    const handleDiscussionNext = () => {
        const isLastRound = revealRound >= totalRounds;
        if (isLastRound) {
            setPhase(BunkerPhase.Voting);
        } else {
            setRevealRound((prev) => prev + 1);
            setPhase(BunkerPhase.RevealPass);
        }
    };

    // Voting confirmed
    const handleVotingConfirm = (names: string[]) => {
        setEliminatedNames(names);
        setPhase(isTribunal ? BunkerPhase.Tribunal : BunkerPhase.FullReveal);
    };

    // Tribunal done
    const handleTribunalDone = (finalEliminated: string[]) => {
        setEliminatedNames(finalEliminated);
        setPhase(BunkerPhase.FullReveal);
    };

    const handleFullRevealDone = () => setPhase(BunkerPhase.SurvivalSim);

    const handleRestart = () => {
        (onRestart ?? onBack)();
    };

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

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
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

                    {phase === BunkerPhase.DictatorReveal && !!directorName && (
                        <DictatorRevealPhase
                            key="dictator-reveal"
                            directorName={directorName}
                            onContinue={handleDictatorRevealDone}
                        />
                    )}

                    {phase === BunkerPhase.RevealPass && (
                        <RevealPhase
                            key={`reveal-${revealRound}`}
                            characters={characters}
                            revealRound={revealRound}
                            totalRounds={totalRounds}
                            onDone={() => setPhase(BunkerPhase.Discussion)}
                        />
                    )}

                    {phase === BunkerPhase.Discussion && (
                        <DiscussionPhase
                            key={`discussion-${revealRound}`}
                            characters={characters}
                            revealRound={revealRound}
                            totalRounds={totalRounds}
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

                    {phase === BunkerPhase.FullReveal && (
                        <FullRevealPhase
                            key="full-reveal"
                            characters={characters}
                            eliminatedNames={eliminatedNames}
                            totalRounds={totalRounds}
                            onContinue={handleFullRevealDone}
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
                            onRestart={handleRestart}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
