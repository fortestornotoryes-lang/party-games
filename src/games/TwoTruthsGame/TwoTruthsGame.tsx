import { Ghost } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import { STATEMENTS_COUNT, STATEMENT_MAX_LENGTH } from './constants';
import { addScores, isStatementsReady, scoreTwoTruthsRound } from './helpers';
import { TwoTruthsPhase } from './types';

import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TextInput } from '@/shared/components/TextInput';
import { Typography } from '@/shared/components/Typography';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { usePlayerCycle } from '@/shared/hooks/usePlayerCycle';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';

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

  const fooledCount = voters.filter((v) => guesses[v] !== lieIndex).length;
  const isLastRound = roundsPlayed + 1 >= playerNames.length;
  const sortedPlayers = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));

  return (
    <div className="flex h-dvh flex-col">
      <GameHeader
        title={t('registry.games.two_truths.title')}
        subtitle={t(`${NS.TWO_TRUTHS}.subtitle`)}
        icon={Ghost}
        theme="teal"
        onBack={onBack}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === TwoTruthsPhase.Pass && (
            <motion.div
              key={`pass-${roundsPlayed}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-full flex-col items-center justify-center gap-6 p-6"
            >
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
          )}

          {phase === TwoTruthsPhase.Writing && (
            <motion.div
              key="writing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-full flex-col gap-4 p-6"
            >
              <Typography.Caption className="text-center tracking-[0.4em]">
                {t('common.roundN', { n: roundsPlayed + 1 })} · {storyteller}
              </Typography.Caption>
              <Typography.Body align="center" color="faint">
                {t(`${NS.TWO_TRUTHS}.writeTitle`)}
              </Typography.Body>

              {statements.map((s, i) => (
                <div key={i} className="glass-card rounded-premium-xl flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-micro font-black tracking-[0.3em] text-white/40 uppercase">
                      {t(`${NS.TWO_TRUTHS}.statementN`, { n: i + 1 })}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLieIndex(i);
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-black tracking-widest uppercase transition ${
                        lieIndex === i ? 'bg-premium-red text-white' : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {lieIndex === i
                        ? t(`${NS.TWO_TRUTHS}.markedLie`)
                        : t(`${NS.TWO_TRUTHS}.markAsLie`)}
                    </button>
                  </div>
                  <TextInput
                    value={s}
                    maxLength={STATEMENT_MAX_LENGTH}
                    placeholder={t(`${NS.TWO_TRUTHS}.statementPlaceholder`)}
                    onChange={(e) => {
                      updateStatement(i, e.target.value);
                    }}
                  />
                </div>
              ))}

              <PrimaryButton
                onClick={showAll}
                disabled={!isStatementsReady(statements, lieIndex)}
                className="mt-2"
              >
                {t(`${NS.TWO_TRUTHS}.showAll`)}
              </PrimaryButton>
            </motion.div>
          )}

          {phase === TwoTruthsPhase.Voting && (
            <motion.div
              key={`voting-${voterIdx}-${voterReady}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex min-h-full flex-col gap-4 p-6"
            >
              {!voterReady ? (
                <div className="flex min-h-full items-center justify-center">
                  <PassPhoneCard
                    playerName={voter}
                    playerLabel={t(`${NS.TWO_TRUTHS}.voterLabel`)}
                    instruction={t(`${NS.TWO_TRUTHS}.voterPass`, { name: voter })}
                    icon={Ghost}
                    onClick={() => {
                      setVoterReady(true);
                    }}
                  />
                </div>
              ) : (
                <>
                  <Typography.Body align="center" color="faint">
                    {t(`${NS.TWO_TRUTHS}.voteQuestion`)}
                  </Typography.Body>
                  {statements.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        submitGuess(i);
                      }}
                      className="glass-card rounded-premium-xl p-4 text-left text-base leading-relaxed break-words transition active:scale-[0.98]"
                    >
                      <span className="text-micro mr-2 font-black text-white/40">{i + 1}.</span>
                      {s}
                    </button>
                  ))}
                </>
              )}
            </motion.div>
          )}

          {phase === TwoTruthsPhase.Reveal && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-full flex-col gap-4 p-6"
            >
              <Typography.Display size="md" align="center">
                {t(`${NS.TWO_TRUTHS}.revealTitle`)}
              </Typography.Display>

              {statements.map((s, i) => (
                <div
                  key={i}
                  className={`glass-card rounded-premium-xl p-4 ${
                    i === lieIndex ? 'border-premium-red border-2' : ''
                  }`}
                >
                  <span
                    className={`text-micro font-black tracking-[0.3em] uppercase ${
                      i === lieIndex ? 'text-premium-red' : 'text-premium-green'
                    }`}
                  >
                    {i === lieIndex
                      ? t(`${NS.TWO_TRUTHS}.lieLabel`)
                      : t(`${NS.TWO_TRUTHS}.truthLabel`)}
                  </span>
                  <p className="mt-1 break-words">{s}</p>
                </div>
              ))}

              <div className="glass-card rounded-premium-xl space-y-2 p-4">
                {voters.map((v) => (
                  <div key={v} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 break-words">{v}</span>
                    <span
                      className={`shrink-0 font-bold ${
                        guesses[v] === lieIndex ? 'text-premium-green' : 'text-premium-red'
                      }`}
                    >
                      {guesses[v] === lieIndex
                        ? t(`${NS.TWO_TRUTHS}.guessedRight`)
                        : t(`${NS.TWO_TRUTHS}.guessedWrong`)}
                    </span>
                  </div>
                ))}
                <p className="pt-2 text-center text-sm text-white/50">
                  {t(`${NS.TWO_TRUTHS}.fooledCount`, { name: storyteller, n: fooledCount })}
                </p>
              </div>

              <PrimaryButton onClick={finishRound} className="mt-2">
                {isLastRound ? t(`${NS.TWO_TRUTHS}.finishGame`) : t(`${NS.TWO_TRUTHS}.nextRound`)}
              </PrimaryButton>
            </motion.div>
          )}

          {phase === TwoTruthsPhase.Finish && (
            <motion.div
              key="finish"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-full flex-col items-center justify-center gap-6 p-6 text-center"
            >
              <Typography.Display size="md" align="center">
                {t('common.gameOver')}
              </Typography.Display>
              <div className="glass-card rounded-premium-xl w-full max-w-sm space-y-2 p-4">
                <p className="text-micro font-black tracking-[0.3em] text-white/40 uppercase">
                  {t(`${NS.TWO_TRUTHS}.scoreboard`)}
                </p>
                {sortedPlayers.map((p) => (
                  <div key={p} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 break-words">{p}</span>
                    <span className="shrink-0 font-black">{scores[p] ?? 0}</span>
                  </div>
                ))}
              </div>
              <PrimaryButton onClick={onBack}>{t(`${NS.TWO_TRUTHS}.toMenu`)}</PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
