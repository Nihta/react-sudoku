import { create } from "zustand";

export interface GameState {
  gameState: "playing" | "won" | "lost" | "paused";
  setGameState: (state: GameState["gameState"]) => void;
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: (difficulty: GameState["difficulty"]) => void;
}

export const useGameStore = create<GameState>()(
  // persist(
  (set, _get) => ({
    gameState: "playing",
    setGameState: (state) => set({ gameState: state }),
    difficulty: "easy",
    setDifficulty: (difficulty) => set({ difficulty }),
  })
  //   {
  //     name: "game-storage",
  //   }
  // )
);
