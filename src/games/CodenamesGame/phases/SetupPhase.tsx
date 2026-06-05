import React from 'react';
import {motion} from 'motion/react';
import {Users} from 'lucide-react';
import {PrimaryButton, Typography} from '@/components/UI';
import {useTranslation} from '@/i18n';

interface SetupPhaseProps {
    redCaptain: string;
    blueCaptain: string;
    redTeam: string[];
    blueTeam: string[];
    onPlay: () => void;
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({
                                                          redCaptain,
                                                          blueCaptain,
                                                          redTeam,
                                                          blueTeam,
                                                          onPlay,
                                                      }) => {
    const {t} = useTranslation();

    return (
        <motion.div
            key="setup"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            className="space-y-6 flex-1 flex flex-col justify-center"
        >
            <Typography.Title
                className="text-2xl font-black text-center mb-6 uppercase tracking-widest"
                color="green"
            >
                {t('common.teams')}
            </Typography.Title>

            <div className="flex flex-col justify-center gap-4">
                <div className="p-4 bg-premium-red/10 text-center border border-premium-red/30 rounded-premium-md">
                    <Typography.Heading className="font-bold mb-2 uppercase text-xs flex items-center gap-2">
                        <Users className="w-5 h-5 text-premium-red"/> {t('codenames.redTeam')}
                    </Typography.Heading>
                    <p className="font-bold border-b border-premium-red/20 pb-2 mb-2">
            <span className="text-xs text-premium-red/50 uppercase block">
              {t('codenames.captain')}
            </span>
                        {redCaptain}
                    </p>
                    <p className="text-sm text-premium-red/70 opacity-80">{redTeam.join(', ')}</p>
                </div>

                <div
                    className="text-center font-black text-5xl tracking-wider uppercase drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-linear-to-b from-amber-300 via-orange-500 to-red-600 animate-pulse">
                    {t('common.vs')}
                </div>

                <div className="p-4 bg-premium-blue/10 text-center border border-premium-blue/30 rounded-premium-md">
                    <Typography.Heading className="font-bold mb-2 uppercase text-xs flex items-center gap-2">
                        <Users className="w-5 h-5 text-premium-blue"/> {t('codenames.blueTeam')}
                    </Typography.Heading>
                    <p className="font-bold border-b border-premium-blue/20 pb-2 mb-2">
            <span className="text-xs text-premium-blue/50 uppercase block">
              {t('codenames.captain')}
            </span>
                        {blueCaptain}
                    </p>
                    <p className="text-sm text-premium-blue/70 opacity-80">{blueTeam.join(', ')}</p>
                </div>
            </div>

            <PrimaryButton onClick={onPlay} variant="emerald" className="mt-8">
                {t('codenames.play')}
            </PrimaryButton>
        </motion.div>
    );
};
