/**
 * First element is the puzzle, second element is the solution
 */
export type PuzzleData = [string, string];

export type CellState = {
  value: number | null;
  status:
    | ""
    | "normal"
    | "conflict"
    | "high-light"
    | "high-light-number"
    | "number-blink";
  selected: boolean;
  isOrigin: boolean;
};

export type Cells = Array<CellState>;

export type Position = {
  row: number;
  col: number;
};

// export type NoteValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Note = number[];
// export type Note = NoteValue[];
export type Notes = Note[];

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "evil";
