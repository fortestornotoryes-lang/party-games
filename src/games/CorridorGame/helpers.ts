import type {Pos, WallGrid} from './types';

export function emptyWalls(): WallGrid {
    return Array.from({length: 8}, () => new Array<0 | 1 | 2>(8).fill(0));
}

// Is the passage between adjacent cells (r1,c1)→(r2,c2) blocked by a wall?
// hWalls[r][c] = horizontal wall between rows r↔r+1, spanning cols c and c+1
// vWalls[r][c] = vertical wall between cols c↔c+1, spanning rows r and r+1
export function isBlocked(
    r1: number, c1: number,
    r2: number, c2: number,
    hW: WallGrid, vW: WallGrid,
): boolean {
    if (r2 === r1 - 1) // up
        return !!(hW[r2]?.[c1]) || !!(c1 > 0 && hW[r2]?.[c1 - 1]);
    if (r2 === r1 + 1) // down
        return !!(hW[r1]?.[c1]) || !!(c1 > 0 && hW[r1]?.[c1 - 1]);
    if (c2 === c1 - 1) // left
        return !!(vW[r1]?.[c2]) || !!(r1 > 0 && vW[r1 - 1]?.[c2]);
    if (c2 === c1 + 1) // right
        return !!(vW[r1]?.[c1]) || !!(r1 > 0 && vW[r1 - 1]?.[c1]);
    return true;
}

// Valid pawn destinations including jump-over-opponent rule
export function validMoves(
    player: 1 | 2,
    pawns: { 1: Pos; 2: Pos },
    hW: WallGrid, vW: WallGrid,
): Pos[] {
    const {row: r, col: c} = pawns[player];
    const opp = pawns[player === 1 ? 2 : 1];
    const result: Pos[] = [];

    const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr > 8 || nc < 0 || nc > 8) continue;
        if (isBlocked(r, c, nr, nc, hW, vW)) continue;

        if (nr !== opp.row || nc !== opp.col) {
            result.push({row: nr, col: nc});
        } else {
            // Jump straight over opponent
            const jr = nr + dr, jc = nc + dc;
            if (jr >= 0 && jr <= 8 && jc >= 0 && jc <= 8 && !isBlocked(nr, nc, jr, jc, hW, vW)) {
                result.push({row: jr, col: jc});
            } else {
                // Wall/edge behind opponent → diagonal jumps
                const perp: [number, number][] = dc === 0 ? [[0, -1], [0, 1]] : [[-1, 0], [1, 0]];
                for (const [pdr, pdc] of perp) {
                    const pr = nr + pdr, pc = nc + pdc;
                    if (pr >= 0 && pr <= 8 && pc >= 0 && pc <= 8 && !isBlocked(nr, nc, pr, pc, hW, vW)) {
                        result.push({row: pr, col: pc});
                    }
                }
            }
        }
    }
    return result;
}

// BFS: can `start` reach goalRow ignoring pawn positions?
export function canReach(start: Pos, goalRow: number, hW: WallGrid, vW: WallGrid): boolean {
    const seen = Array.from({length: 9}, () => new Array<boolean>(9).fill(false));
    const q: Pos[] = [start];
    seen[start.row][start.col] = true;
    while (q.length) {
        const {row, col} = q.shift()!;
        if (row === goalRow) return true;
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
            const nr = row + dr, nc = col + dc;
            if (nr < 0 || nr > 8 || nc < 0 || nc > 8 || seen[nr][nc]) continue;
            if (isBlocked(row, col, nr, nc, hW, vW)) continue;
            seen[nr][nc] = true;
            q.push({row: nr, col: nc});
        }
    }
    return false;
}

// Can wall be placed without overlapping/crossing an existing wall?
export function canPlaceWall(r: number, c: number, o: 'H' | 'V', hW: WallGrid, vW: WallGrid): boolean {
    if (o === 'H') {
        return !(hW[r][c] || vW[r][c] || (c > 0 && hW[r][c - 1]) || (c < 7 && hW[r][c + 1]));
    }
    return !(vW[r][c] || hW[r][c] || (r > 0 && vW[r - 1][c]) || (r < 7 && vW[r + 1][c]));
}
