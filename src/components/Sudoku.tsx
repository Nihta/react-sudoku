import styled from "styled-components";
import { useAutoPauseGame } from "../hooks/sudokuHooks";
import { useGameStore } from "../zustand/useGameStore";
import Board from "./Board";
import BtnNewGame from "./BtnNewGame";
import Control from "./Control";
import GameInfo from "./GameInfo";
import GamePause from "./GamePause";
import Numpad from "./Numpad";
import VictoryAlert from "./VictoryAlert";

const GameInfoWrapper = styled.div`
  height: 25px;
  width: 100%;
  margin-bottom: 12px;
  position: relative;

  margin-top: 12px;

  @media (min-width: 768px) {
    margin-top: 20px;
  }

  @media (min-width: 980px) {
    margin-top: 26px;
  }

  @media (min-width: 1070px) {
    margin-bottom: 20px;
  }
`;

export default function Sudoku() {
  const gameState = useGameStore((state) => state.gameState);

  // Auto pause game when window is not active
  useAutoPauseGame();

  // todo pause: hide all cell value
  const isPause = gameState === "paused";
  const isWin = gameState === "won";

  return (
    <SudokuWrapper>
      <GameInfoWrapper>
        <GameInfo />
      </GameInfoWrapper>
      <GameAndControlWrapper>
        <BoardWrapper>
          {isPause && <GamePause />}

          {isWin && <VictoryAlert />}
          <Board />
        </BoardWrapper>
        <SudokuControlsWrapper>
          <SudokuControl>
            <Control />
          </SudokuControl>
          <SudokuNumpad>
            <Numpad />
          </SudokuNumpad>
          <BtnNewGameWrapper>
            <BtnNewGame />
          </BtnNewGameWrapper>
        </SudokuControlsWrapper>
      </GameAndControlWrapper>
    </SudokuWrapper>
  );
}

const BtnNewGameWrapper = styled.div`
  display: none;
  width: 100%;
  height: 60px;
  margin-top: 12px;
  @media (min-width: 980px) {
    display: block;
  }
`;

const SudokuWrapper = styled.div`
  @media screen and (max-width: 800px) {
    max-width: 500px;
    margin: 0 auto 20px;
  }

  @media screen and (max-width: 767px) {
    margin-bottom: 0;
  }
`;

const BoardWrapper = styled.div`
  position: relative;
  width: 100%;
  flex-basis: 60%;
  min-width: 250px;
  max-width: 500px;
  background-color: #f3f6fa;
`;

const GameAndControlWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 801px) {
    flex-direction: row;
  }
`;

const SudokuControlsWrapper = styled.div`
  width: 100%;
  min-width: 100px;
  max-width: none;
  flex-basis: 40%;
  margin: 0;
  padding: 0;
  transition: opacity 0.3s ease-in-out;

  @media (min-width: 801px) {
    display: flex;
    flex-direction: column;
    width: 50%;
    flex-basis: 48%;
    margin: 0 0 0 20px;
  }

  @media screen and (min-width: 1070px) {
    flex-basis: 40%;
  }
`;

const SudokuControl = styled.div`
  position: relative;
  width: 100%;
  padding: 0 2.5%;
  margin-top: 20px;

  @media (min-width: 801px) {
    padding: 0;
    margin-top: 14px;
    margin-bottom: 10px;
    flex: 0 0 auto;
  }

  @media screen and (min-width: 700px) {
    padding: 0 6%;
  }

  @media screen and (min-width: 980px) {
    margin-top: 0;
  }

  @media screen and (min-width: 1100px) {
    width: 100%;
    padding: 0 2.5%;
  }
`;
const SudokuNumpad = styled.div`
  width: 100%;
  margin: 15px 0;

  @media (min-width: 801px) {
    flex-grow: 1;
    position: relative;
    margin: 0;
  }
`;
