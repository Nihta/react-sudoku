import { ETechnique } from "../../modules/sudoku/technique.type.ts";
import useSudokuStore from "../../zustand/useSudokuStore";
import { getFreqOfNotes, getIdxByBlock, getIdxByCol, getIdxByRow } from "./utils";

// Kỹ thuật "Số lẻ ẩn"
export const hiddenSingles = () => {
  const notes = useSudokuStore.getState().notes;

  // row
  for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
    const arrIdx = getIdxByRow(rowIdx);
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const numFreq = getFreqOfNotes(arrNote);
    for (const [num, { count, positions }] of numFreq) {
      if (count === 1) {
        const realCellIdx = arrIdx[positions[0]];
        return {
          type: ETechnique.hiddenSingles,
          payload: {
            type: "row",
            typeDetail: rowIdx,
            position: realCellIdx,
            value: num,
          },
        };
      }
    }
  }

  // col
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    const arrIdx = getIdxByCol(colIdx);
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const numFreq = getFreqOfNotes(arrNote);
    for (const [num, { count, positions }] of numFreq) {
      if (count === 1) {
        const realCellIdx = arrIdx[positions[0]];
        console.log("realCellIdx", realCellIdx);
        return {
          type: ETechnique.hiddenSingles,
          payload: {
            type: "col",
            typeDetail: colIdx,
            position: realCellIdx,
            value: num,
          },
        };
      }
    }
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const numFreq = getFreqOfNotes(arrNote);
    for (const [num, { count, positions }] of numFreq) {
      if (count === 1) {
        const realCellIdx = arrIdx[positions[0]];
        console.log("realCellIdx b", realCellIdx);
        return {
          type: ETechnique.hiddenSingles,
          payload: {
            type: "block",
            typeDetail: blockIdx,
            position: realCellIdx,
            value: num,
          },
        };
      }
    }
  }

  return null;
};
