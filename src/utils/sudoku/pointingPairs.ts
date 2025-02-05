import { ETechnique } from "../../modules/sudoku/technique.type.ts";
import useSudokuStore from "../../zustand/useSudokuStore";
import {
  getFreqOfNotes,
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
  isSameBlock,
  isSameCol,
  isSameRow,
} from "./utils";

/**
 * Áp dụng "Cặp loại trừ" khi một Ghi chú xuất hiện hai lần trong một khối và
 * Ghi chú này cũng thuộc cùng một hàng hoặc cột. Điều này có nghĩa là Ghi chú
 * chắc chắn phải là lời giải cho một trong hai ô trong khối. Vì vậy, bạn có thể
 * loại bỏ Ghi chú này khỏi bất kỳ ô nào khác trong hàng hoặc cột.
 */
export const pointingPairs = () => {
  const notes = useSudokuStore.getState().notes;

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const freq = getFreqOfNotes(arrNote);

    // If a number appears exactly twice, check if they are in the same row or column
    for (const [num, { count, positions }] of freq) {
      if (count === 2) {
        const realPositions = positions.map((pos) => arrIdx[pos]);
        const [pos1, pos2] = realPositions;

        const isSameRowResult = isSameRow(pos1, pos2);
        if (isSameRowResult !== false) {
          const noteNeedChange = getIdxByRow(isSameRowResult)
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "block-row",
                typeDetail: blockIdx,
                notePositions: noteNeedChange,
                number: num,
              },
            };
          }
        }

        const isSameColResult = isSameCol(pos1, pos2);
        if (isSameColResult !== false) {
          const noteNeedChange = getIdxByCol(isSameColResult)
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "block-col",
                typeDetail: blockIdx,
                notePositions: noteNeedChange,
                number: num,
              },
            };
          }
        }
      }
    }
  }

  // Bộ đôi chỉ hướng phiên bản cột vs block
  for (let colIdx = 0; colIdx < 9; colIdx++) {
    const arrIdx = getIdxByCol(colIdx);
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const freq = getFreqOfNotes(arrNote);

    // If a number appears exactly twice, check if they are in the same block
    for (const [num, { count, positions }] of freq) {
      if (count === 2) {
        const realPositions = positions.map((pos) => arrIdx[pos]);
        const [pos1, pos2] = realPositions;

        const isSameBlockResult = isSameBlock(pos1, pos2);
        if (isSameBlockResult !== false) {
          const noteNeedChange = getIdxByBlock(isSameBlockResult)
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "col-block",
                typeDetail: colIdx,
                notePositions: noteNeedChange,
                number: num,
              },
            };
          }
        }
      }
    }
  }

  // Bộ đôi chỉ hướng phiên bản hàng vs block
  for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
    const arrIdx = getIdxByRow(rowIdx);
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const freq = getFreqOfNotes(arrNote);

    // If a number appears exactly twice, check if they are in the same block
    for (const [num, { count, positions }] of freq) {
      if (count === 2) {
        const realPositions = positions.map((pos) => arrIdx[pos]);
        const [pos1, pos2] = realPositions;

        const isSameBlockResult = isSameBlock(pos1, pos2);
        if (isSameBlockResult !== false) {
          const noteNeedChange = getIdxByBlock(isSameBlockResult)
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "row-block",
                typeDetail: rowIdx,
                notePositions: noteNeedChange,
                number: num,
              },
            };
          }
        }
      }
    }
  }


  return null;
};
