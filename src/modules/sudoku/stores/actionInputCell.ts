import { produce } from "immer";
import { reCalculateBoard } from "../utils/reCalculateBoard";
import { saveBoardState } from "./actionUndo";
import { SudokuState, useBoardStore } from "./useBoard";

export const actionInputCell = (value: number, isOrigin = false) => {
  const selectedCell = useBoardStore.getState().selectedCell;
  if (selectedCell === undefined) {
    console.warn("No cell selected");
    return;
  }

  const cells = useBoardStore.getState().cells;
  const cell = cells[selectedCell];
  // todo: change name cell.fixed
  if (cell.isOrigin) {
    console.info("Can not change origin cell");
    return;
  }

  // Note mode
  if (useBoardStore.getState().mode === "note") {
    const oldCellNote = useBoardStore.getState().notes[selectedCell];

    //  if note already exist, remove it
    const newCellNote = oldCellNote.includes(value)
      ? oldCellNote.filter((v) => v !== value)
      : [...oldCellNote, value];

    saveBoardState();
    useBoardStore.setState({
      notes: produce(useBoardStore.getState().notes, (draft) => {
        draft[selectedCell] = newCellNote;
      }),
      cells: produce(useBoardStore.getState().cells, (draft) => {
        draft[selectedCell].value = null;
        draft[selectedCell].blinkValue = undefined;
      }),
    });

    reCalculateBoard();
    return;
  }

  // delete if same value
  if (cell.value === value && !isOrigin) {
    saveBoardState();
    setCellValue({ idx: selectedCell, value: null });
    reCalculateBoard();
    return;
  }

  // set cell value
  saveBoardState();
  setCellValue({ idx: selectedCell, value, origin: isOrigin });
  reCalculateBoard();
};

type SetCellValueOptions = {
  /** Set this cell as origin */
  origin?: boolean;
  idx: number;
  value: number | null;
  selected?: boolean;
};

/**
 * Set cell value without saving history and re-calculate board
 */
export const setCellValue = (options: SetCellValueOptions) => {
  const idx = options.idx;
  const value = options.value;
  const isOrigin = options.origin || false;
  useBoardStore.setState(
    produce((draft: SudokuState) => {
      draft.cells[idx].value = value;
      draft.notes[idx] = [];
      draft.cells[idx].blinkValue = undefined;
      if (isOrigin) {
        draft.cells[idx].isOrigin = true;
      }
      if (options.selected !== undefined) {
        draft.cells[idx].selected = true;
      }
    })
  );
};
