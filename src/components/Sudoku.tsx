import styled from "styled-components";

import Control from "./Control";
import Numpad from "./Numpad";
import Board from "./Board";
import GameInfo from "./GameInfo";
import Button from "./base/Button";
import VictoryAlert from "./VictoryAlert";
import GamePause from "./GamePause";

import useSudokuStore from "../zustand/useSudokuStore";
import { useGameStore } from "../zustand/useGameStore";

function Sudoku() {
  const gameState = useGameStore((state) => state.gameState);
  const actionNewGame = useSudokuStore((state) => state.actionNewGame);
  const time = useSudokuStore((state) => state.time);

  // todo pause: hide all cell value
  const isPause = gameState === "paused";
  const isWin = gameState === "won";

  return (
    <>
      <GameInfo />
      <GameAndControlWrapper>
        <GameWrapper className={isPause ? "game-pause" : ""}>
          <Board />
          {isPause && <GamePause />}

          {isWin && <VictoryAlert time={time} />}
        </GameWrapper>
        <GameControlWrapper>
          <Control />
          <Numpad />
          <Button
            style={{
              marginTop: "12px",
            }}
            type="button"
            label="Trò chơi mới"
            onClick={actionNewGame}
            title="Trò chơi mới"
          />
        </GameControlWrapper>
      </GameAndControlWrapper>
    </>
  );
}

const GameAndControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  /* width: 100%; */
  position: relative;
`;

const GameWrapper = styled.div`
  position: relative;
  /* width: 100%; */
  flex-basis: 60%;
  min-width: 250px;
  max-width: 500px;
`;

const GameControlWrapper = styled.div`
  /* width: 80%; */
  min-width: 100px;
  /* max-width: none; */
  flex-basis: 40%;
  margin-left: 20px;
  transition: opacity 0.3s ease-in-out;
`;

export default Sudoku;
