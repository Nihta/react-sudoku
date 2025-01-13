import { Cells } from "../../types/sudokuTypes";
import { TechniqueResult } from "../../types/technique.type";
import { getBoardInfo } from "./highLight";

/**
 * "Last free cell" technique
 */
export const lastFreeCellTechnique = (cells: Cells): TechniqueResult | null => {
  const { cols, rows, blocks } = getBoardInfo(cells);

  for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
    const row = rows[rowIdx];
    if (row.size === 8 && Array.from(row.values()).every((val) => val === 1)) {
      // find missing value
      let missingVal = 0;
      for (let i = 1; i <= 9; i++) {
        if (!row.has(i)) {
          missingVal = i;
          break;
        }
      }

      // find position of missing value
      for (let col = 0; col < 9; col++) {
        const pos = rowIdx * 9 + col;
        if (cells[pos].value === null) {
          return {
            type: "lastFreeCell",
            detail: {
              type: "row",
              value: rowIdx,
            },
            correct: {
              pos,
              value: missingVal,
            },
          };
        }
      }
    }
  }

  // col
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    const col = cols[colIdx];
    if (col.size === 8 && Array.from(col.values()).every((val) => val === 1)) {
      // find missing value
      let missingVal = 0;
      for (let i = 1; i <= 9; i++) {
        if (!col.has(i)) {
          missingVal = i;
          break;
        }
      }

      // find position of missing value
      for (let row = 0; row < 9; row++) {
        const pos = row * 9 + colIdx;
        if (cells[pos].value === null) {
          return {
            type: "lastFreeCell",
            detail: {
              type: "col",
              value: colIdx,
            },
            correct: {
              pos,
              value: missingVal,
            },
          };
        }
      }
    }
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const block = blocks[blockIdx];
    if (block.size === 8 && Array.from(block.values()).every((val) => val === 1)) {
      // find missing value
      let missingVal = 0;
      for (let i = 1; i <= 9; i++) {
        if (!block.has(i)) {
          missingVal = i;
          break;
        }
      }

      // find position of missing value
      const [rowStart, colStart] = [Math.floor(blockIdx / 3) * 3, (blockIdx % 3) * 3];
      for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
          const pos = i * 9 + j;
          if (cells[pos].value === null) {
            return {
              type: "lastFreeCell",
              detail: {
                type: "block",
                value: blockIdx,
              },
              correct: {
                pos,
                value: missingVal,
              },
            };
          }
        }
      }
    }
  }

  return null;
};
