import { Flame } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React from 'react';

import { useTruthOrDareContent } from './model/useTruthOrDareContent';
import { ActionPhase } from './phases/ActionPhase';
import { ChoicePhase } from './phases/ChoicePhase';
import { PassPhase } from './phases/PassPhase';
import type { ChoiceType } from './types';
import { TruthOrDarePhase } from './types';

import { GameHeader } from '@/components/GameHeader';
import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import { GameKey } from '@/entities/game/types';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { usePlayerCycle } from '@/shared/hooks/usePlayerCycle';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface TruthOrDareGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty } = useGameSettings();
  const [phase, setPhase] = usePersistedState<TruthOrDarePhase>(
    GameKey.TruthOrDare,
    'phase',
    TruthOrDarePhase.Pass
  );
  const playerIdxState = usePersistedState(GameKey.TruthOrDare, 'playerIdx', 0);
  const { current: currentPlayer, next: nextPlayer } = usePlayerCycle(playerNames, playerIdxState);
  const [choice, setChoice] = usePersistedState<ChoiceType | null>(
    GameKey.TruthOrDare,
    'choice',
    null
  );
  const [content, setContent] = usePersistedState(GameKey.TruthOrDare, 'content', '');

  const handleChoice = (type: ChoiceType) => {
    const text = useTruthOrDareContent(type, difficulty);
    setChoice(type);
    setContent(text);
    setPhase(TruthOrDarePhase.Action);
  };

  const handleDone = () => {
    nextPlayer();
    setChoice(null);
    setContent('');
    setPhase(TruthOrDarePhase.Pass);
  };

  return (
    <div className="flex h-screen flex-col">
      <GameHeader
        title={GAMES_REGISTRY.truth_or_dare.title}
        subtitle={t(`${NS.TRUTH_OR_DARE}.subtitle`)}
        icon={Flame}
        theme="red"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === TruthOrDarePhase.Pass && (
            <PassPhase
              currentPlayer={currentPlayer}
              onPassDone={() => {
                setPhase(TruthOrDarePhase.Choice);
              }}
            />
          )}

          {phase === TruthOrDarePhase.Choice && (
            <ChoicePhase currentPlayer={currentPlayer} onChoice={handleChoice} />
          )}

          {phase === TruthOrDarePhase.Action && !!choice && (
            <ActionPhase
              currentPlayer={currentPlayer}
              choice={choice}
              content={content}
              onDone={handleDone}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
