import { useGameStore } from "./useGame";

export const actionTogglePlaying = () => {
  const currentState = useGameStore.getState().state;

  // disable toggle playing when game is win
  if (currentState === "win") {
    if (import.meta.env.DEV) {
      console.warn("Cannot toggle playing when game is win");
    }
    return;
  }

  if (currentState === "playing") {
    useGameStore.setState({ state: "pause" });
  } else if (currentState === "pause") {
    useGameStore.setState({ state: "playing" });
  }
};
