import "./Sudoku.scss";

import useSudokuStore from "../zustand/useSudokuStore";
import Alert from "./Alert";
import Board from "./Board";
import { useEffect } from "react";
import Control from "./Control";
import Numpad from "./Numpad";

function Sudoku() {
  const gameState = useSudokuStore((state) => state.gameState);

  let a = 0;

  return (
    <div className="game-flex-wrapper">
      {gameState && <Alert title="Win!" content="You win." />}
      <div className="game-wrapper">
        <Board />
      </div>
      <div className="game-controls-wrapper">
        <Control />
        <Numpad />
        <div className="btn-new-game">Trò chơi mới</div>
      </div>
    </div>
  );
}

export default Sudoku;
