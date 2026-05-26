import React from 'react';
import { EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { DistributionFlow } from '@/components/DistributionFlow';
import { Typography } from '@/components/UI';
import { PrimaryButton } from '@/components/UI';
import { feedbackService, VIBRATE } from '@/services/feedbackService';
import { rgba } from '@/theme/colors';
import type { BunkerCharacter } from '../types';

interface DistributionPhaseProps {
  characters: BunkerCharacter[];
  onFinish: () => void;
}

// Labels for attribute keys
const ATTR_LABELS: Record<string, string> = {
  profession:  'Профессия',
  health:      'Здоровье',
  hobby:       'Хобби',
  phobia:      'Фобия',
  trait:       'Характер',
  item:        'Предмет',
  specialFact: 'Особый факт',
};

// Which round reveals each attribute key
function getRevealRound(char: BunkerCharacter, key: string): string {
  if (key === 'profession')       return 'Раунд 1';
  if (key === char.revealRound2)  return 'Раунд 2';
  if (key === char.revealRound3)  return 'Раунд 3';
  return 'Скрыто';
}

function getRevealColor(round: string) {
  if (round === 'Раунд 1') return 'text-premium-orange';
  if (round === 'Раунд 2') return 'text-premium-yellow';
  if (round === 'Раунд 3') return 'text-premium-sky';
  return 'text-white/25';
}

interface CharacterCardProps {
  char: BunkerCharacter;
  isLast: boolean;
  onDone: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ char, isLast, onDone }) => {
  const attrs: { key: string; label: string; entry: { name: string; emoji: string } }[] = [
    { key: 'profession',  label: ATTR_LABELS.profession,  entry: char.profession  },
    { key: 'health',      label: ATTR_LABELS.health,      entry: char.health      },
    { key: 'hobby',       label: ATTR_LABELS.hobby,       entry: char.hobby       },
    { key: 'trait',       label: ATTR_LABELS.trait,       entry: char.trait       },
    { key: 'phobia',      label: ATTR_LABELS.phobia,      entry: char.phobia      },
    { key: 'item',        label: ATTR_LABELS.item,        entry: char.item        },
    { key: 'specialFact', label: ATTR_LABELS.specialFact, entry: char.specialFact },
  ];

  const handleDone = () => {
    feedbackService.vibrate(VIBRATE.tap);
    onDone();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Bio line */}
      <div className="flex items-center justify-center gap-3 py-2">
        <div
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: rgba('orange', 0.12), border: `1px solid ${rgba('orange', 0.3)}`, color: `rgb(${255},${138},${31})` }}
        >
          {char.gender === 'М' ? '♂ Мужчина' : '♀ Женщина'}
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white/60"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {char.age} лет
        </div>
      </div>

      {/* Attribute rows */}
      <div className="space-y-2">
        {attrs.map(({ key, label, entry }) => {
          const round = getRevealRound(char, key);
          const roundColor = getRevealColor(round);
          const isHidden = round === 'Скрыто';

          return (
            <div
              key={key}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: isHidden ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isHidden ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <span className="text-xl w-7 text-center flex-shrink-0">{entry.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-white/35 font-black uppercase tracking-[0.25em] leading-none mb-0.5">{label}</div>
                <div className={`text-sm font-bold leading-tight ${isHidden ? 'text-white/40' : 'text-white'}`}>
                  {entry.name}
                </div>
              </div>
              <div className={`text-[9px] font-black uppercase tracking-wider flex-shrink-0 ${roundColor}`}>
                {round}
              </div>
            </div>
          );
        })}
      </div>

      {/* Call-to-action */}
      <PrimaryButton onClick={handleDone} variant="outline">
        {isLast ? 'НАЧАТЬ ИГРУ →' : 'ЗАПОМНИЛ →'}
      </PrimaryButton>
    </div>
  );
};

export const DistributionPhase: React.FC<DistributionPhaseProps> = ({ characters, onFinish }) => {
  // Build Player[] shape that DistributionFlow expects
  const players = characters.map(c => ({
    id: c.playerName,
    name: c.playerName,
    role: 'Выживший',
    isSpy: false,
  }));

  return (
    <DistributionFlow
      players={players}
      onFinish={onFinish}
      activeColor="bg-premium-orange"
      passAccentColor="orange"
      passIcon={EyeOff}
      passInstruction="Только ты должен видеть свою карточку"
      getCardStyle={() => ({
        className: 'min-h-[30rem]',
        style: {
          border: '1.5px solid rgba(255,138,31,0.3)',
          boxShadow: '0 0 60px rgba(255,138,31,0.15), 0 24px 48px rgba(0,0,0,0.5)',
        },
      })}
      renderCard={(player, isLast, onNext) => {
        const char = characters.find(c => c.playerName === player.name)!;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CharacterCard char={char} isLast={isLast} onDone={onNext} />
          </motion.div>
        );
      }}
    />
  );
};
