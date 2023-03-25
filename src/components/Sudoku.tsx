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
import { BREAKPOINTS } from "../constants.ts";

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
  position: relative;
  display: flex;
  flex-direction: column;

  @media ${BREAKPOINTS.smAndLarger} {
    flex-direction: row;
  }

  /* @media screen and (max-width: 767px) {
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
  } */
`;

const GameWrapper = styled.div`
  position: relative;
  min-width: 250px;
  max-width: 500px;

  @media ${BREAKPOINTS.mobile} {
    flex-basis: 55%;
  }

  @media ${BREAKPOINTS.desktop} {
    flex-basis: 60%;
  }
`;

const GameControlWrapper = styled.div`
  /* width: 80%; */
  min-width: 100px;
  /* max-width: none; */
  flex-basis: 40%;
  transition: opacity 0.3s ease-in-out;

  margin: 0;

  @media ${BREAKPOINTS.smAndLarger} {
    margin-left: 20px;
  }

  @media ${BREAKPOINTS.md} {
    flex-basis: 45%;
  }

  @media ${BREAKPOINTS.desktop} {
    flex-basis: 40%;
  }
`;

export default Sudoku;
