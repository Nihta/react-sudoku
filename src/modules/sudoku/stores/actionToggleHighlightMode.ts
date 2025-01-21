import { reCalculateBoard } from "../utils/reCalculateBoard";
import { useBoardStore } from "./useBoard";

export const actionToggleHighlightMode = () => {
  const highlightMode = useBoardStore.getState().highlightMode;
  useBoardStore.setState({
    highlightMode: highlightMode === "normal" ? "supper" : "normal",
  });
  reCalculateBoard();
};
