import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, EyeOff, Skull } from 'lucide-react';
import { Player } from '../../../types';

interface Props {
  players: Player[];
  onFinish: () => void;
}

export const ResistanceDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const currentPlayer = players[idx];
  const spies = players.filter(p => p.isSpy).map(p => p.name);

  const next = () => {
    if (idx === players.length - 1) onFinish();
    else { setRevealed(false); setIdx(idx + 1); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-gray-200">
        <div className="w-full max-w-sm text-center space-y-8">
            <h3 className="text-4xl font-black italic">{currentPlayer.name}</h3>
            <div className="w-full aspect-[4/5] bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center" onClick={() => setRevealed(true)}>
                {!revealed ? (<EyeOff className="w-12 h-12 opacity-20" />) : (
                    <div className="p-8 space-y-6">
                        {currentPlayer.isSpy ? (
                            <div className="space-y-4">
                                <Skull className="w-16 h-16 text-premium-red mx-auto" />
                                <h4 className="text-4xl font-black text-premium-red italic">ШПИОН</h4>
                                <p className="text-white/30 text-sm">Ваши союзники: {spies.filter(s => s !== currentPlayer.name).join(', ') || 'нет'}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Shield className="w-16 h-16 text-premium-blue mx-auto" />
                                <h4 className="text-4xl font-black text-premium-blue italic">СОПРОТИВЛЕНИЕ</h4>
                            </div>
                        )}
                        <button onClick={next} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase">Усвоено</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
