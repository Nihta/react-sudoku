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

const handlerHighLightConflict = (
  cells: Cells,
  pos: Pos,
  hash: MapNumberPos,
  needRemoveHighLight: boolean = false
) => {
  const cellKey = getKeyCellFromPos(pos);
  const cell = cells[cellKey];
  const cellValue = cell.value;

  if (cellValue) {
    if (hash[cellValue]) {
      cell.status = "conflict";
      cells[hash[cellValue]].status = "conflict";
    }
    // Chỉ xóa highlight một lần (khi loop col hoặc rol hoặc region)
    // Nếu không sẽ gây ra việc lần loop sau xóa lần loop trước
    else if (needRemoveHighLight && cell.status === "conflict") {
      cell.status = "";
    }
    hash[cellValue] = cellKey;
  } else if (cell.status === "conflict") {
    // Nếu cell trống
    cell.status = "";
  }
};

export const highLightConflict = (cells: Cells) => {
  // Find conflict in col
  for (let row = 0; row < 9; row++) {
    const hash: MapNumberPos = {};
    for (let i = 0; i < 9; i++) {
      handlerHighLightConflict(cells, { row, col: i }, hash, true);
    }
  }

  // Find conflict in row
  for (let col = 0; col < 9; col++) {
    const hash: MapNumberPos = {};
    for (let i = 0; i < 9; i++) {
      handlerHighLightConflict(cells, { row: i, col }, hash);
    }
  }

  // Find conflict in region 3x3
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      const hash: MapNumberPos = {};
      for (let i = 0; i < 9; i++) {
        handlerHighLightConflict(
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

const hightLightRelated = (cells: Cells, posSelected: Pos) => {
  const selectedValue = getCellFromPos(cells, posSelected).value;
  console.log(selectedValue);

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
    if (
      selectedValue &&
      cellCur.value &&
      cellCur.value === selectedValue
    ) {
      cellCur.status = "high-light-number";
      return;
    }

    // Remove old highlight (if need)
    if (
      cellCur.status === "high-light" ||
      cellCur.status === "high-light-number"
    ) {
      cellCur.status = "";
    }
  });
};

export const highLight = (cells: Cells, posSelected: Pos) => {
  hightLightRelated(cells, posSelected);
  highLightConflict(cells);
};
