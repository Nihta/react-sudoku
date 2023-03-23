import { create } from "zustand";
import produce from "immer";
import {
  countConflict,
  getCellFromPos,
  getKeyCellFromPos,
  isSamePos,
} from "../utils";
import highLight from "../utils/highLight";
import { convertPuzzle, getCorrectNumber } from "../utils/sudokuUtils";
import { PuzzleData } from "../types/sudokuTypes";

export type CellState = {
  value: number | null;
  status: "" | "normal" | "conflict" | "high-light" | "high-light-number";
  selected: boolean;
  isOrigin: boolean;
};

export type Position = {
  row: number;
  col: number;
};

// export type Puzzle = (string | null)[][];

interface SudokuState {
  puzzle?: PuzzleData;
  selectedCell: Position | null;
  cells: Record<string, CellState>;
  cellEmpty: number;
  cellConflict: number;
  history: [Position, CellState["value"]][];
  /**
   * false: not solved
   * true: solved
   */
  gameState: boolean;
  setPuzzle: (puzzle: PuzzleData) => void;
  clickCell: (pos: Position) => void;
  inputCell: (newNumber: CellState["value"], ignoreUndo?: boolean) => void;
  deleteCell: (pos?: Position) => void;
  actionDelete: () => void;
  actionHint: () => void;
  actionUndo: () => void;
  /**
   * Keep length of history is less than 100
   */
  setHistory: (pos: Position, val: CellState["value"]) => void;
}

const useSudokuStore = create<SudokuState>()((set, get) => ({
  puzzle: undefined,
  selectedCell: null,
  history: [],
  cells: {},
  cellEmpty: 81,
  cellConflict: 0,
  gameState: false,
  setPuzzle: (puzzle) => {
    const { cells, cellEmpty } = convertPuzzle(puzzle);
    set({
      puzzle,
      cells,
      cellEmpty,
      cellConflict: countConflict(cells),
    });
  },
  clickCell: (pos: Position) => {
    set(
      produce((state) => {
        // If game state is win
        if (state.gameState) {
          return;
        }

        const posSelectedCellOld = state.selectedCell;
        const posSelectedCellNew = pos;
        // Nếu đã chọn một cell trước đó
        if (posSelectedCellOld) {
          // Nếu cell đang chọn là cell đã chọn trước đó thì bỏ qua
          if (isSamePos(posSelectedCellOld, posSelectedCellNew)) {
            return;
          }
          // Bỏ chọn cell cũ
          state.cells[getKeyCellFromPos(posSelectedCellOld)].selected = false;
        }

        // Chọn cell mới
        state.selectedCell = posSelectedCellNew;
        state.cells[getKeyCellFromPos(posSelectedCellNew)].selected = true;

        // Highlight lại
        const newCells = highLight(state.cells, posSelectedCellNew);
        state.cells = newCells;
      })
    );
  },
  /**
   * Điền giá trị vào một cell
   */
  inputCell: (newVal, ignoreUndo) => {
    set(
      produce((state: SudokuState) => {
        // If game state is win
        if (state.gameState) {
          return;
        }

        // If not selected cell
        const selectedCell = state.selectedCell;
        if (!selectedCell) return;

        const cellSelected = getCellFromPos(state.cells, selectedCell);

        // Nếu đó là cell gốc - không thể sửa
        if (cellSelected.isOrigin) return;

        // Cập nhật giá trị của cell
        const oldCellVal = cellSelected.value;

        // If new number is same old number, delete cell
        if (oldCellVal && newVal && oldCellVal === newVal) {
          cellSelected.value = null;
          state.cellEmpty++;
          if (!ignoreUndo) {
            state.setHistory(selectedCell, null);
          }
        } else {
          cellSelected.value = newVal;
          if (!ignoreUndo) {
            state.history.push([selectedCell, newVal]);
            state.setHistory(selectedCell, newVal);
          }
        }

        // If old number is null, cell empty decrease 1
        if (!oldCellVal) {
          state.cellEmpty--;
        }

        // HighLight lại
        highLight(state.cells, selectedCell);
        // Tính lại số lượng conflict
        state.cellConflict = countConflict(state.cells);

        // If all cells are filled and there are no conflicts, the game is won
        if (state.cellEmpty === 0 && state.cellConflict === 0) {
          state.gameState = true;
        }
      })
    );
  },
  /**
   * Delete value of selected cell
   */
  deleteCell: (pos?: Position) => {
    set(
      produce((state: SudokuState) => {
        // Can't delete cell when game win
        if (state.gameState) return;

        // Can't delete cell when not selected cell
        const posSelected = pos ? pos : state.selectedCell;
        if (!posSelected) return;

        // Can't delete cell origin
        const cell = getCellFromPos(state.cells, posSelected);
        if (cell.isOrigin) return;

        if (cell.value) {
          cell.value = null;
          state.cellEmpty++;
        }
      })
    );
  },
  actionDelete() {
    const { selectedCell, deleteCell } = useSudokuStore.getState();
    if (selectedCell) {
      deleteCell(selectedCell);
    }
  },
  actionHint() {
    set(
      produce((state: SudokuState) => {
        const { selectedCell, puzzle, cells } = state;

        if (!selectedCell || !puzzle) return;

        const cell = getCellFromPos(cells, selectedCell);
        if (cell.isOrigin) return;

        const correctNumber = getCorrectNumber(puzzle, selectedCell);
        cell.value = correctNumber;
        cell.isOrigin = true;
        state.cellEmpty--;
      })
    );
  },
  actionUndo() {
    const { selectedCell, history, clickCell, inputCell } = get();
    if (history.length === 0) return;

    const [pos, value] = history[history.length - 1];
    set({
      history: history.slice(0, history.length - 1),
    });

    clickCell(pos);
    // ignore save history (undo)
    inputCell(value, true);
  },
  setHistory(pos, val) {
    set(
      produce((state: SudokuState) => {
        state.history.push([pos, val]);
        if (state.history.length > 100) {
          state.history.shift();
        }
      })
    );
  },
}));

/**
 * Use keyboard to move to other cell
 * @param directionMove Hướng di chuyển (up, down, left, right)
 */
export const moveSelectedCell = (
  directionMove: "up" | "down" | "left" | "right"
) => {
  const selectedCell = useSudokuStore.getState().selectedCell;

  let newPos: Position = { col: 0, row: 0 };
  if (selectedCell) {
    const { row, col } = selectedCell;
    switch (directionMove) {
      case "up":
        newPos = { col, row: row === 0 ? 8 : row - 1 };
        break;
      case "down":
        newPos = { col, row: row === 8 ? 0 : row + 1 };
        break;
      case "left":
        newPos = { col: col === 0 ? 8 : col - 1, row };
        break;
      case "right":
        newPos = { col: col === 8 ? 0 : col + 1, row };
        break;
    }
  }

  useSudokuStore.getState().clickCell(newPos);
};

export default useSudokuStore;
