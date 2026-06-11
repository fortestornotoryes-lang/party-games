import {motion} from 'motion/react';
import React from 'react';

import {PrimaryButton} from "@/components/PrimaryButton.tsx";
import {Typography} from '@/components/Typography';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface PassPhaseProps {
    psychic: string;
    onReady: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({psychic, onReady}) => {
    const {t} = useTranslation();

    return (
        <motion.div
            key="pass"
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.9}}
            className="h-full flex flex-col items-center justify-center space-y-10 text-center"
        >
            <div className="space-y-4 text-center">
                <Typography.Label size="sm" color="body">
                    {t(`${NS.WAVELENGTH}.newRound`)}
                </Typography.Label>
                <Typography.Heading size="sm" color="muted">
                    {t(`${NS.WAVELENGTH}.psychicLabel`)}:
                </Typography.Heading>
                <Typography.Display size="lg" color="purple">
                    {psychic}
                </Typography.Display>
            </div>
            <div
                className="p-8 bg-premium-purple/5 border-2 border-premium-purple/10 rounded-premium-3xl max-w-xs transition-all">
                <Typography.Body color="muted">
                    {t(`${NS.WAVELENGTH}.psychicInstruction`, {psychic})}
                </Typography.Body>
            </div>
            <PrimaryButton onClick={onReady} variant="purple">
                {t(`${NS.WAVELENGTH}.iAmReady`)}
            </PrimaryButton>
        </motion.div>
    );
};
