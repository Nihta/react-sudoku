import { useSelector } from "react-redux";

import { Pos } from "../sudokuSlice";
import { getKeyCellFromPos } from "../utils";
import { RootState } from "../../../configs/store";

export const useCell = (pos: Pos) => {
  const cellKey = getKeyCellFromPos(pos);
  return useSelector((state: RootState) => state.sudoku.cells[cellKey]);
};

export const useGameState = () => {
  return useSelector((state: RootState) => state.sudoku.gameState);
};
