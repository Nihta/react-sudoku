import { getCellFromPos } from ".";
import { CellType, ICells, PosType } from "../sudokuSlice";

export const loopAllCellInRow = (
  cells: ICells,
  row: number,
  callBack: (cell: CellType, pos: PosType) => void
) => {
  for (let i = 0; i < 9; i++) {
    const pos = { row, col: i };
    const cell = getCellFromPos(cells, pos);
    callBack(cell, pos);
  }
};

export const loopAllCellInCol = (
  cells: ICells,
  col: number,
  callBack: (cell: CellType) => void
) => {
  for (let i = 0; i < 9; i++) {
    const pos = `${i}${col}`;
    callBack(cells[pos]);
  }
};

export const loopAllCellInArea3x3 = (
  cells: ICells,
  row: number,
  col: number,
  callBack: (cell: CellType, row: number, col: number) => void
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
  cells: ICells,
  callBack: (cell: CellType, pos: PosType) => void
) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const pos = { row, col };
      const cell = getCellFromPos(cells, pos);
      callBack(cell, pos);
    }
  }
};
