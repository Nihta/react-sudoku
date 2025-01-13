import { Notes } from "../../types/sudokuTypes";
import { addHistory, setNotes } from "../../zustand/Sudoku";
import useSudokuStore from "../../zustand/useSudokuStore";
import { getNumberNotInSet, preHandle } from "../sudokuRules";
import { getBlockIdx } from "./position";

export const fillNote = () => {
  const { newNotes, change } = getNewNotes();
  console.log("fillNote", { change, newNotes });

  if (change > 0) {
    addHistory();
    setNotes(newNotes);
  }
};

export const getNewNotes = () => {
  let cntChange = 0;
  const oldNotes = useSudokuStore.getState().notes;
  const { rows, cols, cells, blocks } = preHandle();

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
    }
  }

  return {
    change: cntChange,
    newNotes,
  };
};
