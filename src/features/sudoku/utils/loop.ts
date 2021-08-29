import { getCellFromPos } from ".";
import { Cell, Cells, Pos } from "../sudokuSlice";

export const loopRow = (
  cells: Cells,
  row: number,
  callBack: (cell: Cell) => void
) => {
  for (let i = 0; i < 9; i++) {
    const pos = `${row}${i}`;
    callBack(cells[pos]);
  }
};

export const loopCol = (
  cells: Cells,
  col: number,
  callBack: (cell: Cell) => void
) => {
  for (let i = 0; i < 9; i++) {
    const pos = `${i}${col}`;
    callBack(cells[pos]);
  }
};

export const loopArea3x3 = (
  cells: Cells,
  row: number,
  col: number,
  callBack: (cell: Cell, row: number, col: number) => void
) => {
  const y = Math.floor(row / 3) * 3;
  const x = Math.floor(col / 3) * 3;
  for (let i = y; i < y + 3; i++) {
    for (let j = x; j < x + 3; j++) {
      const pos = `${i}${j}`;
      callBack(cells[pos], row, col);
    }
  }
};

export const loopAllCell = (
  cells: Cells,
  callBack: (cell: Cell, pos: Pos) => void
) => {
  for (let _row = 0; _row < 9; _row++) {
    for (let _col = 0; _col < 9; _col++) {
      const pos = { row: _row, col: _col };
      const cell = getCellFromPos(cells, pos);
      callBack(cell, pos);
    }
  }
};
