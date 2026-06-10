import {RouterProvider} from 'react-router';

import {GameSettingsProvider} from './contexts/GameSettingsContext';
import {LanguageProvider} from './i18n';
import {router} from './router/routes';

export default function App() {
    return (
        <GameSettingsProvider>
            <LanguageProvider>
                <RouterProvider router={router}/>
            </LanguageProvider>
        </GameSettingsProvider>
    );
}
