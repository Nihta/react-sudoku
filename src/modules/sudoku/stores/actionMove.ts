import { getCellPos } from "../../../utils/sudoku";
import { actionClickCell, useBoardStore } from "./useBoard";
import { useGameStore } from "./useGame";

export const actionMove = (direction: "up" | "down" | "left" | "right") => {
  // do nothing if game state is paused
  const isPaused = useGameStore.getState().isPaused();
  if (isPaused) {
    if (import.meta.env.DEV) {
      console.info("Skip move action because game is paused");
    }
    return;
  }

  const selectedCell = useBoardStore.getState().selectedCell;

  // when no cell selected, select center cell
  if (selectedCell === undefined) {
    actionClickCell(4, 4);
    return;
  }

  // highlight next cell
  const { row, col } = getCellPos(selectedCell);
  let newPos = { row, col };
  switch (direction) {
    case "up":
      newPos = { col, row: row === 0 ? 8 : row - 1 };
      break;
    case "down":
      newPos = { col, row: row === 8 ? 0 : row + 1 };
      break;
    case "left":
      newPos = { col: col === 0 ? 8 : col - 1, row };
      break;
    case "right":
      newPos = { col: col === 8 ? 0 : col + 1, row };
      break;
    default:
      throw new Error("Invalid direction");
  }

  actionClickCell(newPos.row, newPos.col);
};
