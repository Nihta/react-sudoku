import "./Sudoku.scss";

import useSudokuStore from "../zustand/useSudokuStore";
import Alert from "./Alert";
import Board from "./Board";
import { useEffect } from "react";

function Sudoku() {
  const gameState = useSudokuStore((state) => state.gameState);

  let a = 0;

  return (
    <>
      {gameState && <Alert title="Win!" content="You win." />}
      <div className="d-flex justify-content-center">
        <div className="position-relative">
          <div className="overlay p-5 d-none">
            <h2 className="mt-4 text-center">You Win</h2>
            <div className="d-flex justify-content-between">
              <span>Độ khó</span>
              <span>Dễ</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Thời gian</span>
              <span>01:59</span>
            </div>
          </div>
          <Board />
        </div>
      </div>
    </>
  );
}

export default Sudoku;
