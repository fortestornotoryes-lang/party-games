
/**
 * Персистенция состояния текущей партии (сессии) каждой игры.
 *
 * Назначение: если страница перезагрузилась посреди игры, состояние
 * восстанавливается из localStorage и партия продолжается с того же места.
 *
 * Жизненный цикл:
 * - Setup → «Начать игру» очищает сессию (новая партия всегда с нуля).
 * - Игровые компоненты пишут состояние через usePersistedState (см. hooks).
 * - При заходе на /play с другим составом игроков сессия инвалидируется
 *   (syncPlayers в GamePlayRoute).
 */

const SESSION_PREFIX = 'party_app_session_';

interface GameSession {
    /** Состав игроков, с которым была начата партия — для инвалидации. */
    players: string[];
    /** Произвольные сериализованные поля состояния игры. */
    fields: Record<string, unknown>;
}

const keyFor = (gameKey: string) => `${SESSION_PREFIX}${gameKey}`;

function load(gameKey: string): GameSession | null {
    const raw = localStorage.getItem(keyFor(gameKey));
    if (!raw) return null;
    try {
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        const session = parsed as GameSession;
        if (typeof session.fields !== 'object') return null;
        return session;
    } catch {
        return null;
    }
}

function save(gameKey: string, session: GameSession) {
    try {
        localStorage.setItem(keyFor(gameKey), JSON.stringify(session));
    } catch {
        // localStorage переполнен или недоступен — игра продолжает работать без персистенции
    }
}

export const sessionService = {
    /** Значение сохранённого поля или undefined, если его нет. */
    getField(gameKey: string, field: string): unknown {
        const session = load(gameKey);
        return session ? session.fields[field] : undefined;
    },

    saveField(gameKey: string, field: string, value: unknown) {
        const session = load(gameKey) ?? {players: [], fields: {}};
        session.fields[field] = value;
        save(gameKey, session);
    },

    clear(gameKey: string) {
        localStorage.removeItem(keyFor(gameKey));
    },

    /** Начало новой партии: пустая сессия, подписанная составом игроков. */
    begin(gameKey: string, players: string[]) {
        save(gameKey, {players, fields: {}});
    },

    /**
     * Сверяет состав игроков сессии с текущим: при несовпадении сессия
     * сбрасывается, иначе подписывается текущим составом. Вызывается
     * в GamePlayRoute до маунта игры.
     */
    syncPlayers(gameKey: string, players: string[]) {
        const session = load(gameKey);
        if (!session) return;
        const same =
            session.players.length === players.length &&
            session.players.every((p, i) => p === players[i]);
        if (session.players.length > 0 && !same) {
            sessionService.clear(gameKey);
            return;
        }
        if (session.players.length === 0) {
            session.players = players;
            save(gameKey, session);
        }
    },
};