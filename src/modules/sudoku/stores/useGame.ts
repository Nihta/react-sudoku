import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameStatus = "none" | "playing" | "pause" | "hint" | "win" | "lose";

export type GameState = {
  time: number;
  state: GameStatus;
  incrementTime: () => void;
  resetTime: () => void;
  isPaused: () => boolean;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      time: 0,
      state: "none",
      incrementTime: () => {
        set((st) => ({ time: st.time + 1 }));
      },
      resetTime: () => {
        set({ time: 0 });
      },
      isPaused: () => {
        return get().state === "pause";
      },
    }),
    {
      name: "nihta-sudoku::game-storage",
    }
  )
);
