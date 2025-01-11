import { create } from "zustand";
import { CellState, Notes, PuzzleData } from "../types/sudokuTypes";
import { persist } from "zustand/middleware";

type HistoryRecord = Pick<SudokuState, "cells" | "notes" | "selectedCell">;

export interface SudokuState {
  puzzle?: PuzzleData;
  selectedCell?: number;
  cells: Array<CellState>;
  cellEmpty: number;
  cellConflict: number;
  history: HistoryRecord[];
  notes: Notes;
  noteMode: boolean;
  /**
   * Count time use for solve puzzle
   */
  time: number;
}

const useSudokuStore = create<SudokuState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set, _get) => ({
      puzzle: undefined,
      noteMode: false,
      selectedCell: undefined,
      history: [],
      cells: [],
      cellEmpty: 81,
      cellConflict: 0,
      time: 0,
      notes: Array.from({ length: 81 }, () => []),
    }),
    {
      name: "sudoku-storage",
    }
  )
);

export default useSudokuStore;
