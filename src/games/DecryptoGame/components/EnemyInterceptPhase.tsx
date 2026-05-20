import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '../../../components/UI';
import { TeamColor, RoundData } from '../types';
import { tText, tLabel } from '../helpers';
import { CodeInput } from './CodeInput';

interface EnemyInterceptPhaseProps {
    enemyHistory: RoundData[];
    clues: string[];
    interceptGuess: (number | '')[];
    wordCount: number;
    enemyColor: TeamColor;
    onChange: (v: (number | '')[]) => void;
    onSubmit: () => void;
}

export const EnemyInterceptPhase: React.FC<EnemyInterceptPhaseProps> = ({ enemyHistory, clues, interceptGuess, wordCount, enemyColor, onChange, onSubmit }) => (
    <motion.div key="enemy_intercept"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="space-y-4 flex flex-col h-full overflow-auto"
    >
        <p className={`text-[10px] tracking-widest uppercase font-black text-center ${tText(enemyColor)}`}>
            ВРЕМЯ ПЕРЕХВАТА · КОМАНДА {tLabel(enemyColor).toUpperCase()}
        </p>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <p className="text-xs text-white/30 font-bold uppercase mb-2">Текущие подсказки врага</p>
            <ul className="space-y-1">
                {clues.map((c, i) => (
                    <li key={i} className="text-white font-bold">{i + 1}. {c}</li>
                ))}
            </ul>
        </div>

        {enemyHistory.length > 0 && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-xs text-white/30 font-bold uppercase mb-2">История раундов врага</p>
                <div className="space-y-2">
                    {enemyHistory.map((h, i) => (
                        <div key={i} className="text-xs">
                            <span className="text-premium-purple font-bold">Код {h.code.join('-')}</span>: {h.clues.join(', ')}
                        </div>
                    ))}
                </div>
            </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="mt-2 space-y-4 flex-1">
            <p className="text-[10px] font-bold text-center text-white/40 uppercase">Введите перехваченный код</p>
            <CodeInput value={interceptGuess} onChange={onChange} max={wordCount} team={enemyColor} />
            <PrimaryButton type="submit" variant={enemyColor} className="w-full">
                ПОДТВЕРДИТЬ ПЕРЕХВАТ
            </PrimaryButton>
        </form>
    </motion.div>
);
