import { ListChecks } from 'lucide-react';
import React from 'react';

import { TabooPassPhase } from '@/components/TabooPassPhase';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface PassPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  currentExplainer: string;
  teams?: [string[], string[]];
  onStart: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = (props) => {
  const { t } = useTranslation();

  return (
    <TabooPassPhase
      {...props}
      accentColor="orange"
      icon={ListChecks}
      instruction={t(`${NS.TABOO_REVERSE}.passInstruction`)}
    />
  );
};
