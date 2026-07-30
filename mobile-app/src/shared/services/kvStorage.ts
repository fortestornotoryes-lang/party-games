import { createMMKV } from 'react-native-mmkv';

// Единственный MMKV-инстанс приложения. MMKV синхронный, как localStorage
// в веб-версии — поэтому storageService/sessionService перенесены без
// перевода на async (ключевое решение плана миграции).
const mmkv = createMMKV();

/** localStorage-совместимый адаптер над MMKV: сервисы ядра используют его 1:1. */
export const kvStorage = {
  getItem: (key: string): string | null => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string): void => {
    mmkv.set(key, value);
  },
  removeItem: (key: string): void => {
    mmkv.remove(key);
  },
};
