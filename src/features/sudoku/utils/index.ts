import { ICells, PosType } from "../sudokuSlice";
import { loopAllCell } from "./loop";

export const getKeyCellFromPos = (pos: PosType) => {
  return `${pos.row}${pos.col}`;
};

export const getCellFromPos = (cells: ICells, pos: PosType) => {
  return cells[getKeyCellFromPos(pos)];
};

export const isSamePos = (posA: PosType, posB: PosType) => {
  return posA.row === posB.row && posA.col === posB.col;
};

export const isSameRow = (posA: PosType, posB: PosType) => {
  return posA.row === posB.row;
};

export const isSameCol = (posA: PosType, posB: PosType) => {
  return posA.col === posB.col;
};

export const isSameRegion = (posA: PosType, posB: PosType) => {
  return (
    Math.trunc(posA.row / 3) === Math.trunc(posB.row / 3) &&
    Math.trunc(posA.col / 3) === Math.trunc(posB.col / 3)
  );
};

export const countConflict = (cells: ICells) => {
  let cnt = 0;
  loopAllCell(cells, (cell) => {
    if (cell.status === "conflict") {
      cnt++;
    }
  });
  return cnt;
};
