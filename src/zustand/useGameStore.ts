import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface GameState {
  gameState: "playing" | "won" | "lost" | "paused";
  setGamestate: (state: GameState["gameState"]) => void;
}

export const useGameStore = create<GameState>()(
  // persist(
  (set, get) => ({
    gameState: "playing",
    setGamestate: (state) => set({ gameState: state }),
  })
  //   {
  //     name: "game-storage",
  //   }
  // )
);
