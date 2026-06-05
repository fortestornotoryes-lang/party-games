import {ListChecks} from 'lucide-react';
import React from 'react';

import {TabooPassPhase} from '@/components/TabooPassPhase';

interface PassPhaseProps {
    playerNames: string[];
    scores: Record<string, number>;
    currentExplainer: string;
    teams?: [string[], string[]];
    onStart: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = (props) => (
    <TabooPassPhase
        {...props}
        accentColor="orange"
        icon={ListChecks}
        instruction="Только ты должен видеть загаданное слово"
    />
);
