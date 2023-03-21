import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import produce from "immer";
import {
  countConflict,
  getCellFromPos,
  getKeyCellFromPos,
  isSamePos,
} from "../utils";
import highLight from "../utils/highLight";

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

export const handleDataSudoku = (data: any[][]) => {
  let cellEmpty = 81;
  const cells: { [key: string]: CellState } = {};
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const isOrigin = data[row][col] !== null;

      if (isOrigin) {
        cellEmpty--;
      }

      cells[`${row}${col}`] = {
        value: parseInt(data[row][col], 10),
        status: "",
        selected: false,
        isOrigin,
      };
    }
  }
  return { cells, cellEmpty };
};

interface SudokuState {
  unSolve: any[];
  selectedCell: Position | null;
  cells: Record<string, CellState>;
  cellEmpty: number;
  cellConflict: number;
  /**
   * false: not solved
   * true: solved
   */
  gameState: boolean;
  setUnSolve: (puzzle: any[]) => void;
  clickCell: (pos: Position) => void;
  inputCell: (newNumber: number) => void;
  deleteCell: (pos?: Position) => void;
}

const useSudokuStore = create<SudokuState>()((set, get) => ({
  unSolve: [],
  selectedCell: null,
  cells: {},
  cellEmpty: 81,
  cellConflict: 0,
  gameState: false,
  setUnSolve: (puzzle) => {
    const data = handleDataSudoku(puzzle);
    set({
      unSolve: puzzle,
      cells: data.cells,
      cellEmpty: data.cellEmpty,
      cellConflict: countConflict(get().cells),
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
  inputCell: (newNumber: number) => {
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
        if (oldCellVal && newNumber && oldCellVal === newNumber) {
          cellSelected.value = null;
          state.cellEmpty++;
        } else {
          cellSelected.value = newNumber;
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
