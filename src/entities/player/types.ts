export interface Player {
  id: string;
  name: string;
  role: string;
  isSpy: boolean;
}

/** Черновик игрока на экране Setup (до старта партии). */
export interface PlayerEntry {
  id: string;
  name: string;
}
