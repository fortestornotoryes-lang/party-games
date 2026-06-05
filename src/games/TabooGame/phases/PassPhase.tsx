import React from 'react';
import {Ban} from 'lucide-react';
import {TabooPassPhase} from '@/components/TabooPassPhase';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface PassPhaseProps {
    playerNames: string[];
    scores: Record<string, number>;
    currentExplainer: string;
    onStart: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = (props) => {
    const {t} = useTranslation();
    return (
        <TabooPassPhase
            {...props}
            accentColor="red"
            icon={Ban}
            instruction={t(`${NS.TABOO}.passInstruction`)}
        />
    );
};
