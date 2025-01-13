import { Notes } from "../../types/sudokuTypes";
import { setNote } from "../../zustand/Sudoku";
import useSudokuStore from "../../zustand/useSudokuStore";
import { arraysEqual } from "../arrayUtils";
import { getIdxByBlock, getIdxByCol, getIdxByRow } from "./utils";

export const obviousPairs = () => {
  // 81 array or number
  const notes = useSudokuStore.getState().notes;

  let includeFlag = false;

  const commonHandel = (arrIdx: number[]) => {
    if (includeFlag) return;

    const arrNote = arrIdx.map((idx) => notes[idx]);
    const found = getObviousPairs(arrNote);
    if (found) {
      const realFoundIdx = found.positions.map((pos) => arrIdx[pos]);

      arrIdx.forEach((realIdx) => {
        // skip found positions
        if (realFoundIdx.includes(realIdx)) {
          return;
        }

        // if note include one of the pair, then remove it
        const note = notes[realIdx];
        if (note.includes(found.pair[0]) || note.includes(found.pair[1])) {
          includeFlag = true;

          // update notes
          // notes[idx] = note.filter((n) => found.pair.includes(n));
          const newNote = note.filter((n) => !found.pair.includes(n));
          setNote(realIdx, newNote);
        }
      });
    }
  };

  // row
  for (let row = 0; row < 9; row++) {
    const arrIdx = getIdxByRow(row);
    commonHandel(arrIdx);
  }

  // col
  for (let col = 0; col < 9; col++) {
    const arrIdx = getIdxByCol(col);
    commonHandel(arrIdx);
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    commonHandel(arrIdx);
  }

  return includeFlag;
};

function getObviousPairs(notes: Notes) {
  // check len
  if (notes.length !== 9) {
    throw new Error("Invalid notes length, it should be 9");
  }

  for (let pos1 = 0; pos1 < 8; pos1++) {
    const currentNotes = notes[pos1];

    // ignore if not exactly 2 numbers
    if (currentNotes.length !== 2) {
      continue;
    }

    // check the remaining positions
    for (let pos2 = pos1 + 1; pos2 < 9; pos2++) {
      const otherNotes = notes[pos2];

      if (otherNotes.length === 2 && arraysEqual(currentNotes, otherNotes)) {
        return {
          positions: [pos1, pos2] as [number, number],
          pair: currentNotes as [number, number],
        };
      }
    }
  }

  return null;
}
