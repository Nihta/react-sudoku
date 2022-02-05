import React from "react";
import "./Sudoku.scss";

import Alert from "./components/Alert";
import Board from "./components/Board";
import { selectGameState } from "./sudokuSlice";
import { useTypedSelector } from "../../common/hooks/reduxHooks";

function Sudoku() {
  const gameState = useTypedSelector(selectGameState);

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
