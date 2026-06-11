import {Brain} from 'lucide-react';
import React from 'react';

import type {RoundShapes} from '../types';

import {ShapeBadges} from './ShapeBadges';

import {PassPhoneCard} from '@/components/PassPhoneCard';
import {PlayerScoreList} from '@/components/PlayerScoreList';
import {StopGameButton} from '@/components/StopGameButton';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface PassPhaseProps {
    currentPlayer: string;
    playerNames: string[];
    scores: Record<string, number>;
    escalation: number;
    /** Карт в колоде добора */
    deckCount: number;
    /** Общие фигуры раунда — null, если партия уже не может продолжаться */
    round: RoundShapes | null;
    onStartTurn: () => void;
    onStopGame: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({
                                                        currentPlayer,
                                                        playerNames,
                                                        scores,
                                                        escalation,
                                                        deckCount,
                                                        round,
                                                        onStartTurn,
                                                        onStopGame,
                                                    }) => {
    const {t} = useTranslation();

    return (
        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto w-full">
            <PassPhoneCard
                playerName={currentPlayer}
                playerLabel={t(`${NS.COMMON}.yourTurn`)}
                badge={t(`${NS.MEMO_RISK}.riskLevel`, {n: escalation})}
                badgeColor="purple"
                instruction={t(`${NS.MEMO_RISK}.passInstruction`)}
                icon={Brain}
                accentColor="purple"
                onClick={onStartTurn}
            />
            <p className="text-micro font-black uppercase tracking-[0.3em] text-white/25">
                {t(`${NS.MEMO_RISK}.tapToStart`)} · {t(`${NS.MEMO_RISK}.deckLeft`, {n: deckCount})}
            </p>
            {round ? <ShapeBadges round={round}/> : null}
            <PlayerScoreList
                players={playerNames}
                scores={scores}
                activePlayer={currentPlayer}
                activeLabel={t(`${NS.COMMON}.yourTurn`)}
                accentColor="purple"
            />
            <StopGameButton onClick={onStopGame}/>
        </div>
    );
};
