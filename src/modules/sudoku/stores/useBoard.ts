/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty, Notes, PuzzleData } from "../../../types/sudokuTypes";
import { CellState } from "../components/Cell";
import { reCalculateBoard } from "../utils/reCalculateBoard";
import { ActionSetNotes } from "../types";

type HintActions = {
  title: string;
  setValues?: [{ position: number; value: number }];
  setNotes?: ActionSetNotes;
};

export interface SudokuState {
  puzzle?: PuzzleData;
  selectedCell?: number;
  cells: CellState[];
  cellEmpty: number;
  cellConflict: number;
  notes: Notes;

  // hint
  highlightBlocks: number[];
  highlightRows: number[];
  highlightCols: number[];
  hintActions?: HintActions;

  mode: "normal" | "note" | "hint";
  difficulty?: Difficulty;
}

export const useBoardStore = create<SudokuState>()(
  persist(
    (_set) => ({
      puzzle: undefined,
      selectedCell: undefined,
      history: [],
      cells: [],
      cellEmpty: 81,
      cellConflict: 0,
      notes: Array.from({ length: 81 }, () => []),
      highlightBlocks: [],
      highlightRows: [],
      highlightCols: [],
      state: "none",
      mode: "normal",
    }),
    {
      name: "nihta-sudoku::board-storage",
    }
  )
);

export const setCells = (cells: CellState[]) => {
  useBoardStore.setState({ cells });
};

// -----------------------------------------------------------------------------

export const actionClickCell = (row: number, col: number) => {
  useBoardStore.setState({ selectedCell: row * 9 + col });
  reCalculateBoard();
};
