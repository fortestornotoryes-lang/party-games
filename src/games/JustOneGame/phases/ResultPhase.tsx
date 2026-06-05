import React from 'react';
import {motion} from 'motion/react';
import {CheckCircle, RotateCcw, XCircle} from 'lucide-react';
import {PrimaryButton, Typography} from '@/components/UI';

interface ResultPhaseProps {
    isCorrect: boolean;
    word: string;
    guess: string;
    onNext: () => void;
}

export const ResultPhase: React.FC<ResultPhaseProps> = ({isCorrect, word, guess, onNext}) => (
    <motion.div
        key="result"
        initial={{opacity: 0, scale: 0.88}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.88}}
        transition={{type: 'spring', stiffness: 280, damping: 22}}
        className="min-h-full flex flex-col p-6 items-center justify-center text-center gap-8"
    >
        <div className="space-y-4">
            {isCorrect ? (
                <>
                    <div className="relative">
                        <div className="absolute -inset-12 blur-[50px] rounded-full bg-premium-green/15"/>
                        <CheckCircle className="w-20 h-20 text-premium-green mx-auto relative"/>
                    </div>
                    <Typography.Display size="lg" color="green" glow align="center">
                        ПРАВИЛЬНО!
                    </Typography.Display>
                </>
            ) : (
                <>
                    <div className="relative">
                        <div className="absolute -inset-12 blur-[50px] rounded-full bg-premium-red/15"/>
                        <XCircle className="w-20 h-20 text-premium-red mx-auto relative"/>
                    </div>
                    <Typography.Display size="lg" color="red" glow align="center">
                        ОШИБКА
                    </Typography.Display>
                </>
            )}

            <div className="space-y-1 text-center">
                <Typography.Caption className="tracking-[0.5em]">Загаданное слово</Typography.Caption>
                <Typography.Display size="md" align="center">
                    {word}
                </Typography.Display>
                {!isCorrect && (
                    <Typography.Body color="faint" align="center" className="mt-1">
                        Ответ: <span className="italic">{guess}</span>
                    </Typography.Body>
                )}
            </div>
        </div>

        <PrimaryButton onClick={onNext} icon={RotateCcw}>
            СЛЕДУЮЩИЙ РАУНД
        </PrimaryButton>
    </motion.div>
);
