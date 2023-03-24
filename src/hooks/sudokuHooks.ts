import { Position } from "../types/sudokuTypes";
import useSudokuStore, { moveSelectedCell } from "../zustand/useSudokuStore";
import useKeyDown from "./useKeyDown";

export const useCell = (pos: Position) => {
  const cells = useSudokuStore((state) => state.cells);
  return cells[pos.row * 9 + pos.col];
};

/**
 * Handle keybroad event (move, delete, input)
 */
export const useMoveKeybroad = () => {
  const deleteCell = useSudokuStore((state) => state.deleteCell);
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
        deleteCell(undefined);
        break;
      default:
        if (1 <= +key && +key <= 9) {
          inputCell(parseInt(key, 10));
          break;
        }
    }
  });
};
