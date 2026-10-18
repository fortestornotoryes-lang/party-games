import { Siren } from 'lucide-react-native';
import { AnimatePresence } from 'moti';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BUNKER_MODES, CAPACITY_PCT } from './constants';
import { BriefingPhase } from './phases/BriefingPhase';
import { DictatorRevealPhase } from './phases/DictatorRevealPhase';
import { DiscussionPhase } from './phases/DiscussionPhase';
import { FullRevealPhase } from './phases/FullRevealPhase';
import { RevealPhase } from './phases/RevealPhase';
import { SurvivalPhase } from './phases/SurvivalPhase';
import { TribunalPhase } from './phases/TribunalPhase';
import { VotingPhase } from './phases/VotingPhase';
import type {
  BunkerCharacter,
  BunkerResources,
  CatastropheScenario,
  SurvivalEvent,
  SurvivalOutcome,
} from './types';
import { BunkerPhase } from './types';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { CATASTROPHE_SCENARIOS, SURVIVAL_EVENTS } from '@/games/BunkerGame/contents';
import { calculateSurvival, generateCharacter } from '@/games/BunkerGame/helpers';
import { GameHeader } from '@/shared/components/GameHeader';
import { pickRandom, shuffle } from '@/shared/helpers/random';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface BunkerGameProps {
  playerNames: string[];
  onBack: () => void;
  onRestart?: () => void;
}

export const BunkerGame: React.FC<BunkerGameProps> = ({ playerNames, onBack, onRestart }) => {
  const { t } = useTranslation();
  const { mode, difficulty, rounds, countHiddenTraits } = useGameConfig();
  const insets = useSafeAreaInsets();
  const totalRounds = Math.max(3, Math.min(7, rounds));
  const isDictator = mode === BUNKER_MODES.DICTATOR;
  const isTribunal = mode === BUNKER_MODES.TRIBUNAL;

  // ── Начальная раздача (стабильна на всю партию) ────────────────────────────

  const bunkerCapacity = useMemo(
    () => Math.max(2, Math.round(playerNames.length * (CAPACITY_PCT[difficulty] ?? 0.6))),
    [playerNames.length, difficulty]
  );

  const K = GameKey.Bunker;
  const [scenario] = usePersistedState<CatastropheScenario>(K, 'scenario', () =>
    pickRandom(CATASTROPHE_SCENARIOS)
  );
  const [characters] = usePersistedState<BunkerCharacter[]>(K, 'characters', () =>
    shuffle(playerNames).map((name) => generateCharacter(name))
  );
  const [events] = usePersistedState<SurvivalEvent[]>(K, 'events', () => {
    const pool = shuffle([...SURVIVAL_EVENTS]);
    const count = Math.floor(Math.random() * 5) + 1;
    return pool.slice(0, count);
  });

  // ── Состояние режимов ──────────────────────────────────────────────────────
  const [directorName] = usePersistedState<string | null>(K, 'directorName', () =>
    isDictator ? pickRandom(characters).playerName : null
  );

  // ── Фаза ───────────────────────────────────────────────────────────────────
  const [phase, setPhase] = usePersistedState<BunkerPhase>(K, 'phase', BunkerPhase.Briefing);
  const [revealRound, setRevealRound] = usePersistedState(K, 'revealRound', 1);
  const [eliminatedNames, setEliminatedNames] = usePersistedState<string[]>(
    K,
    'eliminatedNames',
    []
  );

  // ── Производные ────────────────────────────────────────────────────────────
  const bunkerTeam = characters.filter((c) => !eliminatedNames.includes(c.playerName));
  const eliminated = characters.filter((c) => eliminatedNames.includes(c.playerName));

  const { resources, outcome } = useMemo<{
    resources: BunkerResources;
    outcome: SurvivalOutcome;
  }>(() => {
    if (eliminatedNames.length === 0) {
      return {
        resources: { food: 100, water: 100, medicine: 100, energy: 100, morale: 100 },
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

  // ── Подзаголовок для GameHeader ────────────────────────────────────────────
  const subtitle = (() => {
    switch (phase) {
      case BunkerPhase.Briefing:
        return t(`${NS.BUNKER}.subtitleCatastrophe`);
      case BunkerPhase.DictatorReveal:
        return t(`${NS.BUNKER}.subtitleDirector`);
      case BunkerPhase.RevealPass:
        return t(`${NS.BUNKER}.roundOf`, { current: revealRound, total: totalRounds });
      case BunkerPhase.Discussion:
        return t(`${NS.BUNKER}.subtitleDiscussion`, { n: revealRound });
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

  // ── Переходы фаз ───────────────────────────────────────────────────────────

  const handleBriefingStart = () => {
    setRevealRound(1);
    setPhase(isDictator ? BunkerPhase.DictatorReveal : BunkerPhase.RevealPass);
  };

  const handleDictatorRevealDone = () => {
    setPhase(BunkerPhase.RevealPass);
  };

  // Кнопка «дальше» в обсуждении
  const handleDiscussionNext = () => {
    const isLastRound = revealRound >= totalRounds;
    if (isLastRound) {
      setPhase(BunkerPhase.Voting);
    } else {
      setRevealRound((prev) => prev + 1);
      setPhase(BunkerPhase.RevealPass);
    }
  };

  // Голосование подтверждено
  const handleVotingConfirm = (names: string[]) => {
    setEliminatedNames(names);
    setPhase(isTribunal ? BunkerPhase.Tribunal : BunkerPhase.FullReveal);
  };

  // Трибунал завершён
  const handleTribunalDone = (finalEliminated: string[]) => {
    setEliminatedNames(finalEliminated);
    setPhase(BunkerPhase.FullReveal);
  };

  const handleFullRevealDone = () => {
    setPhase(BunkerPhase.SurvivalSim);
  };

  const handleRestart = () => {
    (onRestart ?? onBack)();
  };

  // ── Рендер ─────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t('registry.games.bunker.title')}
        subtitle={subtitle}
        icon={Siren}
        theme="orange"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
      >
        <AnimatePresence exitBeforeEnter>
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
              onDone={() => {
                setPhase(BunkerPhase.Discussion);
              }}
            />
          )}

          {phase === BunkerPhase.Discussion && (
            <DiscussionPhase
              key={`discussion-${revealRound}`}
              characters={characters}
              revealRound={revealRound}
              totalRounds={totalRounds}
              difficulty={difficulty}
              onNext={handleDiscussionNext}
            />
          )}

          {phase === BunkerPhase.Voting && (
            <VotingPhase
              key="voting"
              characters={characters}
              bunkerCapacity={bunkerCapacity}
              totalRounds={totalRounds}
              difficulty={difficulty}
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
      </ScrollView>
    </View>
  );
};
