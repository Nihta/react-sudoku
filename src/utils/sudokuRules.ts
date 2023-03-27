import useSudokuStore from "../zustand/useSudokuStore";

/**
 * Lấy dữ liệu cell (origin) only
 */
const getOriginCells = () => {
  const cells = useSudokuStore.getState().cells;
  const newCells = cells.map((cell) => {
    return cell.isOrigin ? cell.value : 0;
  });
  return newCells;
};

const ARR_1_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Kỹ thuật "Ô còn lại cuối cùng".
 * last-remaining-cell
 */
const lastRemainingCell = () => {
  const cells = getOriginCells();

  // tai moi cell = 0 (empty) ta tao mot set 1->9
  const notes = cells.map((val) => {
    if (val) {
      return null;
    } else {
      return new Set(ARR_1_9);
    }
  });
};

const preHandle = () => {
  const cells = getOriginCells();

  const rows = new Array(9).fill(null).map(() => new Map());
  const cols = new Array(9).fill(null).map(() => new Map());
  const blocks = new Array(9).fill(null).map(() => new Map());

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const idx = i * 9 + j;
      const value = cells[idx];
      if (value) {
        rows[i].set(value, idx);
        cols[j].set(value, idx);
        blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].set(value, idx);
      }
    }
  }

  return {
    rows,
    cols,
    blocks,
    cells,
  };
};

function findMissingValue(map: Map<number, number>) {
  const set = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (const key of map.keys()) {
    set.delete(key);
  }
  return set.values().next().value;
}
/**
 *
 * @param cells
 * @param row
 * @returns - 1 if not found
 */
const findEmptyCellInRow = (cells: (number | null)[], row: number) => {
  for (let i = 0; i < 9; i++) {
    const idx = row * 9 + i;
    if (!cells[idx]) {
      return idx;
    }
  }
  return -1;
};

const findEmptyCellInCol = (cells: (number | null)[], col: number) => {
  for (let i = 0; i < 9; i++) {
    const idx = i * 9 + col;
    if (!cells[idx]) {
      return idx;
    }
  }
  return -1;
};

const findEmptyCellInBlock = (cells: (number | null)[], block: number) => {
  const row = Math.floor(block / 3) * 3;
  const col = (block % 3) * 3;
  for (let i = 0; i < 9; i++) {
    const idx = (row + Math.floor(i / 3)) * 9 + col + (i % 3);
    if (!cells[idx]) {
      return idx;
    }
  }
  return -1;
};

type FnRule = (
  cells: (number | null)[],
  rows: Map<number, number>[],
  cols: Map<number, number>[],
  blocks: Map<number, number>[]
) => {
  idx: number;
  val: number;
} | null;

/**
 * Last free cell
 */
export const getLastFreeCell: FnRule = (cells, rows, cols, blocks) => {
  // check row
  for (let i = 0; i < 9; i++) {
    if (rows[i].size === 8) {
      return {
        idx: findEmptyCellInRow(cells, i),
        val: findMissingValue(rows[i]),
      };
    }
  }

  // check col
  for (let i = 0; i < 9; i++) {
    if (cols[i].size === 8) {
      return {
        idx: findEmptyCellInCol(cells, i),
        val: findMissingValue(cols[i]),
      };
    }
  }

  // check block 3x3
  for (let i = 0; i < 9; i++) {
    if (blocks[i].size === 8) {
      return {
        idx: findEmptyCellInBlock(cells, i),
        val: findMissingValue(blocks[i]),
      };
    }
  }

  return null;
};

export const trySolve = () => {
  const { clickCell, setCellVal } = useSudokuStore.getState();

  // const res = getLastFreeCell();
  // console.log(res);

  // if (res?.idx) {
  //   clickCell(res.idx);
  //   setCellVal(res.idx, res.value, false, true);
  // }

  //  ----

  const { rows, cols, cells, blocks } = preHandle();

  /**
   * Last free cell ------------------------------------------------------------
   */

  const res = getLastFreeCell(cells, rows, cols, blocks);
  if (res?.idx) {
    console.log("Last free cell: ", res);
    clickCell(res.idx);
    setCellVal(res.idx, res.val, false, true);
    return;
  }

  /**
   * Kỹ thuật "Ô còn lại cuối cùng".
   * last remaining cell -------------------------------------------------------
   */
  // tìm những vị trí phù hợp cho số 1

  for (let n = 1; n <= 9; n++) {
    const possibleIdxs: {
      rowIdx: number;
      colIdx: number;
      blockIdx: number;
    }[] = [];

    // tìm vị trí có thể đặt số n
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = cells[row * 9 + col];
        if (!val) {
          const blIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
          if (!rows[row].has(n) && !cols[col].has(n) && !blocks[blIdx].has(n)) {
            possibleIdxs.push({
              rowIdx: row,
              colIdx: col,
              blockIdx: blIdx,
            });
          }
        }
      }
    }

    // tìm vị trí chắc chắn đặt số n (nếu có)
    const mapR = new Map<number, number>();
    const mapC = new Map<number, number>();
    const mapB = new Map<number, number>();
    for (const { rowIdx, colIdx, blockIdx } of possibleIdxs) {
      mapR.set(rowIdx, (mapR.get(rowIdx) || 0) + 1);
      mapC.set(colIdx, (mapC.get(colIdx) || 0) + 1);
      mapB.set(blockIdx, (mapB.get(blockIdx) || 0) + 1);
    }

    for (const { rowIdx, colIdx, blockIdx } of possibleIdxs) {
      if (
        mapR.get(rowIdx) === 1 ||
        mapC.get(colIdx) === 1 ||
        mapB.get(blockIdx) === 1
      ) {
        console.log("Last remaining cell: ", rowIdx, colIdx, n);
        clickCell(rowIdx * 9 + colIdx);
        setCellVal(rowIdx * 9 + colIdx, n, false, true);
        return;
      }
    }
  }
};

// ! sai logic
// for (let n = 1; n <= 9; n++) {
//   // lặp qua từng hàng
//   for (let i = 0; i < 9; i++) {
//     // lặp qua từng cột
//     for (let j = 0; j < 9; j++) {
//       // lấy vị trí của cell
//       const idx = i * 9 + j;
//       // nếu cell đó là empty
//       if (!cells[idx]) {
//         // lấy vị trí của block
//         const block = Math.floor(i / 3) * 3 + Math.floor(j / 3);
//         // lấy vị trí của hàng
//         const row = i;
//         // lấy vị trí của cột
//         const col = j;
//         // nếu số 1 chưa có trong hàng, cột, block
//         if (!rows[row].has(n) && !cols[col].has(n) && !blocks[block].has(n)) {
//           console.log(
//             "Last remaining cell: ",
//             {
//               row: Math.floor(idx / 9),
//               col: idx % 9,
//             },
//             n
//           );
//           clickCell(idx);
//           setCellVal(idx, n, false, true);
//           return;
//         }
//       }
//     }
//   }
// }
