// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const ResistancePhase = {
  Distributing: 'distributing',
  Proposing: 'proposing',
  PassingPhone: 'passingPhone',
  MissionVoting: 'missionVoting',
  MissionResult: 'missionResult',
  GameOver: 'gameOver',
} as const;
export type ResistancePhase = (typeof ResistancePhase)[keyof typeof ResistancePhase];
