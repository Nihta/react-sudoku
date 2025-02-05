import { Notes } from "../sudokuTypes.ts";
import { ETechnique } from "../technique.type.ts";
import { arraysEqual } from "../../../utils/arrayUtils";
import {
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../../../utils/sudoku/utils";
import { useBoardStore } from "../stores/useBoard";
import { ActionSetNotes } from "../types";

export const obviousPairs = () => {
  // 81 array or number
  const notes = useBoardStore.getState().notes;

  const commonHandel = (
    arrIdx: number[],
    type: "row" | "col" | "block",
    typeIdx: number
  ) => {
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const founds = getObviousPairs(arrNote);
    for (const found of founds) {
      const realFoundIdx = found.positions.map((pos) => arrIdx[pos]);

      const arrNoteNeedUpdate = arrIdx.filter((idx) => {
        // skip found positions
        if (realFoundIdx.includes(idx)) {
          return false;
        }

        // if note include one of the pair, then remove it
        const note = notes[idx];
        if (note.includes(found.pair[0]) || note.includes(found.pair[1])) {
          return true;
        }

        return false;
      });

      if (arrNoteNeedUpdate.length > 0) {
        const setNotes: ActionSetNotes = [];
        arrNoteNeedUpdate.forEach((pos) => {
          const oldNotes = notes[pos];
          setNotes.push({
            position: pos,
            notes: oldNotes.filter(
              (note) => note !== found.pair[0] && note !== found.pair[1]
            ),
          });
        });
        return {
          type: ETechnique.obviousPairs,
          payload: {
            type: type,
            typeDetail: typeIdx,
            notePositions: arrNoteNeedUpdate,
            pair: found.pair,
            highlightCellIdx: arrNoteNeedUpdate,
            setNotes,
          },
        };
      }
    }
  };

  // col
  for (let col = 0; col < 9; col++) {
    const arrIdx = getIdxByCol(col);
    const res = commonHandel(arrIdx, "col", col);
    if (res) {
      return res;
    }
  }

  // throw new Error("Function not implemented.");

  // row
  for (let row = 0; row < 9; row++) {
    const arrIdx = getIdxByRow(row);
    const res = commonHandel(arrIdx, "row", row);
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

function getObviousPairs(notes: Notes) {
  // check len
  if (notes.length !== 9) {
    throw new Error("Invalid notes length, it should be 9");
  }

  type Found = {
    positions: [number, number];
    pair: [number, number];
  };

  const result: Found[] = [];

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
        if (currentNotes.length !== 2) {
          throw new Error("Invalid notes length, it should be 2");
        }

        result.push({
          positions: [pos1, pos2],
          pair: currentNotes as [number, number],
        });
      }
    }
  }

  return result;
}
