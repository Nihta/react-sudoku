import { getKeyCellFromPos } from "../utils";
import useSudokuStore, { Position } from "../zustand/useSudokuStore";

export const useCell = (pos: Position) => {
  const cellKey = getKeyCellFromPos(pos);
  const cells = useSudokuStore.getState().cells;
  return cells[cellKey];
};
