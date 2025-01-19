import toast from "react-hot-toast";
import { useBoardStore } from "./useBoard";
import { initGame } from "./actionNewGame";

export const actionRestart = () => {
  toast.success("Restarting the game");
};
/**
 * Action replay current puzzle
 */
export function actionRePlay() {
  const { puzzle, difficulty } = useBoardStore.getState();

  if (!puzzle || !difficulty) {
    toast.error("No puzzle to replay!");
    return;
  }

  if (puzzle) {
    initGame(puzzle, difficulty);
  } else {
    console.error("No puzzle to replay!");
  }
}
