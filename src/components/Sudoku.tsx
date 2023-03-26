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
import { BREAKPOINTS } from "../constants";

function Sudoku() {
  const gameState = useGameStore((state) => state.gameState);
  const actionNewGame = useSudokuStore((state) => state.actionNewGame);
  const time = useSudokuStore((state) => state.time);

  // todo pause: hide all cell value
  const isPause = gameState === "paused";
  const isWin = gameState === "won";

  return (
    <SudokuWrapper>
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
          <ButtonNewGame
            type="button"
            label="Trò chơi mới"
            onClick={actionNewGame}
            title="Trò chơi mới"
          />
        </GameControlWrapper>
      </GameAndControlWrapper>
    </SudokuWrapper>
  );
}

const SudokuWrapper = styled.div`
  position: relative;
  @media ${BREAKPOINTS.mobile} {
    max-width: 500px;
    margin: 0 auto 20px;
  }
`;

const ButtonNewGame = styled(Button)`
  @media ${BREAKPOINTS.mdAndSmaller} {
    display: none;
  }
`;

const GameAndControlWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  @media ${BREAKPOINTS.mdAndLarger} {
    flex-direction: row;
  }
`;

const GameWrapper = styled.div`
  position: relative;
  min-width: 250px;
  max-width: 500px;

  @media ${BREAKPOINTS.md} {
    flex-basis: 52%;
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

  @media ${BREAKPOINTS.mdAndLarger} {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media ${BREAKPOINTS.md} {
    flex-basis: 45%;
  }

  @media ${BREAKPOINTS.desktop} {
    flex-basis: 46%;
  }
`;

export default Sudoku;
