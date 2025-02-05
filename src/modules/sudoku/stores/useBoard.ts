/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty, Notes, PuzzleData } from "../sudokuTypes.ts";
import { CellState } from "../components/Cell";
import { reCalculateBoard } from "../utils/reCalculateBoard";
import { ActionSetNotes } from "../types";
import { produce } from "immer";

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
  highlightMode: "normal" | "supper";
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
      highlightMode: "normal",
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
  const cellIdx = row * 9 + col;
  useBoardStore.setState(
    produce((draft: SudokuState) => {
      draft.selectedCell = cellIdx;
      draft.cells[cellIdx].selected = true;
    })
  );
  reCalculateBoard();
};
