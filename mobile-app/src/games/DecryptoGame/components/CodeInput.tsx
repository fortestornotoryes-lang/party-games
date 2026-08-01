import React from 'react';
import { View } from 'react-native';

import type { TeamColor } from '../types';

import { TextInput } from '@/shared/components/TextInput';

interface CodeInputProps {
  value: (number | '')[];
  onChange: (v: (number | '')[]) => void;
  max: number;
  team: TeamColor;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, max }) => (
  <View className="flex-row gap-2">
    {[0, 1, 2].map((i) => (
      <TextInput
        key={i}
        value={value[i] === '' ? '' : String(value[i])}
        onChangeText={(text) => {
          const g = [...value] as (number | '')[];
          const digits = text.replace(/\D/g, '');
          if (digits === '') {
            g[i] = '';
          } else {
            const v = parseInt(digits, 10);
            if (v >= 1 && v <= max) g[i] = v;
          }
          onChange(g);
        }}
        keyboardType="number-pad"
        className="h-16 flex-1 text-center text-2xl"
      />
    ))}
  </View>
);
