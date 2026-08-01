import React from 'react';
import { Text, View } from 'react-native';

import type { BunkerResources } from '../types';

import { RESOURCE_META } from '@/games/BunkerGame/constants';

interface Props {
  contrib: BunkerResources;
  className?: string;
}

export const ResourceContribRow: React.FC<Props> = ({
  contrib,
  className = 'mt-2 flex-row flex-wrap gap-3',
}) => {
  const nonZero = RESOURCE_META.filter(({ key }) => contrib[key] !== 0);
  if (nonZero.length === 0) return null;
  return (
    <View className={className}>
      {nonZero.map(({ key, emoji }) => {
        const val = contrib[key];
        return (
          <Text
            key={key}
            className="text-xs font-black"
            style={{ color: val > 0 ? '#00D88A' : '#FF2E4D', fontVariant: ['tabular-nums'] }}
          >
            {emoji}
            {val > 0 ? '+' : ''}
            {val}
          </Text>
        );
      })}
    </View>
  );
};
