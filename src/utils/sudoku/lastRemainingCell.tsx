import { ETechnique } from "../../modules/sudoku/technique.type.ts";
import { getCellPos } from "./position";
import { getIdxByBlock, getIdxByRow } from "./utils";

type Options = {
  cells: (number | null)[];
  // example: rows[8] = 0:{1 => 74} 1:{5 => 77} 2:{3 => 80}
  rows: Map<number, number>[];
  cols: Map<number, number>[];
  blocks: Map<number, number>[];
};

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
      return {
        type: ETechnique.lastRemainingCell,
        payload: {
          type: "row",
          typeDetail: rowIdx,
          position: rowFreq[rowIdx].positions[0],
          value: n,
        },
      };
    }
    const colIdx = colFreq.findIndex((val) => val.count === 1);
    if (colIdx !== -1) {
      return {
        type: ETechnique.lastRemainingCell,
        payload: {
          type: "col",
          typeDetail: colIdx,
          position: colFreq[colIdx].positions[0],
          value: n,
        },
      };
    }

    const blockIdx = blockFreq.findIndex((val) => val.count === 1);
    if (blockIdx !== -1) {
      return {
        type: ETechnique.lastRemainingCell,
        payload: {
          type: "block",
          typeDetail: blockIdx,
          position: blockFreq[blockIdx].positions[0],
          value: n,
        },
      };
    }
  }

  // kiểm tra xem có ô nào là duy nhất trong 1 cột, 1 hàng hoặc 1 khối không

  return;

  for (let n = 1; n <= 9; n++) {
    /** A list of possible indexes to place the number n */
    const arrPossibleIdx: number[] = [];
    cells.forEach((val, idx) => {
      // if the cell is not empty, skip
      if (val !== 0) return;

      const { row, col, block } = getCellPos(idx);
      if (!rows[row].has(n) && !cols[col].has(n) && !blocks[block].has(n)) {
        arrPossibleIdx.push(idx);
      }
    });

    // check if there is a block that has only one cell to place n
    for (let i = 0; i < 9; i++) {
      const arrIdxOfBlock = getIdxByBlock(i);
      let cnt = 0;
      let cellPos = -1;
      arrIdxOfBlock.forEach((idx) => {
        if (arrPossibleIdx.includes(idx)) {
          cnt++;
          cellPos = idx;
        }
      });
      if (cnt === 1) {
        // console.log("Block", i, "has only one cell to place", n);
        return {
          type: ETechnique.lastRemainingCell,
          payload: {
            type: "block",
            typeDetail: i,
            position: cellPos,
            value: n,
          },
        };
      }
    }

    // check if there is a row that has only one cell to place n
    for (let i = 0; i < 9; i++) {
      const arrIdx = getIdxByRow(i);
      let cnt = 0;
      let cellPos = -1;
      arrIdx.forEach((idx) => {
        if (arrPossibleIdx.includes(idx)) {
          cnt++;
          cellPos = idx;
        }
      });
      if (cnt === 1) {
        // console.log("Row", i, "has only one cell to place", n);
        return {
          type: ETechnique.lastRemainingCell,
          payload: {
            type: "row",
            typeDetail: i,
            position: cellPos,
            value: n,
          },
        };
      }
    }

    // check if there is a col that has only one cell to place n
    for (let i = 0; i < 9; i++) {
      const arrIdx = getIdxByRow(i);
      let cnt = 0;
      let cellPos = -1;
      arrIdx.forEach((idx) => {
        if (arrPossibleIdx.includes(idx)) {
          cnt++;
          cellPos = idx;
        }
      });
      if (cnt === 1) {
        // console.log("Col", i, "has only one cell to place", n);
        return {
          type: ETechnique.lastRemainingCell,
          payload: {
            type: "col",
            typeDetail: i,
            position: cellPos,
            value: n,
          },
        };
      }
    }
  }
};
