import { Flame } from 'lucide-react-native';
import { AnimatePresence } from 'moti';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTruthOrDareQuestion } from './model/truthOrDareContent';
import { ActionPhase } from './phases/ActionPhase';
import { ChoicePhase } from './phases/ChoicePhase';
import { PassPhase } from './phases/PassPhase';
import type { ChoiceType } from './types';
import { TruthOrDarePhase } from './types';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
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
  const { difficulty } = useGameConfig();
  const insets = useSafeAreaInsets();
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
    const text = getTruthOrDareQuestion(type, difficulty);
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
    <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <GameHeader
        title={t('registry.games.truth_or_dare.title')}
        subtitle={t(`${NS.TRUTH_OR_DARE}.subtitle`)}
        icon={Flame}
        theme="red"
        onBack={onBack}
      />

      <View className="flex-1 overflow-hidden">
        <AnimatePresence exitBeforeEnter>
          {phase === TruthOrDarePhase.Pass && (
            <PassPhase
              key="pass"
              currentPlayer={currentPlayer}
              onPassDone={() => {
                setPhase(TruthOrDarePhase.Choice);
              }}
            />
          )}

          {phase === TruthOrDarePhase.Choice && (
            <ChoicePhase key="choice" currentPlayer={currentPlayer} onChoice={handleChoice} />
          )}

          {phase === TruthOrDarePhase.Action && !!choice && (
            <ActionPhase
              key="action"
              currentPlayer={currentPlayer}
              choice={choice}
              content={content}
              onDone={handleDone}
            />
          )}
        </AnimatePresence>
      </View>
    </View>
  );
};
