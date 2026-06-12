import {RouterProvider} from 'react-router';

import {router} from './router/routes';

import {GameSettingsProvider} from '@/entities/game/model/GameSettingsContext';
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
