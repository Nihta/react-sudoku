import { setCellVal, setNote } from "../../zustand/Sudoku";
import useSudokuStore from "../../zustand/useSudokuStore";
import { getIdxByBlock } from "./utils";

// Kỹ thuật "Số lẻ ẩn"
export const hiddenSingles = () => {
  const notes = useSudokuStore.getState().notes;
  let foundFlag = false;

  const commonHandel = (arrIdx: number[]) => {
    if (foundFlag) return;

    const arrNote = arrIdx.map((idx) => notes[idx]);

    // tính tần suất xuất hiện của các số
    const numberFrequency = new Map<number, number>();
    arrNote.forEach((note) => {
      note.forEach((num) => {
        numberFrequency.set(num, (numberFrequency.get(num) || 0) + 1);
      });
    });

    // tìm số lẻ ẩn
    numberFrequency.forEach((frequency, num) => {
      if (frequency === 1) {
        arrNote.forEach((note, idx) => {
          if (note.includes(num)) {
            const realCellIdx = arrIdx[idx];
            setNote(realCellIdx, []);
            setCellVal(realCellIdx, num, true);
            foundFlag = true;
            return;
          }
        });
      }
    });
  };

  // row
  for (let row = 0; row < 9; row++) {
    const arrIdx = Array.from({ length: 9 }, (_, i) => row * 9 + i);
    commonHandel(arrIdx);
  }

  // col
  for (let col = 0; col < 9; col++) {
    const arrIdx = Array.from({ length: 9 }, (_, i) => i * 9 + col);
    commonHandel(arrIdx);
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    commonHandel(arrIdx);
  }

  return foundFlag;
};
