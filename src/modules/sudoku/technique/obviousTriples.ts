import { ETechnique } from "../../../types/technique.type";
import {
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../../../utils/sudoku/utils";
import { useBoardStore } from "../stores/useBoard";

/**
 * "Obvious triples" technique
 */
export const obviousTriples = () => {
  const notes = useBoardStore.getState().notes;

  const commonHandler = (
    arrIdx: number[],
    type: "row" | "col" | "block",
    typeIdx: number
  ) => {
    const arrNote = arrIdx.map((idx) => notes[idx]);

    // find obvious Triples in arrNote
    for (let i = 0; i < arrNote.length; i++) {
      /** First note */
      const first = arrNote[i];
      if (first.length !== 2) {
        continue;
      }

      for (let j = i + 1; j < arrNote.length; j++) {
        /** Second note */
        const second = arrNote[j];
        if (second.length !== 2) {
          continue;
        }

        for (let k = j + 1; k < arrNote.length; k++) {
          /** Third note */
          const third = arrNote[k];
          if (third.length !== 2) {
            continue;
          }

          // Check if they are the same
          const triple = [...first, ...second, ...third];
          const setTriple = new Set(triple);

          if (setTriple.size === 3) {
            const tripleUnique = Array.from(setTriple);
            tripleUnique.sort();

            const noteNeedChange = arrIdx
              .filter((idx) => notes[idx] && notes[idx].length > 2)
              .filter((idx) =>
                tripleUnique.some((t) => notes[idx].includes(t))
              );

            if (noteNeedChange.length !== 0) {
              const blockRelated: number[] = [];
              const colRelated: number[] = [];
              const rowRelated: number[] = [];

              if (type === "block") {
                blockRelated.push(typeIdx);
              }

              if (type === "col") {
                colRelated.push(typeIdx);
              }

              if (type === "row") {
                rowRelated.push(typeIdx);
              }

              return {
                type: ETechnique.obviousTriples,
                payload: {
                  detail: { type: type, value: typeIdx },
                  triple: tripleUnique,
                  /** Note positions need to be changed */
                  notes: noteNeedChange,
                  blockRelated,
                  colRelated,
                  rowRelated,
                },
              };
            }
          }
        }
      }
    }

    return null;
  };

  // col
  for (let col = 0; col < 9; col++) {
    const arrIdx = getIdxByCol(col);
    const res = commonHandler(arrIdx, "col", col);
    if (res) {
      return res;
    }
  }

  // row
  for (let row = 0; row < 9; row++) {
    const arrIdx = getIdxByRow(row);
    const res = commonHandler(arrIdx, "row", row);
    if (res) {
      return res;
    }
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    const res = commonHandler(arrIdx, "block", blockIdx);
    if (res) {
      return res;
    }
  }

  return null;
};
