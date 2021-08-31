import { getCellFromPos } from ".";
import { Cell, Cells, Pos } from "../sudokuSlice";

export const loopAllCellInRow = (
  cells: Cells,
  row: number,
  callBack: (cell: Cell, pos: Pos) => void
) => {
  for (let i = 0; i < 9; i++) {
    const pos = { row, col: i };
    const cell = getCellFromPos(cells, pos);
    callBack(cell, pos);
  }
};

export const loopAllCellInCol = (
  cells: Cells,
  col: number,
  callBack: (cell: Cell) => void
) => {
  for (let i = 0; i < 9; i++) {
    const pos = `${i}${col}`;
    callBack(cells[pos]);
  }
};

export const loopAllCellInArea3x3 = (
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
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const pos = { row, col };
      const cell = getCellFromPos(cells, pos);
      callBack(cell, pos);
    }
  }
};
