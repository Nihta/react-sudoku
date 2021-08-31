import {
  getCellFromPos,
  getKeyCellFromPos,
  isSameCol,
  isSameRegion,
  isSameRow,
} from ".";
import { Cells, Pos } from "../sudokuSlice";
import { loopAllCell } from "./loop";

interface MapNumberPos {
  [key: number]: string;
}

const highLightConflict = (
  cells: Cells,
  pos: Pos,
  posSelected: Pos,
  hash: MapNumberPos
) => {
  const cellKey = getKeyCellFromPos(pos);
  const cell = cells[cellKey];
  const cellValue = cell.value;

  if (cellValue) {
    if (hash[cellValue]) {
      cell.status = "conflict";
      cells[hash[cellValue]].status = "conflict";
    }
    hash[cellValue] = cellKey;
  }
};

const hightLightRelated = (cells: Cells, posSelected: Pos) => {
  const selectedValue = getCellFromPos(cells, posSelected).value;
  if (!selectedValue) return;

  loopAllCell(cells, (cellCur, posCur) => {
    // Hightliht related cell (same row, same col, same region)
    const isRelated =
      cellCur.status !== "conflict" &&
      (isSameRow(posCur, posSelected) ||
        isSameCol(posCur, posSelected) ||
        isSameRegion(posCur, posSelected));
    if (isRelated) {
      cellCur.status = "high-light";
      return;
    }

    // Highlight same number
    if (cellCur.value && cellCur.value === selectedValue) {
      cellCur.status = "high-light-number";
      return;
    }
  });
};

const highLight = (cells: Cells, posSelected: Pos) => {
  // Reset all status
  loopAllCell(cells, (cellCur, posCur) => {
    cellCur.status = "normal";
  });

  hightLightRelated(cells, posSelected);

  // Find conflict in col
  for (let row = 0; row < 9; row++) {
    const hash: MapNumberPos = {};
    for (let col = 0; col < 9; col++) {
      highLightConflict(cells, { row, col }, posSelected, hash);
    }
  }

  // Find conflict in row
  for (let col = 0; col < 9; col++) {
    const hash: MapNumberPos = {};
    for (let row = 0; row < 9; row++) {
      highLightConflict(cells, { row, col }, posSelected, hash);
    }
  }

  // Find conflict in region 3x3
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      const hash: MapNumberPos = {};
      for (let i = 0; i < 9; i++) {
        highLightConflict(
          cells,
          {
            row: row + Math.trunc(i / 3),
            col: col + (i % 3),
          },
          posSelected,
          hash
        );
      }
    }
  }
};

export default highLight;
