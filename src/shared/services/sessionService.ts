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

/**
 * Сессии держим в памяти и пишем в localStorage отложенно, одним куском.
 * Раньше каждое изменение любого поля (в т.ч. тик таймера раз в секунду) синхронно
 * парсило и заново сериализовало всю сессию — у рисовалок это мегабайты картинок,
 * отсюда фризы при смене фаз. Теперь: чтение — из памяти, запись — пачкой после
 * FLUSH_DELAY_MS; при уходе со страницы (pagehide / вкладка скрыта) — сразу.
 */
const FLUSH_DELAY_MS = 400;

/** null — сессии нет (проверяли storage), undefined в Map — ещё не читали */
const cache = new Map<string, GameSession | null>();
const dirty = new Set<string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function parse(raw: string | null): GameSession | null {
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

function load(gameKey: string): GameSession | null {
  const cached = cache.get(gameKey);
  if (cached !== undefined) return cached;
  const session = parse(localStorage.getItem(keyFor(gameKey)));
  cache.set(gameKey, session);
  return session;
}

function writeNow(gameKey: string) {
  dirty.delete(gameKey);
  const session = cache.get(gameKey);
  try {
    if (session) localStorage.setItem(keyFor(gameKey), JSON.stringify(session));
    else localStorage.removeItem(keyFor(gameKey));
  } catch {
    // localStorage переполнен или недоступен — игра продолжает работать без персистенции
  }
}

function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  for (const gameKey of [...dirty]) writeNow(gameKey);
}

function save(gameKey: string, session: GameSession) {
  cache.set(gameKey, session);
  dirty.add(gameKey);
  flushTimer ??= setTimeout(flush, FLUSH_DELAY_MS);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

export const sessionService = {
  /** Значение сохранённого поля или undefined, если его нет. */
  getField(gameKey: string, field: string): unknown {
    const session = load(gameKey);
    return session ? session.fields[field] : undefined;
  },

  saveField(gameKey: string, field: string, value: unknown) {
    const session = load(gameKey) ?? { players: [], fields: {} };
    session.fields[field] = value;
    save(gameKey, session);
  },

  clear(gameKey: string) {
    cache.set(gameKey, null);
    writeNow(gameKey);
  },

  /** Начало новой партии: пустая сессия, подписанная составом игроков. */
  begin(gameKey: string, players: string[]) {
    cache.set(gameKey, { players, fields: {} });
    writeNow(gameKey);
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
