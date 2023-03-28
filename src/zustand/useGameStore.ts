import { create } from "zustand";
import { Difficulty } from "../types/sudokuTypes";
import { reHighLight as reHighLightBoard } from "./Sudoku";

export interface GameState {
  gameState: "playing" | "won" | "lost" | "paused" | "idle";
  setGameState: (state: GameState["gameState"]) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: GameState["difficulty"]) => void;
  supperHighLight: boolean;
  toggleSuperHighLight: () => void;
}

export const useGameStore = create<GameState>()(
  // persist(
  (set, _get) => ({
    gameState: "playing",
    setGameState: (state) => set({ gameState: state }),
    difficulty: "easy",
    setDifficulty: (difficulty) => set({ difficulty }),
    supperHighLight: false,
    toggleSuperHighLight: () => {
      set((state) => ({ supperHighLight: !state.supperHighLight }));
      reHighLightBoard();
    },
  })
  //   {
  //     name: "game-storage",
  //   }
  // )
);
