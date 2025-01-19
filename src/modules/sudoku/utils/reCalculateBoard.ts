import { produce } from "immer";
import { countConflict, countEmpty, getCellPos } from "../../../utils/sudoku";
import {
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../../../utils/sudoku/utils";
import { setCells, SudokuState, useBoardStore } from "../stores/useBoard";
import { getBoardInfo } from "../utils";
import { useGameStore } from "../stores/useGame";

export const reCalculateBoard = () => {
  // check game state
  const cellConflict = countConflict(useBoardStore.getState().cells);
  const cellEmpty = countEmpty(useBoardStore.getState().cells);
  if (cellConflict === 0 && cellEmpty === 0) {
    useGameStore.setState({ state: "win" });
  }

  useBoardStore.setState({ cellConflict, cellEmpty });

  // Highlight conflict
  useBoardStore.setState(
    produce((stateDraft: SudokuState) => {
      const cells = stateDraft.cells;

      const { rows, cols, blocks } = getBoardInfo(cells);
      // find cell conflict
      for (let cellIdx = 0; cellIdx < 81; cellIdx++) {
        const cell = cells[cellIdx];
        if (cell.value === null || cell.value === 0) {
          stateDraft.cells[cellIdx].isConflict = false;
          continue;
        }

        const { row, col, block } = getCellPos(cellIdx);
        const cntRow = rows[row].get(cell.value);
        const cntCol = cols[col].get(cell.value);
        const cntBlock = blocks[block].get(cell.value);
        if (
          (cntRow && cntRow > 1) ||
          (cntCol && cntCol > 1) ||
          (cntBlock && cntBlock > 1)
        ) {
          stateDraft.cells[cellIdx].isConflict = true;
        } else {
          stateDraft.cells[cellIdx].isConflict = false;
        }
      }
    })
  );

  const selectedCell = useBoardStore.getState().selectedCell;

  // if no cell selected, clear all highlight
  if (selectedCell === undefined) {
    setCells(
      produce(useBoardStore.getState().cells, (draft) => {
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.selected = false;
        });
      })
    );
    return;
  }

  const { row, col, block } = getCellPos(selectedCell);
  const cells = useBoardStore.getState().cells;

  setCells(
    produce(cells, (draft) => {
      draft.forEach((cell) => {
        cell.status = "normal";
        cell.selected = false;
      });

      const relatedIdx = new Set([
        ...getIdxByRow(row),
        ...getIdxByCol(col),
        ...getIdxByBlock(block),
      ]);
      relatedIdx.forEach((idx) => {
        draft[idx].status = "high-light";
      });

      if (draft[selectedCell].value) {
        for (let i = 0; i < 81; i++) {
          if (
            draft[i].value === draft[selectedCell].value &&
            !relatedIdx.has(i)
          ) {
            draft[i].status = "high-light-number";
          }
        }
      }

      draft[selectedCell].selected = true;
    })
  );
};
