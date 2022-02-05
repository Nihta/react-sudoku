import { PosType } from "../sudokuSlice";
import { getKeyCellFromPos } from "../utils";
import { useTypedSelector } from "../../../common/hooks/reduxHooks";

export const useCell = (pos: PosType) => {
  const cellKey = getKeyCellFromPos(pos);
  return useTypedSelector((state) => state.sudoku.cells[cellKey]);
};
