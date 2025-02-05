import { ETechnique } from "../technique.type.ts";
import { getCellPos } from "../../../utils/sudoku";

type Options = {
  cells: (number | null)[];
  // example: rows[8] = 0:{1 => 74} 1:{5 => 77} 2:{3 => 80}
  rows: Map<number, number>[];
  cols: Map<number, number>[];
  blocks: Map<number, number>[];
};

/**
 * "Last possible number" technique.
 */
export const lastPossibleNumber = (options: Options) => {
  const { cells, rows, cols, blocks } = options;

  for (let cellIdx = 0; cellIdx < 81; cellIdx++) {
    const val = cells[cellIdx];
    if (val !== 0) continue;

    const { row, col, block } = getCellPos(cellIdx);
    /** Used numbers in row, col, block */
    const usedNumbers = new Set<number>([
      ...rows[row].keys(),
      ...cols[col].keys(),
      ...blocks[block].keys(),
    ]);

    // if there are exactly 8 used numbers
    if (usedNumbers.size === 8) {
      const expectedSum = 45 - [...usedNumbers].reduce((a, b) => a + b, 0);
      return {
        type: ETechnique.lastPossibleNumber,
        payload: {
          position: cellIdx,
          value: expectedSum,
          rowRelated: [row],
          colRelated: [col],
          blockRelated: [block],
        },
      };
    }
  }

  return;
};
