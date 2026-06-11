import {Shapes} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React from 'react';

import {GameOverPhase} from './components/GameOverPhase';
import {PlayingPhase} from './components/PlayingPhase';
import {useMemoRiskGameLogic} from './hooks/useMemoRiskGameLogic';
import {MemoRiskPhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface Props {
    playerNames: string[];
    onBack: () => void;
}

export const MemoRiskGame: React.FC<Props> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
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
        <div className="flex flex-col relative" style={{minHeight: '100dvh'}}>
            <GameHeader
                title={t(`${NS.MEMO_RISK}.title`)}
                subtitle={t(`${NS.MEMO_RISK}.subtitle`)}
                icon={Shapes}
                theme="pink"
                onBack={onBack}
            />

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
                <AnimatePresence mode="wait">
                    {phase === MemoRiskPhase.Playing && !!round && (
                        <motion.div
                            key="playing"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
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
                        </motion.div>
                    )}

                    {phase === MemoRiskPhase.GameOver && (
                        <motion.div
                            key="game_over"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                        >
                            <GameOverPhase
                                playerNames={playerNames}
                                scores={scores}
                                onRestart={handleRestart}
                                onBack={onBack}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
