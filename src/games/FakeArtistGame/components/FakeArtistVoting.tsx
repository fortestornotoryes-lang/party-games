import { Ghost, Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import type { Player } from '@/entities/player/types';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface FakeArtistVotingProps {
  players: Player[];
  canvasImage: string;
  onReveal: () => void;
}

export const FakeArtistVoting: React.FC<FakeArtistVotingProps> = ({
  players,
  canvasImage,
  onReveal,
}) => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const spy = players.find((p) => p.isSpy);

  useEffect(() => {
    if (!fullscreen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        {!!canvasImage && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-premium-lg group relative w-full overflow-hidden border border-white/10 shadow-2xl"
          >
            <img
              src={canvasImage}
              alt="Final"
              className="h-auto max-h-[40vh] w-full bg-white object-contain"
            />
            <button
              onClick={() => {
                setFullscreen(true);
              }}
              className="rounded-premium-sm absolute top-3 right-3 flex h-9 w-9 items-center justify-center bg-black/50 text-white/80 transition-all active:scale-90"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {!!fullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black"
              onClick={() => {
                setFullscreen(false);
              }}
            >
              <img src={canvasImage} alt="Full" className="h-full w-full object-contain" />
              <button
                onClick={() => {
                  setFullscreen(false);
                }}
                className="rounded-premium-md absolute top-5 right-5 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-all active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center text-sm tracking-widest text-white/20 uppercase italic">
                {t(`${NS.FAKE_ARTIST}.voteSimultaneously`)}
              </div>
              <button
                onClick={() => {
                  setRevealed(true);
                }}
                className="rounded-premium-lg w-full bg-white py-6 font-black tracking-widest text-black uppercase shadow-[0_10px_40px_rgba(255,255,255,0.1)] transition-all active:scale-95"
              >
                {t(`${NS.FAKE_ARTIST}.revealImpostor`)}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-8 text-center"
            >
              <div className="bg-premium-red/10 border-premium-red/20 rounded-premium-3xl space-y-4 border p-10">
                <Ghost className="text-premium-red mx-auto h-16 w-16 animate-bounce" />
                <h4 className="text-premium-red text-3xl font-black uppercase italic">
                  {t(`${NS.FAKE_ARTIST}.imposter`)}
                </h4>
                <div className="text-4xl font-black text-white">{spy?.name}</div>
              </div>

              <button
                onClick={onReveal}
                className="rounded-premium-lg w-full border border-white/20 bg-white/10 py-6 font-black tracking-widest text-white uppercase"
              >
                {t(`${NS.FAKE_ARTIST}.mainMenu`)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
