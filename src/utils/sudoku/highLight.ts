import { Cells } from "../../types/sudokuTypes";
import { useGameStore } from "../../zustand/useGameStore";
import { getBlockIdx, getCellPos } from "./position";

export function getBoardInfo(cells: Cells) {
  const cellValues: number[] = cells.map((cell) => cell.value ?? 0);

  const rows = new Array(9).fill(null).map(() => new Map<number, number>());
  const cols = new Array(9).fill(null).map(() => new Map<number, number>());
  const blocks = new Array(9).fill(null).map(() => new Map<number, number>());

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const idx = i * 9 + j;
      const value = cellValues[idx];
      if (value) {
        rows[i].set(value, (rows[i].get(value) || 0) + 1);
        cols[j].set(value, (cols[j].get(value) || 0) + 1);
        const blockIdx = getBlockIdx(i, j);
        blocks[blockIdx].set(value, (blocks[blockIdx].get(value) || 0) + 1);
      }
    }
  }

  return {
    rows,
    cols,
    blocks,
    cellValues: cellValues,
  };
}

/**
 * Highlight related cell
 * @param cells
 * @param pos
 */
function normalHighLight(cells: Cells, pos: number) {
  const { cols, rows, blocks } = getBoardInfo(cells);

  // get current pos info
  const { row: curRow, col: curCol, block: curBlock } = getCellPos(pos);

  const selectedVal = cells[pos].value ?? 0;
  cells.forEach((cell, _pos) => {
    // clear all highlight
    cell.status = "normal";

    const { col, row, block } = getCellPos(_pos);
    // highlight related cell (same row, same col, same block)
    if (col === curCol || row === curRow || block === curBlock) {
      cell.status = "high-light";
    }

    // highlight same number
    if (selectedVal && cell.value === selectedVal) {
      cell.status = "high-light-number";
    }

    // highlight conflict
    if (cell.value) {
      if (
        (rows[row].get(cell.value) ?? 0) > 1 ||
        (cols[col].get(cell.value) ?? 0) > 1 ||
        (blocks[block].get(cell.value) ?? 0) > 1
      ) {
        cell.status = "conflict";
      }
    }
  });

  return cells;
}

/**
 * Supper highlight related cell
 *
 * @param cells
 * @param pos
 */
function supperHighLight(cells: Cells, pos: number) {
  const { cols, rows, blocks } = getBoardInfo(cells);

  // get current pos info
  const selectedVal = cells[pos].value ?? 0;

  if (!selectedVal) {
    normalHighLight(cells, pos);
    return;
  }

  cells.forEach((cell, _pos) => {
    const { col, row, block } = getCellPos(_pos);

    // Un-highlight all cell
    cell.status = "normal";

    // Highlight all related cell
    // prettier-ignore
    if (cell.isOrigin || rows[row].has(selectedVal) || cols[col].has(selectedVal) || blocks[block].has(selectedVal)) {
      cell.status = "high-light";
    }

    // highlight same number
    if (selectedVal && cell.value === selectedVal) {
      cell.status = "high-light-number";
    }

    // highlight conflict
    if (cell.value) {
      // prettier-ignore
      if ((rows[row].get(cell.value) ?? 0) > 1 || (cols[col].get(cell.value) ?? 0) > 1 || (blocks[block].get(cell.value) ?? 0) > 1) {
        cell.status = "conflict";
      }
    }
  });
}

export const highLight = (cells: Cells, posSelected: number) => {
  const supperMode = useGameStore.getState().supperHighLight;
  if (supperMode) {
    supperHighLight(cells, posSelected);
  } else {
    normalHighLight(cells, posSelected);
  }
};
