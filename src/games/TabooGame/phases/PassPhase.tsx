import React from 'react';
import { Ban } from 'lucide-react';
import { TabooPassPhase } from '../../../components/TabooPassPhase';

interface PassPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  currentExplainer: string;
  onStart: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = (props) => (
  <TabooPassPhase
    {...props}
    accentColor="red"
    icon={Ban}
    instruction="Только ты должен видеть карточку с запрещёнными словами"
  />
);
