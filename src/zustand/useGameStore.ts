import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface GameState {
  gameState: "playing" | "won" | "lost" | "paused";
  setGamestate: (state: GameState["gameState"]) => void;
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: (difficulty: GameState["difficulty"]) => void;
}

export const useGameStore = create<GameState>()(
  // persist(
  (set, get) => ({
    gameState: "playing",
    setGamestate: (state) => set({ gameState: state }),
    difficulty: "easy",
    setDifficulty: (difficulty) => set({ difficulty }),
  })
  //   {
  //     name: "game-storage",
  //   }
  // )
);
