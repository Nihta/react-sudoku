import { CellState, Position } from "../zustand/useSudokuStore";
import { loopAllCell } from "./loop";

export const getKeyCellFromPos = (pos: Position) => {
  return `${pos.row}${pos.col}`;
};

export const getCellFromPos = (
  cells: Record<string, CellState>,
  pos: Position
) => {
  return cells[getKeyCellFromPos(pos)];
};

export const isSamePos = (posA: Position, posB: Position) => {
  return posA.row === posB.row && posA.col === posB.col;
};

export const isSameRow = (posA: Position, posB: Position) => {
  return posA.row === posB.row;
};

export const isSameCol = (posA: Position, posB: Position) => {
  return posA.col === posB.col;
};

export const isSameRegion = (posA: Position, posB: Position) => {
  return (
    Math.trunc(posA.row / 3) === Math.trunc(posB.row / 3) &&
    Math.trunc(posA.col / 3) === Math.trunc(posB.col / 3)
  );
};

export const countConflict = (cells: Record<string, CellState>) => {
  let cnt = 0;
  loopAllCell(cells, (cell) => {
    if (cell && cell.status === "conflict") {
      cnt++;
    }
  });
  return cnt;
};
