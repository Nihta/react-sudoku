import { Cells, CellState, Position, PuzzleData } from "../types/sudokuTypes";

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
export const getCorrectNumber = (puzzle: PuzzleData, pos: Position) => {
  const [, solution] = puzzle;
  return parseInt(solution[pos.row * 9 + pos.col], 10);
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

export const isSamePos = (posA: Position, posB: Position) => {
  return posA.row === posB.row && posA.col === posB.col;
};

export const isSameRow = (posA: Position, posB: Position) => {
  return posA.row === posB.row;
};

export const isSameCol = (posA: Position, posB: Position) => {
  return posA.col === posB.col;
};

export const isSameRegion = (posA: Position, posB: Position) => {
  return (
    Math.trunc(posA.row / 3) === Math.trunc(posB.row / 3) &&
    Math.trunc(posA.col / 3) === Math.trunc(posB.col / 3)
  );
};

// Sudoku: highlight -----------------------------------------------------------

type MapNumberCellIdx = Record<number, number>;

const hightLightRelated = (cells: Cells, posSelected: Position) => {
  const { row, col } = posSelected;
  const selectedVal = cells[row * 9 + col].value;

  cells.forEach((cell, idx) => {
    // Hightliht related cell (same row, same col, same region)
    const currPos = { row: Math.trunc(idx / 9), col: idx % 9 };
    const isRelated =
      cell.status !== "conflict" &&
      (isSameRow(currPos, posSelected) ||
        isSameCol(currPos, posSelected) ||
        isSameRegion(currPos, posSelected));
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
const supperHighLightRelated = (cells: Cells, pos: Position) => {
  const val = cells[pos.row * 9 + pos.col].value;
  if (!val) return;
  // high light all origin cell
  cells.forEach((cell) => {
    if (cell.isOrigin) {
      cell.status = "high-light";
    }
  });
  cells.forEach((cell, idx) => {
    if (cell.value === val) {
      const row = Math.trunc(idx / 9);
      const col = idx % 9;
      hightLightRelated(cells, { row, col });
      cell.status = "high-light-number";
    }
  });
};

const SUPPER_HIGH_LIGHT = true;
export const highLight = (cells: Cells, posSelected: Position) => {
  // Clear all highlight
  cells.forEach((cell) => {
    cell.status = "normal";
  });

  if (SUPPER_HIGH_LIGHT) {
    supperHighLightRelated(cells, posSelected);
  } else {
    hightLightRelated(cells, posSelected);
  }

  highLightConflict(cells);

  return cells;
};
