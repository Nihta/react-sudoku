import { PuzzleData } from "../../types/sudokuTypes";
import { CellState } from "./components/Cell";

/**
 * It converts a puzzle string into an array of cells and the number of
 * empty cells.
 *
 * @version 2
 */
export const convertPuzzle = (puzzleData: PuzzleData) => {
  const [puzzle] = puzzleData;
  const cells: CellState[] = [];
  let cellEmpty = 81;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = parseInt(puzzle[row * 9 + col], 10);
      const isOrigin = value !== 0;

      if (isOrigin) {
        cellEmpty--;
      }

      cells[row * 9 + col] = {
        value: value || null,
        status: "normal",
        selected: false,
        isOrigin,
      };
    }
  }

  return { cells, cellEmpty };
};

const getOriginCells = (cells: CellState[]) => {
  return cells.map((cell) => {
    return cell.isOrigin ? cell.value : 0;
  });
};

/**
 *
 * @version 2
 */
export const preHandle = (allCells: CellState[]) => {
  const cells = getOriginCells(allCells);

  const rows = new Array(9).fill(null).map(() => new Map<number, number>());
  const cols = new Array(9).fill(null).map(() => new Map<number, number>());
  const blocks = new Array(9).fill(null).map(() => new Map<number, number>());

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const idx = i * 9 + j;
      const value = cells[idx];
      if (value) {
        rows[i].set(value, idx);
        cols[j].set(value, idx);
        blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].set(value, idx);
      }
    }
  }

  return { rows, cols, blocks, cells };
};
