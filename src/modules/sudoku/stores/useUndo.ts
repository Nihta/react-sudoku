import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HistoryRecord = {
  cells: string; // using string to save cells: 0 = empty, 1-9 = value
  selectedCell?: number; // index of selected cell
  notes: Record<number, number[]>; // notes for each cell
};

export type GameState = {
  history: HistoryRecord[];
  resetHistory: () => void;
};

export const useUndoStore = create<GameState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, _get) => ({
      history: [],
      resetHistory: () => set({ history: [] }),
    }),
    {
      name: "nihta-sudoku::undo-storage",
    }
  )
);
