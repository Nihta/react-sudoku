import { useBoardStore } from "./useBoard";

export const actionToggleNote = () => {
  const mode = useBoardStore.getState().mode;
  useBoardStore.setState({ mode: mode === "note" ? "normal" : "note" });
};
