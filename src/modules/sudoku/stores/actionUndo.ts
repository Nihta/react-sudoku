import { produce } from "immer";
import { SudokuState, useBoardStore } from "./useBoard";
import { HistoryRecord, useUndoStore } from "./useUndo";
import toast from "react-hot-toast";
import { reCalculateBoard } from "../utils/reCalculateBoard";

export const saveBoardState = () => {
  const boardState = useBoardStore.getState();

  const record: HistoryRecord = {
    cells: boardState.cells
      .map((cell) => {
        if (cell.value === null) {
          return "0";
        }
        // if is original cell -> number, else -> letter a = 0, b = 1, ...
        if (cell.isOrigin) {
          return cell.value.toString();
        } else {
          return String.fromCharCode(97 + cell.value);
        }
      })
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
            cell.isOrigin = false;
          } else {
            if (value >= "1" && value <= "9") {
              cell.value = parseInt(value, 10);
              cell.isOrigin = true;
            } else {
              // a - > 0, b - > 1, ...
              cell.value = value.charCodeAt(0) - 97;
              cell.isOrigin = false;
            }
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
