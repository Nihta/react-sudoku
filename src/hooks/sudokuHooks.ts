import { useEventListener } from "usehooks-ts";
import { useGameStore } from "../zustand/useGameStore";
import useSudokuStore from "../zustand/useSudokuStore";
import useKeyDown from "./useKeyDown";
import { actionDelete, inputCell, moveSelectedCell } from "../zustand/Sudoku";

export const useCell = (pos: number) => {
  const cells = useSudokuStore((state) => state.cells);
  return cells[pos];
};

export const useCellNote = (pos: number) => {
  const notes = useSudokuStore((state) => state.notes);
  return notes[pos];
};

/**
 * Handle keyboard event (move, delete, input)
 */
export const useMoveKeyboard = () => {
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

export const useAutoPauseGame = () => {
  const gameState = useGameStore((state) => state.gameState);
  const setGameState = useGameStore((state) => state.setGameState);
  useEventListener("blur", () => {
    if (gameState === "playing") {
      setGameState("idle");
    }
  });

  useEventListener("focus", () => {
    if (gameState === "idle") {
      setGameState("playing");
    }
  });
};
