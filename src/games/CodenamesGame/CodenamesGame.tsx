import { Grid, User } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { getCodenamesWords } from './model/codenamesContent';
import { CaptainPhase } from './phases/CaptainPhase';
import { GameOverPhase } from './phases/GameOverPhase';
import { SetupPhase } from './phases/SetupPhase';
import { TeamPhase } from './phases/TeamPhase';
import type { Card, CardColor, Team } from './types';
import { CodenamesPhase } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import { GameKey } from '@/entities/game/types';
import { CODENAMES_MODES } from '@/games/CodenamesGame/constants.ts';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard.tsx';
import { shuffle } from '@/shared/helpers/random';
import { splitInHalf } from '@/shared/helpers/teams';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface CodenamesGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const CodenamesGame: React.FC<CodenamesGameProps> = ({ playerNames, onBack }) => {
  const { difficulty, mode: activeMode } = useGameSettings();
  const { t } = useTranslation();

  const K = GameKey.Codenames;
  const [phase, setPhase] = usePersistedState<CodenamesPhase>(K, 'phase', CodenamesPhase.Setup);
  const [cards, setCards] = usePersistedState<Card[]>(K, 'cards', []);
  const [turn, setTurn] = usePersistedState<Team>(K, 'turn', 'red');

  const [redCaptain, setRedCaptain] = usePersistedState(K, 'redCaptain', '');
  const [blueCaptain, setBlueCaptain] = usePersistedState(K, 'blueCaptain', '');
  const [redTeam, setRedTeam] = usePersistedState<string[]>(K, 'redTeam', []);
  const [blueTeam, setBlueTeam] = usePersistedState<string[]>(K, 'blueTeam', []);

  const [clueWord, setClueWord] = usePersistedState(K, 'clueWord', '');
  const [clueCount, setClueCount] = usePersistedState(K, 'clueCount', 0);
  const [guessesLeft, setGuessesLeft] = usePersistedState(K, 'guessesLeft', 0);
  const [winner, setWinner] = usePersistedState<Team | null>(K, 'winner', null);
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  const initBoard = () => {
    const shuffledWords = getCodenamesWords(difficulty);
    let colorAssignment: CardColor[];

    if (activeMode === CODENAMES_MODES.DEEP_COVER) {
      colorAssignment = [
        ...Array<CardColor>(8).fill('red'),
        ...Array<CardColor>(8).fill('blue'),
        ...Array<CardColor>(7).fill('neutral'),
        ...Array<CardColor>(2).fill('assassin'),
      ];
    } else if (activeMode === CODENAMES_MODES.DOUBLE_AGENT) {
      colorAssignment = [
        ...Array<CardColor>(8).fill('red'),
        ...Array<CardColor>(8).fill('blue'),
        ...Array<CardColor>(7).fill('neutral'),
        'assassin',
        'double_agent',
      ];
    } else {
      colorAssignment = [
        ...Array<CardColor>(9).fill('red'),
        ...Array<CardColor>(8).fill('blue'),
        ...Array<CardColor>(7).fill('neutral'),
        'assassin',
      ];
    }

    colorAssignment = shuffle(colorAssignment);
    setCards(
      shuffledWords.map((word, i) => ({ id: i, word, color: colorAssignment[i], revealed: false }))
    );
    setTurn(activeMode === CODENAMES_MODES.CLASSIC ? 'red' : Math.random() > 0.5 ? 'red' : 'blue');
    setPhase(CodenamesPhase.Setup);
    setWinner(null);
  };

  useEffect(() => {
    if (playerNames.length < 4) return;
    // Доска и команды уже восстановлены из сессии — не пересоздаём.
    if (cards.length > 0) return;
    const shuffled = shuffle(playerNames);
    setRedCaptain(shuffled[0]);
    setBlueCaptain(shuffled[1]);
    const [redTeam, blueTeam] = splitInHalf(shuffled.slice(2));
    setRedTeam(redTeam);
    setBlueTeam(blueTeam);
    initBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerNames]);

  const currentCaptain = turn === 'red' ? redCaptain : blueCaptain;

  const handleSubmitClue = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clueWord || clueCount < 0) return;
    setGuessesLeft(clueCount + 1);
    setPhase(CodenamesPhase.PassTeam);
  };

  const endTurn = () => {
    setTurn((prev) => (prev === 'red' ? 'blue' : 'red'));
    setClueWord('');
    setClueCount(0);
    setPhase(CodenamesPhase.PassCaptain);
  };

  const handleCardClick = (card: Card) => {
    if (card.revealed) return;

    let cardColor = card.color;
    if (cardColor === 'double_agent') cardColor = turn;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, revealed: true, color: cardColor } : c
    );
    setCards(updatedCards);

    if (cardColor === 'assassin') {
      setWinner(turn === 'red' ? 'blue' : 'red');
      setPhase(CodenamesPhase.GameOver);
      return;
    }

    const redLeft = updatedCards.filter((c) => c.color === 'red' && !c.revealed).length;
    const blueLeft = updatedCards.filter((c) => c.color === 'blue' && !c.revealed).length;

    if (redLeft === 0) {
      setWinner('red');
      setPhase(CodenamesPhase.GameOver);
      return;
    }
    if (blueLeft === 0) {
      setWinner('blue');
      setPhase(CodenamesPhase.GameOver);
      return;
    }

    if (cardColor === turn) {
      const left = guessesLeft - 1;
      setGuessesLeft(left);
      if (left <= 0) {
        setLastActionMsg(t(`${NS.CODENAMES}.turnEnded`));
        setTimeout(() => {
          setLastActionMsg(null);
          endTurn();
        }, 1500);
      }
    } else {
      setLastActionMsg(
        cardColor === 'neutral'
          ? t(`${NS.CODENAMES}.neutralRevealed`)
          : t(`${NS.CODENAMES}.enemyAgent`)
      );
      setTimeout(() => {
        setLastActionMsg(null);
        endTurn();
      }, 1500);
    }
  };

  if (playerNames.length < 4) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center text-white">
        {t(`${NS.CODENAMES}.minPlayers`)}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-20 text-white">
      <GameHeader
        title={GAMES_REGISTRY.codenames.title}
        subtitle={t(`${NS.CODENAMES}.subtitle`)}
        icon={Grid}
        theme="green"
        onBack={onBack}
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col p-4 pt-10">
        <AnimatePresence mode="wait">
          {phase === CodenamesPhase.Setup && (
            <SetupPhase
              redCaptain={redCaptain}
              blueCaptain={blueCaptain}
              redTeam={redTeam}
              blueTeam={blueTeam}
              onPlay={() => {
                setPhase(CodenamesPhase.PassCaptain);
              }}
            />
          )}

          {phase === CodenamesPhase.PassCaptain && (
            <PassPhoneCard
              playerName={currentCaptain}
              badgeColor={turn}
              playerLabel={t(`${NS.CODENAMES}.captain`)}
              instruction={t(`${NS.CODENAMES}.othersNoSee`)}
              icon={User}
              accentColor={turn}
              onClick={() => {
                setPhase(CodenamesPhase.Captain);
              }}
            />
          )}

          {phase === CodenamesPhase.Captain && (
            <CaptainPhase
              cards={cards}
              turn={turn}
              currentCaptain={currentCaptain}
              clueWord={clueWord}
              clueCount={clueCount}
              onClueWordChange={setClueWord}
              onClueCountChange={setClueCount}
              onSubmit={handleSubmitClue}
            />
          )}

          {phase === CodenamesPhase.PassTeam && (
            <PassPhoneCard
              playerName={
                turn === 'red' ? t(`${NS.CODENAMES}.teamRed`) : t(`${NS.CODENAMES}.teamBlue`)
              }
              badgeColor={turn}
              playerLabel={t(`${NS.COMMON}.team`)}
              instruction={t(`${NS.CODENAMES}.othersNoSee`)}
              icon={User}
              accentColor={turn}
              onClick={() => {
                setPhase(CodenamesPhase.Team);
              }}
            />
          )}

          {phase === CodenamesPhase.Team && (
            <TeamPhase
              cards={cards}
              turn={turn}
              clueWord={clueWord}
              clueCount={clueCount}
              guessesLeft={guessesLeft}
              lastActionMsg={lastActionMsg}
              onCardClick={handleCardClick}
              onEndTurn={endTurn}
            />
          )}

          {phase === CodenamesPhase.GameOver && !!winner && (
            <GameOverPhase winner={winner} onRematch={initBoard} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
