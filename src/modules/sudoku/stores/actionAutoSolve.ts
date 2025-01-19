import toast from "react-hot-toast";
import { ETechnique } from "../../../types/technique.type";
import { getCellPos } from "../../../utils/sudoku";
import { lastRemainingCell } from "../technique/lastRemainingCell";
import { preHandle } from "../utils";
import { setCellValue } from "./actionInputCell";
import { actionClickCell, SudokuState, useBoardStore } from "./useBoard";
import { getNewNotes } from "./actionNote";
import { produce } from "immer";

export const actionAutoSolve = async () => {
  try {
    while (true) {
      const cells = useBoardStore.getState().cells;
      const { rows, cols, cells: orgCells, blocks } = preHandle(cells);
      const res = lastRemainingCell({ cells: orgCells, rows, cols, blocks });
      if (res && res.type === ETechnique.lastRemainingCell) {
        const { payload } = res;
        setCellValue({
          idx: payload.position,
          value: payload.value,
          origin: true,
          selected: true,
        });
        const { row, col } = getCellPos(payload.position);
        actionClickCell(row, col);

        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        break;
      }
    }

    // fill notes
    const { change, newNotes, arrIdx } = getNewNotes();
    if (change > 0) {
      useBoardStore.setState(
        produce((draft: SudokuState) => {
          arrIdx.forEach((idx) => {
            draft.notes[idx] = newNotes[idx];
          });
        })
      );
    }
  } catch (error) {
    toast.error("Error in when solving the puzzle");
    console.error("Error in actionAutoSolve", error);
  }
};
