import { produce } from "immer";
import { ETechnique } from "../../../types/technique.type";
import {
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../../../utils/sudoku/utils";
import { lastRemainingCell } from "../technique/lastRemainingCell";
import { preHandle } from "../utils";
import { reCalculateBoard } from "../utils/reCalculateBoard";
import { setCells, SudokuState, useBoardStore } from "./useBoard";
import { actionInputCell } from "./actionInputCell";
// import toast from "react-hot-toast";

const smartHint = () => {
  const cells = useBoardStore.getState().cells;
  const { rows, cols, cells: orgCells, blocks } = preHandle(cells);

  const res = lastRemainingCell({ cells: orgCells, rows, cols, blocks });
  if (res && res.type === ETechnique.lastRemainingCell) {
    const { payload } = res;

    useBoardStore.setState({ mode: "hint" });
    // console.info("Last remaining cell", payload);

    // hintActions.current = {
    //   setValues: [{ position: payload.position, value: payload.value }],
    // };

    // toast.success("Hint: Last remaining cell");

    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: "Last remaining cell",
          setValues: [{ position: payload.position, value: payload.value }],
        };
      })
    );

    if (payload.type === "block") {
      useBoardStore.setState({ highlightBlocks: [payload.typeDetail] });
    } else if (payload.type === "row") {
      useBoardStore.setState({ highlightRows: [payload.typeDetail] });
    } else if (payload.type === "col") {
      useBoardStore.setState({ highlightCols: [payload.typeDetail] });
    }

    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.selected = false;
        });

        draft[payload.position].selected = true;
        draft[payload.position].blinkValue = payload.value;

        // high light related cells: row, col
        payload.rowRelated.forEach((rowIdx) => {
          getIdxByRow(rowIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });

        payload.colRelated.forEach((colIdx) => {
          getIdxByCol(colIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });

        payload.blockRelated.forEach((blockIdx) => {
          getIdxByBlock(blockIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });
      })
    );

    return true;
  }

  return false;
};

export const doActionHint = () => {
  // toast.error("You are already in hint mode");
  const hintActions = useBoardStore.getState().hintActions;

  hintActions?.setValues?.forEach((action) => {
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.cells[action.position].value = action.value;
        draft.cells[action.position].blinkValue = undefined;
        draft.cells[action.position].isOrigin = true;
        draft.notes[action.position] = [];
      })
    );
  });

  useBoardStore.setState(
    produce((draft: SudokuState) => {
      draft.highlightBlocks = [];
      draft.highlightRows = [];
      draft.highlightCols = [];
      draft.hintActions = undefined;
      // todo: làm thế nào để biết đang note mode hay normal mode
      draft.mode = "normal";
    })
  );

  reCalculateBoard();
};

export const actionHint = () => {
  // do hint actions
  const mode = useBoardStore.getState().mode;
  if (mode === "hint") {
    doActionHint();
    return;
  }

  // if no cell selected, do nothing
  const selectedCell = useBoardStore.getState().selectedCell;
  if (selectedCell === undefined) {
    smartHint();
    return;
  }

  // if cell is origin, try smart hint
  const cells = useBoardStore.getState().cells;
  const cell = cells[selectedCell];
  if (cell.isOrigin) {
    smartHint();
    return;
  }

  // fill cell with correct value
  const puzzle = useBoardStore.getState().puzzle;
  if (puzzle === undefined) {
    throw new Error("No puzzle found");
  }

  const correctValue = puzzle[1][selectedCell];
  if (!correctValue || correctValue === "0") {
    throw new Error("No correct value found");
  }

  // todo: case note mode
  actionInputCell(parseInt(correctValue, 10), true);
};
