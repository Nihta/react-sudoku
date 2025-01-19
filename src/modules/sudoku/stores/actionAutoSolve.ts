import toast from "react-hot-toast";
import { ETechnique } from "../../../types/technique.type";
import { lastRemainingCell } from "../technique/lastRemainingCell";
import { preHandle } from "../utils";
import { useBoardStore } from "./useBoard";
import { setCellValue } from "./actionInputCell";
import { reCalculateBoard } from "../utils/reCalculateBoard";

export const actionAutoSolve = () => {
  try {
    // while (true) {
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
      reCalculateBoard();
    } else {
      // break;
    }
    // }
  } catch (error) {
    toast.error("Error in when solving the puzzle");
    console.error("Error in actionAutoSolve", error);
  }
};
