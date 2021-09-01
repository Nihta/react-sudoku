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

const clearHighLight = (cells: Cells) => {
  loopAllCell(cells, (cellCur) => {
    cellCur.status = "normal";
  });
};

const hightLightRelated = (cells: Cells, posSelected: Pos) => {
  const selectedValue = getCellFromPos(cells, posSelected).value;

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
    if (selectedValue && cellCur.value && cellCur.value === selectedValue) {
      cellCur.status = "high-light-number";
      return;
    }
  });
};

const highLightConflictUtil = (cells: Cells, pos: Pos, hash: MapNumberPos) => {
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

const highLightConflict = (cells: Cells) => {
  // Find conflict in col
  for (let row = 0; row < 9; row++) {
    const hash: MapNumberPos = {};
    for (let col = 0; col < 9; col++) {
      highLightConflictUtil(cells, { row, col }, hash);
    }
  }

  // Find conflict in row
  for (let col = 0; col < 9; col++) {
    const hash: MapNumberPos = {};
    for (let row = 0; row < 9; row++) {
      highLightConflictUtil(cells, { row, col }, hash);
    }
  }

  // Find conflict in region 3x3
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      const hash: MapNumberPos = {};
      for (let i = 0; i < 9; i++) {
        highLightConflictUtil(
          cells,
          {
            row: row + Math.trunc(i / 3),
            col: col + (i % 3),
          },
          hash
        );
      }
    }
  }
};

const highLight = (cells: Cells, posSelected: Pos) => {
  clearHighLight(cells);
  hightLightRelated(cells, posSelected);
  highLightConflict(cells);
};

export default highLight;
