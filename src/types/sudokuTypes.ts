/**
 * First element is the puzzle, second element is the solution
 */
export type PuzzleData = [string, string];

export type CellState = {
  value: number | null;
  status: "" | "normal" | "conflict" | "high-light" | "high-light-number";
  selected: boolean;
  isOrigin: boolean;
};

export type Cells = Array<CellState>;

export type Position = {
  row: number;
  col: number;
};

export type Note = number[];
export type Notes = Note[];

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "evil";
