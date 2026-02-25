export type Player = 1 | 2;
export type Hex = { q: number; r: number; s: number };

// Helper to formulate a unique string key for a hex
export const hexKey = (hex: Hex): string => `${hex.q},${hex.r},${hex.s}`;

// Hex coordinate string parsing
export const keyToHex = (key: string): Hex => {
  const [q, r, s] = key.split(',').map(Number);
  return { q, r, s };
};

export const hexDistance = (a: Hex, b: Hex): number => {
  return Math.max(
    Math.abs(a.q - b.q),
    Math.abs(a.r - b.r),
    Math.abs(a.s - b.s)
  );
};

// Generates a regular hexagon grid of radius N
export const generateBoard = (radius: number): Hex[] => {
  const hexes: Hex[] = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      const s = -q - r;
      hexes.push({ q, r, s });
    }
  }
  return hexes;
};

// Get all valid moves (distance 1 and 2) or specific ones
export const getValidMoves = (hex: Hex, board: Record<string, Player | 0>): { moves: Hex[], jumps: Hex[] } => {
  const moves: Hex[] = [];
  const jumps: Hex[] = [];
  
  // We iterate through surrounding spaces up to distance 2
  for (let dq = -2; dq <= 2; dq++) {
    for (let dr = -2; dr <= 2; dr++) {
      for (let ds = -2; ds <= 2; ds++) {
        if (dq + dr + ds === 0) {
          const distance = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
          const target = { q: hex.q + dq, r: hex.r + dr, s: hex.s + ds };
          const key = hexKey(target);
          if (distance > 0 && distance <= 2 && board[key] === 0) {
            if (distance === 1) moves.push(target);
            else jumps.push(target);
          }
        }
      }
    }
  }
  return { moves, jumps };
};

export const getNeighbors = (hex: Hex): Hex[] => {
  const directions = [
    [+1, -1, 0], [+1, 0, -1], [0, +1, -1],
    [-1, +1, 0], [-1, 0, +1], [0, -1, +1]
  ];
  return directions.map(d => ({ q: hex.q + d[0], r: hex.r + d[1], s: hex.s + d[2] }));
};

export const INITIAL_BOARD_RADIUS = 4;
