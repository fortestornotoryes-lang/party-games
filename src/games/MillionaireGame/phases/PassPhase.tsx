import {Trophy} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import {PassPhoneCard} from '@/components/PassPhoneCard';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';

interface PassPhaseProps {
    currentPlayer: string;
    onPassDone: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({currentPlayer, onPassDone}) => {
    const {t} = useTranslation();
    return (
        <motion.div
            key="pass"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.22}}
            className="h-full flex flex-col p-5 gap-4"
        >
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-xs">
                    <PassPhoneCard
                        playerName={currentPlayer}
                        badge={t(`${NS.MILLIONAIRE}.subtitle`)}
                        badgeColor="yellow"
                        accentColor="yellow"
                        icon={Trophy}
                        instruction={t(`${NS.MILLIONAIRE}.tapToStart`)}
                        onClick={onPassDone}
                    />
                </div>
            </div>
        </motion.div>
    );
};
