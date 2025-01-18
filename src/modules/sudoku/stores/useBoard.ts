/* eslint-disable @typescript-eslint/no-unused-vars */
import { produce } from "immer";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty, Notes, PuzzleData } from "../../../types/sudokuTypes";
import { CellState } from "../components/Cell";
import { reCalculateBoard } from "../utils/reCalculateBoard";

type HistoryRecord = Pick<SudokuState, "cells" | "notes" | "selectedCell">;

type HintActions = {
  title: string;
  setValues?: [{ position: number; value: number }];
};

export interface SudokuState {
  puzzle?: PuzzleData;
  selectedCell?: number;
  cells: CellState[];
  cellEmpty: number;
  cellConflict: number;
  history: HistoryRecord[];
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

export const actionInputCell = (value: number, isOrigin = false) => {
  const selectedCell = useBoardStore.getState().selectedCell;
  if (selectedCell === undefined) {
    console.warn("No cell selected");
    return;
  }

  const cells = useBoardStore.getState().cells;
  const cell = cells[selectedCell];
  // todo: change name cell.fixed
  if (cell.isOrigin) {
    console.info("Can not change origin cell");
    return;
  }

  // Note mode
  if (useBoardStore.getState().mode === "note") {
    const oldCellNote = useBoardStore.getState().notes[selectedCell];

    //  if note already exist, remove it
    const newCellNote = oldCellNote.includes(value)
      ? oldCellNote.filter((v) => v !== value)
      : [...oldCellNote, value];

    useBoardStore.setState({
      notes: produce(useBoardStore.getState().notes, (draft) => {
        draft[selectedCell] = newCellNote;
      }),
      cells: produce(cells, (draft) => {
        draft[selectedCell].value = null;
      }),
    });

    reCalculateBoard();
    return;
  }

  // delete if same value
  if (cell.value === value && !isOrigin) {
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.cells[selectedCell].value = null;
        draft.notes[selectedCell] = [];
      })
    );

    reCalculateBoard();
    return;
  }

  // set cell value
  useBoardStore.setState(
    produce((draft: SudokuState) => {
      draft.cells[selectedCell].value = value;
      draft.notes[selectedCell] = [];
      if (isOrigin) {
        draft.cells[selectedCell].isOrigin = true;
      }
    })
  );

  reCalculateBoard();
};

// -----------------------------------------------------------------------------

export const actNumpadPress = (value: number) => {
  actionInputCell(value);
};

export const actionDelete = () => {
  // if no cell selected, do nothing
  const selectedCell = useBoardStore.getState().selectedCell;
  if (selectedCell === undefined) {
    return;
  }

  // if cell is origin, do nothing
  const cells = useBoardStore.getState().cells;
  const cell = cells[selectedCell];
  if (cell.isOrigin) {
    return;
  }

  // set cell value to null and re-highlight
  useBoardStore.setState(
    produce((draft: SudokuState) => {
      draft.cells[selectedCell].value = null;
      draft.notes[selectedCell] = [];
    })
  );

  reCalculateBoard();
};

export const actionUndo = () => {
  toast("Undo is not implemented yet");
};

export const actionNote = () => {
  const mode = useBoardStore.getState().mode;
  useBoardStore.setState({ mode: mode === "note" ? "normal" : "note" });
};

export const actionClickCell = (row: number, col: number) => {
  useBoardStore.setState({ selectedCell: row * 9 + col });
  reCalculateBoard();
};
