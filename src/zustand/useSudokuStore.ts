import { create } from "zustand";
import { CellState, Notes, Position, PuzzleData } from "../types/sudokuTypes";
import { useGameStore } from "./useGameStore";
import { clickCell } from "./Sudoku";

/**
 * Pre handle action
 *
 * If game state is `won` or `paused`, return false
 */
export const canDoAction = () => {
  const gameState = useGameStore.getState().gameState;
  const setGameState = useGameStore.getState().setGameState;
  if (gameState === "won" || gameState === "paused") {
    // console.log("Can't do action");
    if (gameState === "paused") {
      setGameState("playing");
    }
    return false;
  }
  return true;
};

export interface SudokuState {
  puzzle?: PuzzleData;
  selectedCell?: number;
  cells: Array<CellState>;
  cellEmpty: number;
  cellConflict: number;
  history: {
    cells: SudokuState["cells"];
    notes: SudokuState["notes"];
    // * need same name (selectedCell)
    selectedCell: SudokuState["selectedCell"];
  }[];
  notes: Notes;
  noteMode: boolean;
  /**
   * Count time use for solve puzzle
   */
  time: number;
}

const useSudokuStore = create<SudokuState>()(() => ({
  puzzle: undefined,
  noteMode: false,
  selectedCell: undefined,
  history: [],
  cells: [],
  cellEmpty: 81,
  cellConflict: 0,
  time: 0,
  notes: Array.from({ length: 81 }, () => []),
}));

export default useSudokuStore;
