import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Difficulty } from "../types/sudokuTypes";
import { reHighLight } from "./Sudoku";

export interface GameState {
  gameState: "playing" | "won" | "lost" | "paused" | "idle";
  setGameState: (state: GameState["gameState"]) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  supperHighLight: boolean;
  toggleSuperHighLight: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      gameState: "playing",
      setGameState: (state) => set({ gameState: state }),
      difficulty: "easy",
      setDifficulty: (difficulty) => set({ difficulty }),
      supperHighLight: false,
      toggleSuperHighLight: () => {
        set((state) => ({ supperHighLight: !state.supperHighLight }));
        reHighLight();
      },
    }),
    {
      name: "game-storage",
    }
  )
);
