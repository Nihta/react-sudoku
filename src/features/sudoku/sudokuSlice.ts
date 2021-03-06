import { createSlice } from "@reduxjs/toolkit";
import {
  countConflict,
  getCellFromPos,
  getKeyCellFromPos,
  isSamePos,
} from "./utils";
import highLight from "./utils/highLight";

export type Pos = {
  row: number;
  col: number;
};

export type Cell = {
  value: number | null;
  status: "" | "normal" | "conflict" | "high-light" | "high-light-number";
  selected: boolean;
  isOrigin: boolean;
};

export interface Cells {
  [key: string]: Cell;
}

export interface SudokuState {
  unSolve: any[];
  selectedCell: Pos | null;
  cells: Cells;
  cellEmpty: number;
  cellConflict: number;
  isWinGame: boolean;
}

const initialState: SudokuState = {
  unSolve: [],
  selectedCell: null,
  cells: {},
  cellEmpty: 81,
  cellConflict: 0,
  isWinGame: false,
};

export const handleDataSudoku = (data: any[][]) => {
  let cellEmpty = 81;
  const cells: { [key: string]: Cell } = {};
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

export const sudokuSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUnSolve: (state, action) => {
      state.unSolve = action.payload;
      const data = handleDataSudoku(action.payload);
      state.cells = data.cells;
      state.cellEmpty = data.cellEmpty;

      // highLight(state.cells, state.selectedCell);
      state.cellConflict = countConflict(state.cells);
    },
    clickCell: (state, action) => {
      const posSelectedCellOld = state.selectedCell;
      const posSelectedCellNew = action.payload;
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
      highLight(state.cells, posSelectedCellNew);
    },
    inputCell: (state, action) => {
      // Vị trí của cell đang chọn
      const posSelectedCell = state.selectedCell;

      // Nếu chưa chọn cell nào trước đó thì bỏ qua
      if (posSelectedCell) {
        const cellSelected = getCellFromPos(state.cells, posSelectedCell);

        // Nếu đó là cell gốc - không thể sửa
        if (cellSelected.isOrigin) return;

        // Cập nhật giá trị của cell
        const oldNumber = cellSelected.value;
        const { number: newNumber } = action.payload;

        // Nếu số mới trùng số cũ thì xóa cell đó
        if (oldNumber && newNumber && oldNumber === newNumber) {
          cellSelected.value = null;
          state.cellEmpty++;
        } else {
          cellSelected.value = newNumber;
        }

        // Nếu trước đó chưa nhập số thì số cell trống giảm đi 1
        if (!oldNumber) {
          state.cellEmpty--;
        }

        // HighLight lại
        highLight(state.cells, posSelectedCell);
        // Tính lại số lượng conflict
        state.cellConflict = countConflict(state.cells);
      }
    },
    deleteCell: (state, action) => {
      const posSelected = action.payload ? action.payload : state.selectedCell;
      // Nếu không truyền vào pos và cũng chưa chọn cell nào
      if (!posSelected) return;

      const cell = getCellFromPos(state.cells, posSelected);
      // Không thể xóa cell gốc
      if (cell.isOrigin) return;

      if (cell.value) {
        cell.value = null;
        state.cellEmpty++;
      }
    },
  },
});

export const { setUnSolve, inputCell, clickCell, deleteCell } =
  sudokuSlice.actions;

export default sudokuSlice.reducer;
