import { Ghost } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { STATEMENTS_COUNT, STATEMENT_MAX_LENGTH } from './constants';
import { addScores, isStatementsReady, scoreTwoTruthsRound } from './helpers';
import { RevealPhase } from './phases/RevealPhase';
import { VotePhase } from './phases/VotePhase';
import { WritingPhase } from './phases/WritingPhase';
import { TwoTruthsPhase } from './types';

import { GameKey } from '@/entities/game/types';
import { FinalStandings } from '@/entities/player/components/FinalStandings';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { usePlayerCycle } from '@/shared/hooks/usePlayerCycle';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { CARD_DEAL_VARIANTS, PHASE_VARIANTS } from '@/shared/theme/motion';

interface TwoTruthsGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const TwoTruthsGame: React.FC<TwoTruthsGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();

  const storytellerIdxState = usePersistedState(GameKey.TwoTruths, 'storytellerIdx', 0);
  const { current: storyteller, next: nextStoryteller } = usePlayerCycle(
    playerNames,
    storytellerIdxState
  );

  const [phase, setPhase] = usePersistedState<TwoTruthsPhase>(
    GameKey.TwoTruths,
    'phase',
    TwoTruthsPhase.Pass
  );
  const [roundsPlayed, setRoundsPlayed] = usePersistedState(GameKey.TwoTruths, 'roundsPlayed', 0);
  const [statements, setStatements] = usePersistedState<string[]>(
    GameKey.TwoTruths,
    'statements',
    () => Array<string>(STATEMENTS_COUNT).fill('')
  );
  const [lieIndex, setLieIndex] = usePersistedState<number | null>(
    GameKey.TwoTruths,
    'lieIndex',
    null
  );
  const [guesses, setGuesses] = usePersistedState<Record<string, number>>(
    GameKey.TwoTruths,
    'guesses',
    {}
  );
  const [voterIdx, setVoterIdx] = usePersistedState(GameKey.TwoTruths, 'voterIdx', 0);
  const [scores, setScores] = usePersistedState<Record<string, number>>(
    GameKey.TwoTruths,
    'scores',
    {}
  );
  // Экран «передай телефон» перед голосом — не сохраняем, после F5 покажется снова
  const [voterReady, setVoterReady] = useState(false);

  // Голосуют все, кроме рассказчика
  const voters = playerNames.filter((p) => p !== storyteller);
  const voter = voters[voterIdx] ?? '';

  const updateStatement = (index: number, value: string) => {
    setStatements((prev) =>
      prev.map((s, i) => (i === index ? value.slice(0, STATEMENT_MAX_LENGTH) : s))
    );
  };

  const showAll = () => {
    if (!isStatementsReady(statements, lieIndex)) return;
    setVoterIdx(0);
    setVoterReady(false);
    setGuesses({});
    setPhase(TwoTruthsPhase.Voting);
  };

  const submitGuess = (choice: number) => {
    if (lieIndex === null) return;
    const nextGuesses = { ...guesses, [voter]: choice };
    setGuesses(nextGuesses);

    if (voterIdx + 1 < voters.length) {
      setVoterIdx(voterIdx + 1);
      setVoterReady(false);
      return;
    }

    // Все проголосовали — начисляем очки и показываем правду
    setScores((prev) => addScores(prev, scoreTwoTruthsRound(storyteller, nextGuesses, lieIndex)));
    feedbackService.playSound('success');
    setPhase(TwoTruthsPhase.Reveal);
  };

  const finishRound = () => {
    const played = roundsPlayed + 1;
    setRoundsPlayed(played);
    setStatements(Array<string>(STATEMENTS_COUNT).fill(''));
    setLieIndex(null);
    setGuesses({});

    // Каждый рассказал по разу — игра окончена
    if (played >= playerNames.length) {
      setPhase(TwoTruthsPhase.Finish);
      return;
    }
    nextStoryteller();
    setPhase(TwoTruthsPhase.Pass);
  };

  useEffect(() => {
    if (phase !== TwoTruthsPhase.Finish) return;
    feedbackService.playSound('win');
    feedbackService.vibrate(VIBRATE.win);
    feedbackService.celebrate('win', { origin: { y: 0.35 } });
  }, [phase]);

  const isLastRound = roundsPlayed + 1 >= playerNames.length;

  return (
    <div className="flex h-dvh flex-col">
      <GameHeader
        title={t('registry.games.two_truths.title')}
        subtitle={t(`${NS.TWO_TRUTHS}.subtitle`)}
        icon={Ghost}
        theme="teal"
        onBack={onBack}
      />

      {/* layoutScroll: плашка «Ложь» перелетает между карточками внутри прокручиваемой области */}
      <motion.div layoutScroll className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === TwoTruthsPhase.Pass && (
            <motion.div
              key={`pass-${roundsPlayed}`}
              variants={PHASE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-full flex-col items-center justify-center gap-6 p-6 perspective-distant"
            >
              <motion.div variants={CARD_DEAL_VARIANTS} className="w-full">
                <PassPhoneCard
                  playerName={storyteller}
                  playerLabel={t(`${NS.TWO_TRUTHS}.storytellerLabel`)}
                  instruction={t(`${NS.TWO_TRUTHS}.passInstruction`, { name: storyteller })}
                  icon={Ghost}
                  onClick={() => {
                    setPhase(TwoTruthsPhase.Writing);
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          {phase === TwoTruthsPhase.Writing && (
            <motion.div
              key="writing"
              variants={PHASE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-full flex-col gap-4 p-6"
            >
              <WritingPhase
                roundNo={roundsPlayed + 1}
                storyteller={storyteller}
                statements={statements}
                lieIndex={lieIndex}
                ready={isStatementsReady(statements, lieIndex)}
                onChange={updateStatement}
                onMarkLie={setLieIndex}
                onSubmit={showAll}
              />
            </motion.div>
          )}

          {phase === TwoTruthsPhase.Voting && (
            <motion.div
              key={`voting-${voterIdx}-${voterReady}`}
              variants={PHASE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-full flex-col gap-4 p-6 perspective-distant"
            >
              {!voterReady ? (
                <div className="flex min-h-full flex-1 items-center justify-center">
                  <motion.div variants={CARD_DEAL_VARIANTS} className="w-full">
                    <PassPhoneCard
                      playerName={voter}
                      playerLabel={t(`${NS.TWO_TRUTHS}.voterLabel`)}
                      instruction={t(`${NS.TWO_TRUTHS}.voterPass`, { name: voter })}
                      icon={Ghost}
                      onClick={() => {
                        setVoterReady(true);
                      }}
                    />
                  </motion.div>
                </div>
              ) : (
                <VotePhase statements={statements} onPick={submitGuess} />
              )}
            </motion.div>
          )}

          {phase === TwoTruthsPhase.Reveal && lieIndex !== null && (
            <motion.div
              key="reveal"
              variants={PHASE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative flex min-h-full flex-col gap-4 p-6"
            >
              <RevealPhase
                statements={statements}
                lieIndex={lieIndex}
                storyteller={storyteller}
                voters={voters}
                guesses={guesses}
                isLastRound={isLastRound}
                onNext={finishRound}
              />
            </motion.div>
          )}

          {phase === TwoTruthsPhase.Finish && (
            <motion.div
              key="finish"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-full"
            >
              <FinalStandings
                players={playerNames}
                scores={scores}
                color="teal"
                iconClassName="text-premium-teal"
                scoreboardLabel={t(`${NS.TWO_TRUTHS}.scoreboard`)}
                buttonLabel={t(`${NS.TWO_TRUTHS}.toMenu`)}
                onBack={onBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
