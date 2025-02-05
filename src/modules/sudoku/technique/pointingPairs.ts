import { ETechnique } from "../technique.type.ts";
import {
  getFreqOfNotes,
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
  isSameBlock,
  isSameCol,
  isSameRow,
} from "../../../utils/sudoku/utils";
import { useBoardStore } from "../stores/useBoard";
import { ActionSetNotes } from "../types";

export const pointingPairs = () => {
  const notes = useBoardStore.getState().notes;

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
          const idxByRow = getIdxByRow(isSameRowResult);

          const noteNeedChange = idxByRow
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            const highlightCellIdx = new Set<number>();
            idxByRow.forEach((idx) => highlightCellIdx.add(idx));
            getIdxByBlock(blockIdx).forEach((idx) => highlightCellIdx.add(idx));
            const setNotes: ActionSetNotes = [];
            noteNeedChange.forEach((pos) => {
              const oldNotes = notes[pos];
              setNotes.push({
                position: pos,
                notes: oldNotes.filter((note) => note !== num), // delete num
              });
            });
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "block-row",
                typeDetail: blockIdx,
                notePositions: noteNeedChange,
                number: num,
                setNotes,
                highlightCellIdx: Array.from(highlightCellIdx),
              },
            };
          }
        }

        const isSameColResult = isSameCol(pos1, pos2);
        if (isSameColResult !== false) {
          const idxByCol = getIdxByCol(isSameColResult);
          const noteNeedChange = idxByCol
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            const highlightCellIdx = new Set<number>();
            idxByCol.forEach((idx) => highlightCellIdx.add(idx));
            getIdxByBlock(blockIdx).forEach((idx) => highlightCellIdx.add(idx));
            const setNotes: ActionSetNotes = [];
            noteNeedChange.forEach((pos) => {
              const oldNotes = notes[pos];
              setNotes.push({
                position: pos,
                notes: oldNotes.filter((note) => note !== num), // delete num
              });
            });
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "block-col",
                typeDetail: blockIdx,
                notePositions: noteNeedChange,
                number: num,
                setNotes,
                highlightCellIdx: Array.from(highlightCellIdx),
              },
            };
          }
        }
      }
    }
  }

  // col vs block
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
          const idxByBlock = getIdxByBlock(isSameBlockResult);
          const noteNeedChange = idxByBlock
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            const highlightCellIdx = new Set<number>();
            idxByBlock.forEach((idx) => highlightCellIdx.add(idx));
            getIdxByCol(colIdx).forEach((idx) => highlightCellIdx.add(idx));
            const setNotes: ActionSetNotes = [];
            noteNeedChange.forEach((pos) => {
              const oldNotes = notes[pos];
              setNotes.push({
                position: pos,
                notes: oldNotes.filter((note) => note !== num), // delete num
              });
            });
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "col-block",
                typeDetail: colIdx,
                notePositions: noteNeedChange,
                number: num,
                setNotes,
                highlightCellIdx: Array.from(highlightCellIdx),
              },
            };
          }
        }
      }
    }
  }

  // row vs block
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
          const idxByBlock = getIdxByBlock(isSameBlockResult);
          const noteNeedChange = idxByBlock
            // filter other positions
            .filter((idx) => !realPositions.includes(idx))
            // filter note that includes num
            .filter((idx) => notes[idx].includes(num));

          if (noteNeedChange.length > 0) {
            const highlightCellIdx = new Set<number>();
            idxByBlock.forEach((idx) => highlightCellIdx.add(idx));
            getIdxByRow(rowIdx).forEach((idx) => highlightCellIdx.add(idx));
            const setNotes: ActionSetNotes = [];
            noteNeedChange.forEach((pos) => {
              const oldNotes = notes[pos];
              setNotes.push({
                position: pos,
                notes: oldNotes.filter((note) => note !== num), // delete num
              });
            });
            return {
              type: ETechnique.pointingPairs,
              payload: {
                type: "row-block",
                typeDetail: rowIdx,
                notePositions: noteNeedChange,
                number: num,
                setNotes,
                highlightCellIdx: Array.from(highlightCellIdx),
              },
            };
          }
        }
      }
    }
  }

  return null;
};
