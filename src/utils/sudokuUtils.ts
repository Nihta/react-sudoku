import { Cells, CellState, PuzzleData } from "../types/sudokuTypes";
import { useGameStore } from "../zustand/useGameStore";
import { dataPuzzles } from "../data/sudokuPuzzles";

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

export const getPuzzle = (): PuzzleData => {
  const difficulty = useGameStore.getState().difficulty;
  return decodeSudokuPuzzle(getRandomElm(dataPuzzles[difficulty]));
};

/**
 * ! Không kiểm tra dữ liệu có hợp lệ hay không
 *
 */
export function decodeSudokuPuzzle(data: string): PuzzleData {
  const NUMBER_CHAR = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const MAP_CHAR_NUMBER: Record<string, string> = {
    A: "1",
    B: "2",
    C: "3",
    D: "4",
    E: "5",
    F: "6",
    G: "7",
    H: "8",
    I: "9",
  };

  const puzzle: string[] = [];
  const solution: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (NUMBER_CHAR.includes(char)) {
      puzzle.push(char);
      solution.push(char);
    } else {
      puzzle.push("0");
      solution.push(MAP_CHAR_NUMBER[char]);
    }
  }

  return [puzzle.join(""), solution.join("")];
}

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

export const getRandomElm = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Sudoku: highlight -----------------------------------------------------------

function getBlockIdx(row: number, col: number) {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function getCellPos(idx: number) {
  const row = Math.floor(idx / 9);
  const col = idx % 9;
  return {
    row,
    col,
    block: getBlockIdx(row, col),
  };
}

function getBoardInfo(cells: Cells) {
  const cellValues: number[] = cells.map((cell) => cell.value ?? 0);

  const rows = new Array(9).fill(null).map(() => new Map<number, number>());
  const cols = new Array(9).fill(null).map(() => new Map<number, number>());
  const blocks = new Array(9).fill(null).map(() => new Map<number, number>());

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const idx = i * 9 + j;
      const value = cellValues[idx];
      if (value) {
        rows[i].set(value, (rows[i].get(value) || 0) + 1);
        cols[j].set(value, (cols[j].get(value) || 0) + 1);
        const blockIdx = getBlockIdx(i, j);
        blocks[blockIdx].set(value, (blocks[blockIdx].get(value) || 0) + 1);
      }
    }
  }

  return {
    rows,
    cols,
    blocks,
    cellValues: cellValues,
  };
}

/**
 * Highlight related cell
 * @param cells
 * @param pos
 */
function normalHighLight(cells: Cells, pos: number) {
  const { cols, rows, blocks } = getBoardInfo(cells);

  // get current pos info
  const { row: curRow, col: curCol, block: curBlock } = getCellPos(pos);

  const selectedVal = cells[pos].value ?? 0;
  cells.forEach((cell, _pos) => {
    // clear all highlight
    cell.status = "normal";

    const { col, row, block } = getCellPos(_pos);
    // highlight related cell (same row, same col, same block)
    if (col === curCol || row === curRow || block === curBlock) {
      cell.status = "high-light";
    }

    // highlight same number
    if (selectedVal && cell.value === selectedVal) {
      cell.status = "high-light-number";
    }

    // highlight conflict
    if (cell.value) {
      if (
        (rows[row].get(cell.value) ?? 0) > 1 ||
        (cols[col].get(cell.value) ?? 0) > 1 ||
        (blocks[block].get(cell.value) ?? 0) > 1
      ) {
        cell.status = "conflict";
      }
    }
  });

  return cells;
}

/**
 * Supper highlight related cell
 *
 * @param cells
 * @param pos
 */
function supperHighLight(cells: Cells, pos: number) {
  const { cols, rows, blocks } = getBoardInfo(cells);

  // get current pos info
  const selectedVal = cells[pos].value ?? 0;

  if (!selectedVal) {
    normalHighLight(cells, pos);
  }

  cells.forEach((cell, _pos) => {
    const { col, row, block } = getCellPos(_pos);

    // Un-highlight all cell
    cell.status = "normal";

    // Highlight all related cell
    // prettier-ignore
    if (cell.isOrigin || rows[row].has(selectedVal) || cols[col].has(selectedVal) || blocks[block].has(selectedVal)) {
      cell.status = "high-light";
    }

    // highlight same number
    if (selectedVal && cell.value === selectedVal) {
      cell.status = "high-light-number";
    }

    // highlight conflict
    if (cell.value) {
      // prettier-ignore
      if ((rows[row].get(cell.value) ?? 0) > 1 || (cols[col].get(cell.value) ?? 0) > 1 || (blocks[block].get(cell.value) ?? 0) > 1) {
        cell.status = "conflict";
      }
    }
  });
}

export const highLight = (cells: Cells, posSelected: number) => {
  const supperMode = useGameStore.getState().supperHighLight;
  if (supperMode) {
    supperHighLight(cells, posSelected);
  } else {
    normalHighLight(cells, posSelected);
  }
};
