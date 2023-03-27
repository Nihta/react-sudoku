import { easyPuzzles, hardPuzzles, mediumPuzzles } from "../data/sudokuPuzzles";
import { Cells, CellState, Position, PuzzleData } from "../types/sudokuTypes";
import { useGameStore } from "../zustand/useGameStore";

/**
 * Convert time to string
 */
export const convertTime = (time: number) => {
  return (
    `${Math.floor(time / 60)}`.padStart(2, "0") +
    ":" +
    `${time % 60}`.padStart(2, "0")
  );
};

/**
 * Sudoku: convert puzzle from string to array
 * @param puzzleData 0006000801020005...
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
        status: "",
        selected: false,
        isOrigin,
      };
    }
  }

  return { cells, cellEmpty };
};

/**
 * Sudoku: get correct number from solution
 * @param puzzle
 * @param pos
 */
export const getCorrectNumber = (puzzle: PuzzleData, pos: number) => {
  const [, solution] = puzzle;
  return parseInt(solution[pos], 10);
};

/**
 * Count conflict cell in sudoku cells (count cell with status is "conflict")
 */
export const countConflict = (cells: Cells): number => {
  return cells.reduce((acc, cell) => {
    if (cell.status === "conflict") {
      acc++;
    }
    return acc;
  }, 0);
};

export const countEmpty = (cells: Cells): number => {
  return cells.reduce((acc, cell) => {
    if (!cell.value) {
      acc++;
    }
    return acc;
  }, 0);
};

export const isSameRow = (posA: number, posB: number) => {
  const rowA = Math.trunc(posA / 9);
  const rowB = Math.trunc(posB / 9);
  return rowA === rowB;
};

export const isSameCol = (posA: number, posB: number) => {
  const colA = posA % 9;
  const colB = posB % 9;
  return colA === colB;
};

export const isSameRegion = (posA: number, posB: number) => {
  const rowA = Math.trunc(posA / 9);
  const rowB = Math.trunc(posB / 9);
  const colA = posA % 9;
  const colB = posB % 9;
  return (
    Math.trunc(rowA / 3) === Math.trunc(rowB / 3) &&
    Math.trunc(colA / 3) === Math.trunc(colB / 3)
  );
};

// Sudoku: highlight -----------------------------------------------------------

type MapNumberCellIdx = Record<number, number>;

const highLightRelated = (cells: Cells, pos: number) => {
  const selectedVal = cells[pos].value;

  cells.forEach((cell, _pos) => {
    // Highlight related cell (same row, same col, same region)
    const isRelated =
      cell.status !== "conflict" &&
      (isSameRow(_pos, pos) || isSameCol(_pos, pos) || isSameRegion(_pos, pos));
    if (isRelated) {
      cell.status = "high-light";
      return;
    }

    // Highlight same number
    if (selectedVal && cell.value && cell.value === selectedVal) {
      cell.status = "high-light-number";
      return;
    }
  });
};

const highLightConflictUtil = (
  cells: Cells,
  pos: Position,
  hash: MapNumberCellIdx
) => {
  const cellIdx = pos.row * 9 + pos.col;
  const cell = cells[cellIdx];
  const cellValue = cell.value;

  if (!cellValue) return;

  if (hash[cellValue]) {
    cell.status = "conflict";
    cells[hash[cellValue]].status = "conflict";
  }
  hash[cellValue] = cellIdx;
};

const highLightConflict = (cells: Cells) => {
  // Find conflict in col
  for (let row = 0; row < 9; row++) {
    const hash: MapNumberCellIdx = {};
    for (let col = 0; col < 9; col++) {
      highLightConflictUtil(cells, { row, col }, hash);
    }
  }

  // Find conflict in row
  for (let col = 0; col < 9; col++) {
    const hash: MapNumberCellIdx = {};
    for (let row = 0; row < 9; row++) {
      highLightConflictUtil(cells, { row, col }, hash);
    }
  }

  // Find conflict in region 3x3
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      const hash: MapNumberCellIdx = {};
      for (let i = 0; i < 9; i++) {
        highLightConflictUtil(
          cells,
          {
            row: row + Math.trunc(i / 3),
            col: col + (i % 3),
          },
          hash
        );
      }
    }
  }
};

/**
 * Very helpful function to highlight related cell
 */
const supperHighLightRelated = (cells: Cells, pos: number) => {
  const val = cells[pos].value;
  if (!val) return;
  // high light all origin cell
  cells.forEach((cell) => {
    if (cell.isOrigin) {
      cell.status = "high-light";
    }
  });
  cells.forEach((cell, _pos) => {
    if (cell.value === val) {
      highLightRelated(cells, _pos);
      cell.status = "high-light-number";
    }
  });
};

const SUPPER_HIGH_LIGHT = false;
export const highLight = (cells: Cells, posSelected: number) => {
  // Clear all highlight
  cells.forEach((cell) => {
    cell.status = "normal";
  });

  if (SUPPER_HIGH_LIGHT) {
    supperHighLightRelated(cells, posSelected);
  } else {
    highLightRelated(cells, posSelected);
  }

  highLightConflict(cells);

  return cells;
};

const getRandomElm = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getPuzzle = (): PuzzleData => {
  const difficulty = useGameStore.getState().difficulty;
  switch (difficulty) {
    case "easy":
      return getRandomElm(easyPuzzles);
    case "medium":
      return getRandomElm(mediumPuzzles);
    case "hard":
      return getRandomElm(hardPuzzles);
    default:
      return getRandomElm(easyPuzzles);
  }
};
