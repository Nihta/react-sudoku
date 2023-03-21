import { PuzzleData } from "../types/sudokuTypes";
import { CellState } from "../zustand/useSudokuStore";

/**
 * Sudoku: convert puzzle from string to array
 * @param puzzle 0006000801020005...
 */
export const convertPuzzle = (puzzleData: PuzzleData) => {
  const [puzzle] = puzzleData;
  const cells: Record<string, CellState> = {};
  let cellEmpty = 0;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = parseInt(puzzle[row * 9 + col], 10);
      const isOrigin = value !== 0;

      if (isOrigin) {
        cellEmpty++;
      }

      cells[`${row}${col}`] = {
        value: value || null,
        status: "",
        selected: false,
        isOrigin,
      };
    }
  }

  return { cells, cellEmpty };
};
