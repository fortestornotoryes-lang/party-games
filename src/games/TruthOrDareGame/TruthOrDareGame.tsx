import {Flame} from 'lucide-react';
import {AnimatePresence} from 'motion/react';
import React, {useState} from 'react';

import {useTruthOrDareContent} from './model/useTruthOrDareContent';
import {ActionPhase} from './phases/ActionPhase';
import {ChoicePhase} from './phases/ChoicePhase';
import {PassPhase} from './phases/PassPhase';
import type {ChoiceType} from './types';
import {TruthOrDarePhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {useGameSettings} from '@/contexts/GameSettingsContext';
import {usePlayerCycle} from '@/hooks/usePlayerCycle';
import {GAMES_REGISTRY} from '@/registry/GameRegistry';


interface TruthOrDareGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({playerNames, onBack}) => {
    const {difficulty} = useGameSettings();
    const [phase, setPhase] = useState<TruthOrDarePhase>(TruthOrDarePhase.Pass);
    const {current: currentPlayer, next: nextPlayer} = usePlayerCycle(playerNames);
    const [choice, setChoice] = useState<ChoiceType | null>(null);
    const [content, setContent] = useState('');

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
        <div className="flex flex-col h-screen">
            <GameHeader
                title={GAMES_REGISTRY.truth_or_dare.title}
                subtitle="Правда или Действие"
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
                        <ChoicePhase currentPlayer={currentPlayer} onChoice={handleChoice}/>
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
