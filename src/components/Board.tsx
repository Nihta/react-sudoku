import React, { useEffect } from "react";
import { easyPuzzles } from "../data/sudokuPuzzles";
import { useMoveKeybroad } from "../hooks/sudokuHooks";
import useSudokuStore from "../zustand/useSudokuStore";

import "./Board.scss";
import Cell from "./Cell";

function Board() {
  const { setPuzzle } = useSudokuStore((state) => state);

  useEffect(() => {
    setPuzzle(easyPuzzles[0]);
  }, [setPuzzle]);

  useMoveKeybroad();

  return (
    <div className="sudoku-board">
      <div className="sudoku-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <React.Fragment key={i}>
            {Array.from({ length: 9 }, (_, j) => (
              <Cell row={i} col={j} key={`${i}${j}`} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Board;
