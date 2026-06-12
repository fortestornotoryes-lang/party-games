import {RouterProvider} from 'react-router';

import {GameSettingsProvider} from './contexts/GameSettingsContext';
import {router} from './router/routes';

import {LanguageProvider} from '@/shared/i18n';

export default function App() {
    return (
        <GameSettingsProvider>
            <LanguageProvider>
                <RouterProvider router={router}/>
            </LanguageProvider>
        </GameSettingsProvider>
    );
}
