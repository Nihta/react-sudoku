import { reCalculateBoard } from "../utils/reCalculateBoard";
import { setCellValue } from "./actionInputCell";
import { saveBoardState } from "./actionUndo";
import { useBoardStore } from "./useBoard";

export const actionDelete = () => {
  // if no cell selected, do nothing
  const selectedCell = useBoardStore.getState().selectedCell;
  if (selectedCell === undefined) {
    return;
  }

  // if cell is origin, do nothing
  const cells = useBoardStore.getState().cells;
  const cell = cells[selectedCell];
  if (cell.isOrigin) {
    return;
  }

  // delete cell value
  saveBoardState();
  setCellValue({ idx: selectedCell, value: null });
  reCalculateBoard();
};
