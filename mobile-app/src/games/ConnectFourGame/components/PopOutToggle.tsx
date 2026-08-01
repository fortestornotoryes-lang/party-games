import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Pressable, Text } from 'react-native';

import { C4Action, type C4Player } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  show: boolean;
  action: C4Action;
  current: C4Player;
  onChange: (a: C4Action) => void;
}

export const PopOutToggle: React.FC<Props> = ({ show, action, current, onChange }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!!show && (
        <MotiView
          key="pop-toggle"
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -8 }}
          className="flex-row gap-2"
        >
          <Pressable
            onPress={() => {
              onChange(C4Action.Place);
            }}
            className={`rounded-premium-md flex-1 flex-row items-center justify-center gap-1.5 border py-3 ${
              action === C4Action.Place
                ? current === 1
                  ? 'bg-premium-red/15 border-premium-red/50'
                  : 'bg-premium-yellow/15 border-premium-yellow/50'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <ArrowDown
              size={14}
              color={
                action === C4Action.Place
                  ? current === 1
                    ? '#FF2E4D'
                    : '#FFCC1F'
                  : 'rgba(255,255,255,0.3)'
              }
            />
            <Text
              className={`text-label font-black uppercase ${
                action === C4Action.Place
                  ? current === 1
                    ? 'text-premium-red'
                    : 'text-premium-yellow'
                  : 'text-white/30'
              }`}
              style={{ letterSpacing: 1 }}
            >
              {t(`${NS.CONNECT_FOUR}.place`)}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onChange(C4Action.Pop);
            }}
            className={`rounded-premium-md flex-1 flex-row items-center justify-center gap-1.5 border py-3 ${
              action === C4Action.Pop ? 'border-white/35 bg-white/10' : 'border-white/10 bg-white/5'
            }`}
          >
            <ArrowUp size={14} color={action === C4Action.Pop ? '#fff' : 'rgba(255,255,255,0.3)'} />
            <Text
              className={`text-label font-black uppercase ${
                action === C4Action.Pop ? 'text-white' : 'text-white/30'
              }`}
              style={{ letterSpacing: 1 }}
            >
              {t(`${NS.CONNECT_FOUR}.popOut`)}
            </Text>
          </Pressable>
        </MotiView>
      )}
    </AnimatePresence>
  );
};
