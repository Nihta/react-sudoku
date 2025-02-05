import { CellState, PuzzleData } from "../../modules/sudoku/sudokuTypes.ts";

/**
 * It takes a string of 81 characters, and returns a tuple of two strings,
 * each of which is 81 characters long.
 *
 * @param {string} data - The string of the puzzle.
 * @returns An array of two strings: the first is the puzzle, the second is the solution.
 * @example FB798D1ECHA3BEGIFDEIDF1CG82DEAC7H2IF7364B9EAH9H2E6AD37CF9G45H2117EH32649248A963GE
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
 * It converts a puzzle string into an array of cells and the number of
 * empty cells.
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
 * Given a puzzle and a position, return the correct number for that position.
 */
export const getCorrectNumber = (puzzle: PuzzleData, pos: number): number => {
  const [, solution] = puzzle;
  return parseInt(solution[pos], 10);
};
