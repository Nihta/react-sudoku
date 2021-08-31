import { useSelector } from "react-redux";
import { Pos } from "../sudokuSlice";
import { RootState } from "../../../configs/store";
import { getKeyCellFromPos } from "../utils";

export const useCell = (pos: Pos) => {
  const cellKey = getKeyCellFromPos(pos);
  return useSelector((state: RootState) => state.sudoku.cells[cellKey]);
};
