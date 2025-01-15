// lastFreeCell

import { ETechnique } from "../../types/technique.type";
import { getIdxByBlock, getIdxByCol, getIdxByRow } from "./utils";

type Options = {
  cells: (number | null)[];
  // example: rows[8] = 0:{1 => 74} 1:{5 => 77} 2:{3 => 80}
  rows: Map<number, number>[];
  cols: Map<number, number>[];
  blocks: Map<number, number>[];
};

/**
 * "Last free cell" technique
 */
export const lastFreeCell = (options: Options) => {
  const { cells, rows, cols, blocks } = options;

  // row
  for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
    const row = rows[rowIdx];
    /** The number used in the row */
    const numberUse = new Set<number>([...row.keys()]);
    if (numberUse.size === 8) {
      /** The missing value in the row */
      const missingVal = 45 - [...numberUse].reduce((a, b) => a + b, 0);
      /** The index of the missing value */
      const foundIdx = getIdxByRow(rowIdx).find((idx) => !cells[idx]);
      if (foundIdx !== undefined) {
        return {
          type: ETechnique.lastFreeCell,
          payload: {
            detail: { type: "row", value: rowIdx },
            correct: { pos: foundIdx, value: missingVal },
          },
        };
      }
    }
  }

  // Col
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    const col = cols[colIdx];
    /** The number used in the column */
    const numberUse = new Set<number>([...col.keys()]);
    if (numberUse.size === 8) {
      /** The missing value in the column */
      const missingVal = 45 - [...numberUse].reduce((a, b) => a + b, 0);
      /** The index of the missing value */
      const foundIdx = getIdxByCol(colIdx).find((idx) => !cells[idx]);
      if (foundIdx !== undefined) {
        return {
          type: ETechnique.lastFreeCell,
          payload: {
            detail: { type: "col", value: colIdx },
            correct: { pos: foundIdx, value: missingVal },
          },
        };
      }
    }
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const block = blocks[blockIdx];
    /** The number used in the block */
    const numberUse = new Set<number>([...block.keys()]);
    if (numberUse.size === 8) {
      /** The missing value in the block */
      const missingVal = 45 - [...numberUse].reduce((a, b) => a + b, 0);
      /** The index of the missing value */
      const foundIdx = getIdxByBlock(blockIdx).find((idx) => !cells[idx]);
      if (foundIdx !== undefined) {
        return {
          type: ETechnique.lastFreeCell,
          payload: {
            detail: { type: "block", value: blockIdx },
            correct: { pos: foundIdx, value: missingVal },
          },
        };
      }
    }
  }

  return null;
};
