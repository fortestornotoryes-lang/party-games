import { Shapes } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameOverPhase } from './components/GameOverPhase';
import { PlayingPhase } from './components/PlayingPhase';
import { useMemoRiskGameLogic } from './hooks/useMemoRiskGameLogic';
import { MemoRiskPhase } from './types';

import { GameHeader } from '@/shared/components/GameHeader';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  playerNames: string[];
  onBack: () => void;
}

export const MemoRiskGame: React.FC<Props> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    phase,
    cards,
    gridSize,
    round,
    currentPlayer,
    scores,
    turnPoints,
    gainedPoints,
    superActive,
    outcome,
    flipsLeft,
    timer,
    escalation,
    flipCard,
    handleBank,
    handleRestart,
    stopGame,
  } = useMemoRiskGameLogic(playerNames, onBack);

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t(`${NS.MEMO_RISK}.title`)}
        subtitle={t(`${NS.MEMO_RISK}.subtitle`)}
        icon={Shapes}
        theme="pink"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {phase === MemoRiskPhase.Playing && !!round && (
            <MotiView
              key="playing"
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
            >
              <PlayingPhase
                board={cards.board}
                gridSize={gridSize}
                round={round}
                currentPlayer={currentPlayer}
                totalScore={scores[currentPlayer] ?? 0}
                turnPoints={turnPoints}
                gainedPoints={gainedPoints}
                superActive={superActive}
                outcome={outcome}
                flipsLeft={flipsLeft}
                deckCount={cards.deck.length}
                timer={timer}
                escalation={escalation}
                onFlip={flipCard}
                onBank={handleBank}
                onStopGame={stopGame}
              />
            </MotiView>
          )}

          {phase === MemoRiskPhase.GameOver && (
            <MotiView
              key="game_over"
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
            >
              <GameOverPhase
                playerNames={playerNames}
                scores={scores}
                onRestart={handleRestart}
                onBack={onBack}
              />
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>
    </View>
  );
};
