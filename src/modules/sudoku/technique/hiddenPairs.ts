import { ETechnique } from "../../../types/technique.type";
import {
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../../../utils/sudoku/utils";
import { useBoardStore } from "../stores/useBoard";
import { ActionSetNotes } from "../types";

function findHiddenPairs(notes: number[][]): {
  pair: [number, number];
  positions: [number, number];
} | null {
  if (notes.length !== 9) {
    throw new Error("The input must have exactly 9 cells");
  }

  const numberPositions = new Map<number, number[]>();

  notes.forEach((cell, cellIndex) => {
    cell.forEach((num) => {
      if (!numberPositions.has(num)) {
        numberPositions.set(num, []);
      }
      numberPositions.get(num)?.push(cellIndex);
    });
  });

  const candidateNumbers: number[] = [];
  numberPositions.forEach((positions, num) => {
    if (positions.length === 2) {
      candidateNumbers.push(num);
    }
  });

  for (let i = 0; i < candidateNumbers.length - 1; i++) {
    for (let j = i + 1; j < candidateNumbers.length; j++) {
      const num1 = candidateNumbers[i];
      const num2 = candidateNumbers[j];

      const positions1 = numberPositions.get(num1) || [];
      const positions2 = numberPositions.get(num2) || [];

      if (
        positions1.length === 2 &&
        positions2.length === 2 &&
        positions1[0] === positions2[0] &&
        positions1[1] === positions2[1]
      ) {
        const pos1 = positions1[0];
        const pos2 = positions1[1];

        const isHidden = notes.every((cell, index) => {
          if (index !== pos1 && index !== pos2) {
            return !cell.includes(num1) && !cell.includes(num2);
          }
          return true;
        });

        const positions = [pos1, pos2].sort((a, b) => a - b);

        if (isHidden) {
          return {
            pair: [num1, num2] as [number, number],
            positions: positions as [number, number],
          };
        }
      }
    }
  }

  return null;
}

export const hiddenPairs = () => {
  const notes = useBoardStore.getState().notes;

  const commonHandel = (
    arrIdx: number[],
    type: "row" | "col" | "block",
    typeIdx: number
  ) => {
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const found = findHiddenPairs(arrNote);

    if (found) {
      /** Mapping to real index of notes */
      const foundPositions = found.positions.map((pos) => arrIdx[pos]);
      const [first, second] = foundPositions;

      // * ensure: at least one note has more than 2 notes
      if (notes[first].length > 2 || notes[second].length > 2) {
        const setNotes: ActionSetNotes = [];
        foundPositions.forEach((pos) => {
          const oldNotes = notes[pos];
          setNotes.push({
            position: pos,
            notes: oldNotes.filter(
              (note) => note === found.pair[0] || note === found.pair[1]
            ),
          });
        });

        return {
          type: ETechnique.hiddenPairs,
          payload: {
            type: type,
            typeDetail: typeIdx,
            notePositions: foundPositions,
            pair: found.pair,
            highlightCellIdx: foundPositions,
            setNotes,
          },
        };
      }
    }

    return null;
  };

  // row
  for (let row = 0; row < 9; row++) {
    const arrIdx = getIdxByRow(row);
    const res = commonHandel(arrIdx, "row", row);
    if (res) {
      return res;
    }
  }

  // col
  for (let col = 0; col < 9; col++) {
    const arrIdx = getIdxByCol(col);
    const res = commonHandel(arrIdx, "col", col);
    if (res) {
      return res;
    }
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    const res = commonHandel(arrIdx, "block", blockIdx);
    if (res) {
      return res;
    }
  }

  return null;
};
