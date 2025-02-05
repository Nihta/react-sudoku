import { Cells } from "../../modules/sudoku/sudokuTypes.ts";
import { countElements } from "../arrayUtils";

export const countConflict = (cells: Cells): number => {
  return countElements(cells, (cell) => cell.status === "conflict");
};

export const countEmpty = (cells: Cells): number => {
  return countElements(cells, (cell) => !cell.value);
};
