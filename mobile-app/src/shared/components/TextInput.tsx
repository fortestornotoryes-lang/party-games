import React from 'react';
import { Platform, TextInput as RNTextInput } from 'react-native';
import type { TextInputProps as RNTextInputProps } from 'react-native';

interface TextInputProps extends RNTextInputProps {
  className?: string;
}

/**
 * Стеклянный инпут (аналог .glass-input веба; градиент заменён полупрозрачным фоном).
 * RN-API: onChangeText вместо onChange(e) — колл-сайты адаптируются при переносе.
 */
export const TextInput: React.FC<TextInputProps> = ({ className, ...props }) => (
  <RNTextInput
    placeholderTextColor="rgba(255,255,255,0.2)"
    {...props}
    // Android EditText добавляет собственный внутренний padding поверх px-4 — обнуляем,
    // иначе текст обрезается по горизонтали внутри фиксированной высоты h-9
    style={[Platform.OS === 'android' ? { padding: 0, textAlignVertical: 'center' } : null, props.style]}
    className={`rounded-premium-sm h-9 w-full border border-white/10 bg-white/5 px-4 text-base font-semibold text-white ${className ?? ''}`}
  />
);
