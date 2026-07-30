import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameSettingsProvider } from '@/entities/game/model/GameSettingsContext';
import { LanguageProvider } from '@/shared/i18n';

// Корневой тёмный фон — как --color-bg веб-версии (src/app/styles/index.css)
export const APP_BG = '#0b0915';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <GameSettingsProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: APP_BG },
              }}
            />
          </GameSettingsProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
