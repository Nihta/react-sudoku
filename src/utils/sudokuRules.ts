import useSudokuStore from "../zustand/useSudokuStore";
import {
  addHistory,
  clickCell,
  setCellVal,
  setNote,
  setNotes,
} from "../zustand/Sudoku";
import type { Notes } from "../types/sudokuTypes";
import { deleteValuesFromArray } from "./arrayUtils";
import { getBlockIdx } from "./sudoku";

/**
 * Lấy dữ liệu cell (origin) only
 */
const getOriginCells = () => {
  const cells = useSudokuStore.getState().cells;
  return cells.map((cell) => {
    return cell.isOrigin ? cell.value : 0;
  });
};

export const preHandle = () => {
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

  return { rows, cols, blocks, cells };
};

type FnRule = (
  cells: (number | null)[],
  rows: Map<number, number>[],
  cols: Map<number, number>[],
  blocks: Map<number, number>[]
) => {
  idx: number;
  val: number;
  name: string;
} | null;

/**
 * Kỹ thuật "Ô còn lại cuối cùng".
 * Last remaining cell
 */
const lastRemainingCell: FnRule = (cells, rows, cols, blocks) => {
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
        if (val) continue;

        const blIdx = getBlockIdx(row, col);
        if (!rows[row].has(n) && !cols[col].has(n) && !blocks[blIdx].has(n)) {
          possibleIdxs.push({
            rowIdx: row,
            colIdx: col,
            blockIdx: blIdx,
          });
        }
      }
    }

    // tìm vị trí "Ô còn lại cuối cùng" (nếu có thể khẳng định)
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
        return {
          idx: rowIdx * 9 + colIdx,
          val: n,
          name: "Last remaining cell",
        };
      }
    }
  }

  return null;
};

/**
 * Kiểm tra xem trong set còn thiếu số nào không (1-9)
 */
export const getNumberNotInSet = (set: Set<number>): number[] => {
  const possibleNums: number[] = [];
  for (let n = 1; n <= 9; n++) {
    if (!set.has(n)) {
      possibleNums.push(n);
    }
  }
  return possibleNums;
};

/**
 * Kỹ thuật "Số khả thi còn lại".
 * Last possible number
 */
const lastPossibleCell: FnRule = (cells, rows, cols, blocks) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = cells[row * 9 + col];
      if (val) continue;
      const blockIdx = getBlockIdx(row, col);
      // các số đã được sử dụng trong: row, col, block
      const usedNums = new Set<number>([
        ...rows[row].keys(),
        ...cols[col].keys(),
        ...blocks[blockIdx].keys(),
      ]);

      // các số khả thi
      const possibleNums = getNumberNotInSet(usedNums);

      // nếu chỉ còn 1 số khả thi thì đặt số đó vào ô này
      if (possibleNums.length === 1) {
        return {
          idx: row * 9 + col,
          val: possibleNums[0],
          name: "Last possible cell",
        };
      }
    }
  }

  return null;
};

export const trySolve = () => {
  const { rows, cols, cells, blocks } = preHandle();

  const res =
    lastRemainingCell(cells, rows, cols, blocks) ||
    lastPossibleCell(cells, rows, cols, blocks);

  if (res) {
    addHistory();
    // console.log(res.name);
    clickCell(res.idx);
    setCellVal(res.idx, res.val, true);
    return true;
  }

  // fill note into cell empty
  const newNotes: Notes = Array.from({ length: 81 }, () => []);
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = cells[row * 9 + col];
      if (val) continue;
      const blockIdx = getBlockIdx(row, col);
      // các số đã được sử dụng trong: row, col, block
      const usedNums = new Set<number>([
        ...rows[row].keys(),
        ...cols[col].keys(),
        ...blocks[blockIdx].keys(),
      ]);

      // các số khả thi
      newNotes[row * 9 + col] = getNumberNotInSet(usedNums);
    }
  }
  addHistory();
  setNotes(newNotes);

  return false;
};

// --- note
// get idxs by row
const getIdxsByRow = (row: number) => {
  const idxs: number[] = [];
  for (let col = 0; col < 9; col++) {
    idxs.push(row * 9 + col);
  }
  return idxs;
};

const getIdxsByCol = (col: number) => {
  const idxs: number[] = [];
  for (let row = 0; row < 9; row++) {
    idxs.push(row * 9 + col);
  }
  return idxs;
};

const getIdxsByBlock = (block: number) => {
  const idxs: number[] = [];
  const row = Math.floor(block / 3) * 3;
  const col = (block % 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      idxs.push((row + i) * 9 + col + j);
    }
  }
  return idxs;
};

/**
 * obvious-pairs
 * Cặp số hiển nhiên
 */
const obviousPairs = (notes: Notes) => {
  const helper = (range: number[]) => {
    const map = new Map<string, number[]>();
    let obvPairStr = "";
    loopIdx(notes, range, (note, idx) => {
      const noteTypeStr = [...note].sort().join("");
      if (note.length === 2) {
        if (map.has(noteTypeStr)) {
          map.get(noteTypeStr)?.push(idx);
          obvPairStr = noteTypeStr;
          return true;
        } else {
          map.set(noteTypeStr, [idx]);
        }
      }
    });
    if (obvPairStr.length !== 0) {
      const [idxObv1, idxObv2] = map.get(obvPairStr)!;
      loopIdx(notes, range, (note, idx) => {
        if (note.length === 0 || idx === idxObv1 || idx === idxObv2) return;
        setNote(idx, deleteValuesFromArray(notes[idx], notes[idxObv1]));
      });
    }
  };

  for (let i = 0; i < 9; i++) {
    helper(getIdxsByRow(i));
    helper(getIdxsByCol(i));
    helper(getIdxsByBlock(i));
  }
};

// prettier-ignore
function loopIdx<T>(data: T[], idxs: number[], fn: (val: T, idx: number) => boolean | void) {
  for (const idx of idxs) {
    const isStop = fn(data[idx], idx);
    if (isStop) {
      return;
    }
  }
}

export const handleNote = () => {
  const notes = useSudokuStore.getState().notes;
  obviousPairs(notes);
};
