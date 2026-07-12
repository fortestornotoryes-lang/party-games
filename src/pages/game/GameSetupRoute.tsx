import { useNavigate, useParams } from 'react-router';

import { getGameInstructions } from '@/entities/game/instructions';
import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { GameKey } from '@/entities/game/types';
import { useLocalizedGame } from '@/entities/game/useLocalizedGame';
import { UniversalGameSettings } from '@/features/game-settings/components/UniversalGameSettings';
import { useLanguage } from '@/shared/i18n';
import { sessionService } from '@/shared/services/sessionService';
import { storageService } from '@/shared/services/storageService';
import { Setup } from '@/widget/setup/components/Setup';

/** Экран настройки игры: имена игроков + UniversalGameSettings. */
export function GameSetupRoute() {
  const { gameKey } = useParams();
  const navigate = useNavigate();
  const {
    difficulty,
    mode,
    rounds,
    timerSeconds,
    countHiddenTraits,
    setDifficulty,
    setMode,
    setRounds,
    setTimerSeconds,
    setCountHiddenTraits,
    currentGameId,
  } = useGameSettings();

  const currentGameKey = gameKey as GameKey;
  const { t, lang } = useLanguage();
  const config = useLocalizedGame(currentGameKey);

  // GameLayout синхронизирует currentGameId с URL; до этого не рендерим,
  // чтобы не показать настройки предыдущей игры (раньше тут был if (!currentGameId)).
  if (currentGameId !== currentGameKey || !config) return null;

  const startGame = (playerNames: string[]) => {
    // Новая партия всегда начинается с чистого листа — сохранённая
    // сессия (восстановление после перезагрузки) сбрасывается.
    sessionService.begin(currentGameKey, playerNames);
    void storageService.savePlayersAsync(playerNames);
    void navigate(`/game/${currentGameKey}/play`, { state: { playerNames } });
  };

  return (
    <Setup
      onStart={startGame}
      onBack={() => void navigate('/')}
      title={config.title}
      subtitle={config.subtitle}
      icon={config.icon}
      themeColor={config.theme}
      playerPlaceholder={config.placeholder}
      addPlayerLabel={t('common.add')}
      instructions={
        getGameInstructions(currentGameKey, lang) as {
          title: string;
          content: string;
        }[]
      }
      description={config.description}
      minPlayers={config.minPlayers}
      maxPlayers={config.maxPlayers}
    >
      <UniversalGameSettings
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        currentGameId={currentGameKey}
        mode={config.modes ? mode : undefined}
        setMode={config.modes ? setMode : undefined}
        modes={config.modes}
        settingValues={{ rounds, timerSeconds, countHiddenTraits }}
        onSettingChange={(key, value) => {
          if (key === 'rounds') setRounds(value as number);
          else if (key === 'timerSeconds') setTimerSeconds(value as number);
          else setCountHiddenTraits(value as boolean);
        }}
      />
    </Setup>
  );
}
