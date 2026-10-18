import { Grid, User } from 'lucide-react-native';
import { AnimatePresence } from 'moti';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getCodenamesWords } from './model/codenamesContent';
import { CaptainPhase } from './phases/CaptainPhase';
import { GameOverPhase } from './phases/GameOverPhase';
import { SetupPhase } from './phases/SetupPhase';
import { TeamPhase } from './phases/TeamPhase';
import type { Card, CardColor, Team } from './types';
import { CodenamesPhase, EMPTY_CLUE, EMPTY_ROSTER } from './types';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { CODENAMES_MODES } from '@/games/CodenamesGame/constants';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { shuffle } from '@/shared/helpers/random';
import { splitInHalf } from '@/shared/helpers/teams';
import { useGameInit } from '@/shared/hooks/useGameInit';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface CodenamesGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const CodenamesGame: React.FC<CodenamesGameProps> = ({ playerNames, onBack }) => {
  const { difficulty, mode: activeMode } = useGameConfig();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const K = GameKey.Codenames;
  const [phase, setPhase] = usePersistedState<CodenamesPhase>(K, 'phase', CodenamesPhase.Setup);
  const [cards, setCards] = usePersistedState<Card[]>(K, 'cards', []);
  const [turn, setTurn] = usePersistedState<Team>(K, 'turn', 'red');

  // Состав команд — назначается один раз при старте партии, все поля всегда вместе.
  const [roster, setRoster] = usePersistedState(K, 'roster', EMPTY_ROSTER);
  const { redCaptain, blueCaptain, redTeam, blueTeam } = roster;

  // Активная подсказка капитана — одним объектом, чтобы сброс в конце хода (endTurn)
  // не мог случайно забыть одно из полей.
  const [clue, setClue] = usePersistedState(K, 'clue', EMPTY_CLUE);
  const { clueWord, clueCount } = clue;
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

  useGameInit(
    playerNames.length < 4 || cards.length > 0,
    () => {
      const shuffled = shuffle(playerNames);
      const [red, blue] = splitInHalf(shuffled.slice(2));
      setRoster({ redCaptain: shuffled[0], blueCaptain: shuffled[1], redTeam: red, blueTeam: blue });
      initBoard();
    },
    [playerNames]
  );

  const currentCaptain = turn === 'red' ? redCaptain : blueCaptain;

  const handleSubmitClue = () => {
    if (!clueWord || clueCount < 0) return;
    setGuessesLeft(clueCount + 1);
    setPhase(CodenamesPhase.PassTeam);
  };

  const endTurn = () => {
    setTurn((prev) => (prev === 'red' ? 'blue' : 'red'));
    setClue(EMPTY_CLUE);
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
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-center text-white">{t(`${NS.CODENAMES}.minPlayers`)}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t('registry.games.codenames.title')}
        subtitle={t(`${NS.CODENAMES}.subtitle`)}
        icon={Grid}
        theme="green"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 80 }}
      >
        <View className="mx-auto w-full max-w-lg flex-1 p-4 pt-10">
          <AnimatePresence exitBeforeEnter>
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
                onClueWordChange={(clueWord) => {
                  setClue((c) => ({ ...c, clueWord }));
                }}
                onClueCountChange={(clueCount) => {
                  setClue((c) => ({ ...c, clueCount }));
                }}
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
        </View>
      </ScrollView>
    </View>
  );
};
