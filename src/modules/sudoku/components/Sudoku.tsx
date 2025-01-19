import React from "react";
import styled from "styled-components";
import GamePause from "../../../components/GamePause";
import Container from "../../../components/base/Container";
import { useInterval } from "../../../hooks/useInterval";
import { useKeyboard } from "../hooks/useKeyboard";
import { actionDelete } from "../stores/actionDelete";
import { actionHint, doActionHint } from "../stores/actionHint";
import { actionInputCell } from "../stores/actionInputCell";
import { actionNewGame } from "../stores/actionNewGame";
import { actionToggleNote } from "../stores/actionToggleNote";
import { actionTogglePlaying } from "../stores/actionTogglePlaying";
import { actionUndo } from "../stores/actionUndo";
import { actionClickCell, useBoardStore } from "../stores/useBoard";
import { useGameStore } from "../stores/useGame";
import { Board } from "./Board";
import { Control } from "./Control";
import { GameVictoryAlert } from "./GameVictoryAlert";
import { Numpad } from "./Numpad";
import SelectDifficulty from "./SelectDifficulty";
import { SmartHint } from "./SmartHint";
import { Timer } from "./Timer";
import BtnNewGame from "./BtnNewGame";
import toast from "react-hot-toast";
// import { HintInfo } from "./HintInfo";

export function Sudoku() {
  const cells = useBoardStore((state) => state.cells);
  const notes = useBoardStore((st) => st.notes);
  const highlightBlocks = useBoardStore((state) => state.highlightBlocks);
  const highlightRows = useBoardStore((state) => state.highlightRows);
  const highlightCols = useBoardStore((state) => state.highlightCols);
  const mode = useBoardStore((state) => state.mode);
  const gameState = useGameStore((state) => state.state);
  const time = useGameStore((state) => state.time);
  const difficulty = useBoardStore((state) => state.difficulty);

  // auto new game if not played yet
  React.useLayoutEffect(() => {
    if (cells.length === 0) {
      actionNewGame();
    }
  }, [cells.length]);

  useKeyboard();

  const isWin = gameState === "win";

  React.useEffect(() => {
    console.log("gameState", gameState);
  }, [gameState]);

  const isPlaying = gameState === "playing";

  useInterval(() => {
    // pause if win or hint mode
    if (isWin || mode === "hint") {
      return;
    }

    if (isPlaying) {
      useGameStore.getState().incrementTime();
    }
  }, 1000);

  return (
    <SiteContainer>
      <SiteContent>
        <SudokuWrapper>
          <GameInfoWrapper>
            <SelectDifficulty
              difficulty={difficulty}
              onDifficultyChange={(diff) => {
                actionNewGame(diff);
              }}
            />
            <Timer
              isPlaying={isPlaying}
              onToggle={actionTogglePlaying}
              time={time}
            />
          </GameInfoWrapper>
          <GameAndControlWrapper>
            <BoardWrapper>
              {gameState === "pause" && <GamePause />}
              {isWin && <GameVictoryAlert difficulty="easy" time={99} />}
              <Board
                hiddenCells={gameState === "pause"}
                cells={cells}
                notes={notes}
                onCellClick={(row, col) => {
                  // todo: disable other actions when in hint mode
                  if (mode === "hint") {
                    return;
                  }
                  actionClickCell(row, col);
                }}
                highlightBlocks={highlightBlocks}
                highlightRows={highlightRows}
                highlightCols={highlightCols}
              />
            </BoardWrapper>
            <SudokuControlsWrapper>
              {mode === "hint" && (
                <SmartHint
                  title={useBoardStore.getState().hintActions!.title}
                  onDone={doActionHint}
                />
              )}

              <SudokuControl>
                <Control
                  actionDelete={actionDelete}
                  actionHint={actionHint}
                  actionNote={actionToggleNote}
                  actionUndo={actionUndo}
                  noteMode={mode === "note"}
                  hintMode={mode === "hint"}
                />
              </SudokuControl>
              <NumpadContainer>
                <Numpad onClick={actionInputCell} />
              </NumpadContainer>
              <BtnNewGameWrapper>
                <BtnNewGame
                  onNewGame={(level) => {
                    actionNewGame(level);
                  }}
                  onRestart={() => {
                    // actionNewGame(difficulty);
                    toast.error("This feature is not available yet.");
                  }}
                />
              </BtnNewGameWrapper>
            </SudokuControlsWrapper>
          </GameAndControlWrapper>
        </SudokuWrapper>
      </SiteContent>
    </SiteContainer>
  );
}

const SiteContainer = styled(Container)`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SiteContent = styled.div`
  flex-basis: 100%;

  @media screen and (min-width: 768px) {
    /* max-width: calc(100% - 180px); */
    /* margin-right: 20px; */
  }

  @media screen and (min-width: 1070px) {
    max-width: calc(100% - 320px);
  }
`;

const SudokuWrapper = styled.div`
  position: relative;
  @media screen and (max-width: 800px) {
    max-width: 500px;
    margin: 0 auto 20px;
  }

  @media screen and (max-width: 767px) {
    margin-bottom: 0;
  }
`;

const BtnNewGameWrapper = styled.div`
  display: none;
  width: 100%;
  height: 60px;
  margin-top: 12px;
  @media (min-width: 980px) {
    display: block;
  }
`;

const BoardWrapper = styled.div`
  position: relative;
  width: 100%;
  flex-basis: 60%;
  min-width: 250px;
  max-width: 500px;
  /* background-color: #f3f6fa; */
`;

const GameInfoWrapper = styled.div`
  width: 100%;
  margin-bottom: 12px;
  position: relative;
  margin-top: 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;

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

const GameAndControlWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 801px) {
    flex-direction: row;
  }
`;

const SudokuControlsWrapper = styled.div`
  position: relative;
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
const NumpadContainer = styled.div`
  width: 100%;
  margin: 15px 0;

  @media (min-width: 801px) {
    flex-grow: 1;
    position: relative;
    margin: 0;
  }
`;
