import { Cells, Pos } from "../sudokuSlice";
import { loopAllCell } from "./loop";

export const getKeyCellFromPos = (pos: Pos) => {
  return `${pos.row}${pos.col}`;
};

export const getCellFromPos = (cells: Cells, pos: Pos) => {
  return cells[getKeyCellFromPos(pos)];
};

export const isSamePos = (posA: Pos, posB: Pos) => {
  return posA.row === posB.row && posA.col === posB.col;
};

export const isSameRow = (posA: Pos, posB: Pos) => {
  return posA.row === posB.row;
};

export const isSameCol = (posA: Pos, posB: Pos) => {
  return posA.col === posB.col;
};

export const isSameRegion = (posA: Pos, posB: Pos) => {
  return (
    Math.trunc(posA.row / 3) === Math.trunc(posB.row / 3) &&
    Math.trunc(posA.col / 3) === Math.trunc(posB.col / 3)
  );
};

export const countConflict = (cells: Cells) => {
  let cnt = 0;
  loopAllCell(cells, (cell) => {
    if (cell.status === "conflict") {
      cnt++;
    }
  });
  return cnt;
};
