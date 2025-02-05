import { Notes } from "../sudokuTypes.ts";
import { getBlockIdx } from "../../../utils/sudoku";
import { getNumberNotInSet } from "../../../utils/sudokuRules";
import { preHandle } from "../utils";
import { useBoardStore } from "./useBoard";

export const getNewNotes = () => {
  const arrIdx: number[] = [];
  let cntChange = 0;
  const oldNotes = useBoardStore.getState().notes;
  const { rows, cols, cells, blocks } = preHandle(
    useBoardStore.getState().cells
  );

  // fill note into cell empty
  const newNotes: Notes = Array.from({ length: 81 }, () => []);
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = cells[row * 9 + col];
      if (val) continue;
      const blockIdx = getBlockIdx(row, col);
      // numbers that have been used in: row, col, block
      const usedNums = new Set<number>([
        ...rows[row].keys(),
        ...cols[col].keys(),
        ...blocks[blockIdx].keys(),
      ]);
      // feasible numbers
      newNotes[row * 9 + col] = getNumberNotInSet(usedNums);
    }
  }

  // compare with old notes: ưu tiên số lượng note ít hơn nhưng vẫn đẩm bảo tính đúng đắn
  for (let i = 0; i < 81; i++) {
    if (oldNotes[i].length !== 0 && oldNotes[i].length < newNotes[i].length) {
      if (oldNotes[i].every((note) => newNotes[i].includes(note))) {
        newNotes[i] = oldNotes[i];
      }
    }
    if (oldNotes[i].join("") !== newNotes[i].join("")) {
      cntChange++;
      arrIdx.push(i);
    }
  }

  return {
    change: cntChange,
    newNotes,
    arrIdx,
  };
};
