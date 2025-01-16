import { ETechnique } from "../../../types/technique.type";
import { getCellPos } from "../../../utils/sudoku";
import {
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../../../utils/sudoku/utils";

type Options = {
  cells: (number | null)[];
  // example: rows[8] = 0:{1 => 74} 1:{5 => 77} 2:{3 => 80}
  rows: Map<number, number>[];
  cols: Map<number, number>[];
  blocks: Map<number, number>[];
};

/**
 *
 * @version 2
 */
export const lastRemainingCell = (options: Options) => {
  const { cells, rows, cols, blocks } = options;

  for (let n = 1; n <= 9; n++) {
    // find all possible indexes to place the number n
    const possibleIdx = cells.reduce((acc, val, idx) => {
      if (val !== 0) return acc;

      const { row, col, block } = getCellPos(idx);
      if (!rows[row].has(n) && !cols[col].has(n) && !blocks[block].has(n)) {
        acc.push({ idx, row, col, block });
      }

      return acc;
    }, [] as { idx: number; row: number; col: number; block: number }[]);

    type Frequency = { count: number; positions: number[] };

    // frequency of number n in each row, col, block
    const rowFreq = new Array(9)
      .fill(0)
      .map<Frequency>(() => ({ count: 0, positions: [] }));
    const colFreq = new Array(9)
      .fill(0)
      .map<Frequency>(() => ({ count: 0, positions: [] }));
    const blockFreq = new Array(9)
      .fill(0)
      .map<Frequency>(() => ({ count: 0, positions: [] }));
    possibleIdx.forEach(({ row, col, block, idx }) => {
      rowFreq[row].count++;
      rowFreq[row].positions.push(idx);
      colFreq[col].count++;
      colFreq[col].positions.push(idx);
      blockFreq[block].count++;
      blockFreq[block].positions.push(idx);
    });

    // find position of the cell that has only one possible number to fill
    const rowIdx = rowFreq.findIndex((val) => val.count === 1);
    if (rowIdx !== -1) {
      const position = rowFreq[rowIdx].positions[0];
      const blockRelated = new Set<number>();
      const colRelated = new Set<number>();
      getIdxByRow(rowIdx)
        .filter((idx) => !cells[idx] || idx === position)
        .forEach((idx) => {
          const { block, col } = getCellPos(idx);
          // prefer block than col
          if (blocks[block].has(n)) {
            return blockRelated.add(block);
          }
          if (cols[col].has(n)) {
            colRelated.add(col);
          }
        });
      return {
        type: ETechnique.lastRemainingCell,
        payload: {
          type: "row",
          typeDetail: rowIdx,
          blockRelated: Array.from(blockRelated),
          colRelated: Array.from(colRelated),
          rowRelated: [],
          position,
          value: n,
        },
      };
    }

    const colIdx = colFreq.findIndex((val) => val.count === 1);
    if (colIdx !== -1) {
      const position = colFreq[colIdx].positions[0];
      const rowRelated = new Set<number>();
      const blockRelated = new Set<number>();
      getIdxByCol(colIdx)
        .filter((idx) => !cells[idx] || idx === position)
        .forEach((idx) => {
          const { row, block } = getCellPos(idx);
          // prefer block than row
          if (blocks[block].has(n)) return blockRelated.add(block);
          if (rows[row].has(n)) rowRelated.add(row);
        });
      return {
        type: ETechnique.lastRemainingCell,
        payload: {
          type: "col",
          typeDetail: colIdx,
          position,
          rowRelated: Array.from(rowRelated),
          colRelated: [],
          blockRelated: Array.from(blockRelated),
          value: n,
        },
      };
    }

    const blockIdx = blockFreq.findIndex((val) => val.count === 1);
    if (blockIdx !== -1) {
      const position = blockFreq[blockIdx].positions[0];
      const rowRelated = new Set<number>();
      const colRelated = new Set<number>();
      getIdxByBlock(blockIdx)
        // remove cell that already has value or is the last remaining cell
        .filter((idx) => !cells[idx] || idx === position)
        // find row, col that can contain n
        .forEach((idx) => {
          const { row, col } = getCellPos(idx);
          if (rows[row].has(n)) rowRelated.add(row);
          if (cols[col].has(n)) colRelated.add(col);
        });
      return {
        type: ETechnique.lastRemainingCell,
        payload: {
          type: "block",
          typeDetail: blockIdx,
          position,
          rowRelated: Array.from(rowRelated),
          colRelated: Array.from(colRelated),
          blockRelated: [],
          value: n,
        },
      };
    }
  }

  return null;
};
