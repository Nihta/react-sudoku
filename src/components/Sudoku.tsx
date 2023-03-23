import "./Sudoku.scss";

import useSudokuStore from "../zustand/useSudokuStore";
import Alert from "./Alert";
import Control from "./Control";
import Numpad from "./Numpad";
import Board from "./Board";

function Sudoku() {
  const gameState = useSudokuStore((state) => state.gameState);

  let isPause = false;

  return (
    <div className="game-flex-wrapper">
      {gameState && <Alert title="Win!" content="You win." />}
      <div className={`game-wrapper ${isPause ? "game-pause" : ""}`}>
        <Board />
        {isPause && (
          <div className="sudoku-pause-wrapper">
            <div className="sudoku-pause">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-play-big"
                viewBox="0 0 60 60"
              >
                <g fill="none" fillRule="evenodd">
                  <circle cx={30} cy={30} r={30} fill="#0072E3" />
                  <path
                    fill="#FFF"
                    d="m39.12 31.98-12.56 8.64a2.4 2.4 0 0 1-3.76-1.98V21.36a2.4 2.4 0 0 1 3.76-1.97l12.56 8.63a2.4 2.4 0 0 1 0 3.96z"
                  />
                </g>
              </svg>
            </div>
          </div>
        )}
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
