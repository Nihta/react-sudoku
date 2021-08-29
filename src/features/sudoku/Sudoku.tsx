import React from "react";
import Board from "./components/Board";
import "./Sudoku.scss";

function Sudoku() {
  return (
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
  );
}

export default Sudoku;
