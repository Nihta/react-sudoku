import useSudokuStore, { moveSelectedCell } from "../zustand/useSudokuStore";
import useKeyDown from "./useKeyDown";

export const useCell = (pos: number) => {
  const cells = useSudokuStore((state) => state.cells);
  return cells[pos];
};

export const useCellNote = (pos: number) => {
  const notes = useSudokuStore((state) => state.notes);
  return notes[pos];
};

/**
 * Handle keybroad event (move, delete, input)
 */
export const useMoveKeybroad = () => {
  const actionDelete = useSudokuStore((state) => state.actionDelete);
  const inputCell = useSudokuStore((state) => state.inputCell);

  useKeyDown((e) => {
    const { key } = e;
    switch (key) {
      case "ArrowLeft":
        e.preventDefault();
        moveSelectedCell("left");
        break;
      case "ArrowRight":
        e.preventDefault();
        moveSelectedCell("right");
        break;
      case "ArrowUp":
        e.preventDefault();
        moveSelectedCell("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        moveSelectedCell("down");
        break;
      case "Backspace":
      case "Delete":
        actionDelete();
        break;
      default:
        if (1 <= +key && +key <= 9) {
          inputCell(parseInt(key, 10));
          break;
        }
    }
  });
};
