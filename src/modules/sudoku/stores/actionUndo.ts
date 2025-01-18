import { produce } from "immer";
import { SudokuState, useBoardStore } from "./useBoard";
import { HistoryRecord, useUndoStore } from "./useUndo";
import toast from "react-hot-toast";
import { reCalculateBoard } from "../utils/reCalculateBoard";

export const saveBoardState = () => {
  const boardState = useBoardStore.getState();

  const record: HistoryRecord = {
    cells: boardState.cells
      .map((cell) => (cell.value ? cell.value.toString() : "0"))
      .join(""),
    selectedCell: boardState.selectedCell,
    notes: boardState.notes.reduce((acc, note, index) => {
      if (note.length > 0) {
        acc[index] = note;
      }
      return acc;
    }, {} as Record<number, number[]>),
  };

  useUndoStore.setState(
    produce((draft) => {
      // limit history to 81
      draft.history.push(record);
      if (draft.history.length > 81) {
        draft.history.shift();
      }
    })
  );
};

export const actionUndo = () => {
  const history = useUndoStore.getState().history;

  if (history.length === 0) {
    toast.error("No more history to undo");
    return;
  }

  console.log("actionUndo", history);
  const lastRecord = history[history.length - 1];
  if (!lastRecord) {
    toast.error("No more history to undo");
    return;
  }

  let doneFlag = false;
  useBoardStore.setState(
    produce((draft: SudokuState) => {
      try {
        draft.cells = lastRecord.cells.split("").map((value, index) => {
          const cell = draft.cells[index];
          if (value === "0") {
            cell.value = null;
          } else {
            cell.value = parseInt(value, 10);
          }
          return cell;
        });

        draft.selectedCell = lastRecord.selectedCell;
        draft.notes = Array.from({ length: 81 }, () => []);
        for (const [index, note] of Object.entries(lastRecord.notes)) {
          draft.notes[parseInt(index, 10)] = note;
        }

        doneFlag = true;
      } catch (error) {
        toast.error("Error while undoing");
        console.error("Error while undoing", error);
      }
    })
  );

  if (doneFlag) {
    useUndoStore.setState(
      produce((draft) => {
        draft.history.pop();
      })
    );
  }

  reCalculateBoard();
};
