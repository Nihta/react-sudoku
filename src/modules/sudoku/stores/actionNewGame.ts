import { dataPuzzles } from "../../../data/sudokuPuzzles";
import { Difficulty } from "../../../types/sudokuTypes";
import { getRandomElementFromArray } from "../../../utils/arrayUtils";
import { decodeSudokuPuzzle } from "../../../utils/sudoku";
import { shuffleSudoku } from "../../../utils/sudoku/shuffleSudoku";
import { convertPuzzle } from "../utils";
import { useBoardStore } from "./useBoard";
import { useGameStore } from "./useGame";

export const actionNewGame = (level: Difficulty = "easy") => {
  const puzzle = decodeSudokuPuzzle(
    shuffleSudoku(getRandomElementFromArray(dataPuzzles[level]))
  );
  const { cells, cellEmpty } = convertPuzzle(puzzle);

  useBoardStore.setState({
    puzzle,
    cells,
    cellEmpty,
    cellConflict: 0, // todo: calculate conflict
    history: [],
    notes: Array.from({ length: 81 }, () => []),
    highlightBlocks: [],
    highlightRows: [],
    highlightCols: [],
    mode: "normal",
    hintActions: undefined,
    selectedCell: undefined,
    difficulty: level,
  });

  useGameStore.setState({ state: "playing", time: 0 });
};
