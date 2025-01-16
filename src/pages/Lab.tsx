import { produce } from "immer";
import React, { useRef } from "react";
import styled from "styled-components";
import Container from "../components/base/Container";
import { dataPuzzles } from "../data/sudokuPuzzles";
import { Board } from "../modules/sudoku/components/Board";
import { CellState } from "../modules/sudoku/components/Cell";
import { CellDebug } from "../modules/sudoku/components/CellDebug";
import { convertPuzzle, preHandle } from "../modules/sudoku/utils";
import { getRandomElementFromArray } from "../utils/arrayUtils";
import { decodeSudokuPuzzle } from "../utils/sudoku";
import { shuffleSudoku } from "../utils/sudoku/shuffleSudoku";
import {
  getBlockByRowCol,
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../utils/sudoku/utils";
import { lastRemainingCell } from "../modules/sudoku/technique/lastRemainingCell";
import { ETechnique } from "../types/technique.type";

const initGame = () => {
  const puzzle = decodeSudokuPuzzle(
    shuffleSudoku(getRandomElementFromArray(dataPuzzles["easy"]))
  );
  const { cells } = convertPuzzle(puzzle);
  return cells;
};

type GameStatus = "playing" | "win" | "lose" | "hint";

type HintActions = {
  setValues?: [{ position: number; value: number }];
};

export default function Lab() {
  const hintActions = useRef<HintActions>({});

  const [gameState, setGameState] = React.useState<GameStatus>("playing");

  const [highlightBlocks, setHighlightBlocks] = React.useState<number[]>([]);
  const [highlightRows, setHighlightRows] = React.useState<number[]>([]);
  const [highlightCols, setHighlightCols] = React.useState<number[]>([]);

  const [cells, setCells] = React.useState<CellState[]>(initGame());

  const newGame = () => {
    const puzzle = decodeSudokuPuzzle(
      shuffleSudoku(getRandomElementFromArray(dataPuzzles["easy"]))
    );
    const { cells } = convertPuzzle(puzzle);

    // reset all states
    setHighlightBlocks([]);
    setHighlightRows([]);
    setHighlightCols([]);
    setGameState("playing");

    setCells(cells);
  };

  const handleCellClick = (row: number, col: number) => {
    // if (gameState === "hint") {
    //   console.info("You are in hint mode, can't click cell");
    //   return;
    // }

    const blockIdx = getBlockByRowCol(row, col);

    setCells(
      produce((draft) => {
        // reset all status
        draft.forEach((cell) => {
          cell.selected = false;
          cell.status = "normal";
        });

        const cellIdx = row * 9 + col;
        draft[cellIdx].selected = true;

        // high light related cells: row, col, block
        const relatedIdx = new Set([
          ...getIdxByRow(row),
          ...getIdxByCol(col),
          ...getIdxByBlock(blockIdx),
        ]);
        relatedIdx.forEach((idx) => {
          draft[idx].status = "high-light";
        });

        // high light same number in the board
        if (draft[cellIdx].value) {
          for (let i = 0; i < 81; i++) {
            if (draft[i].value === draft[cellIdx].value && !relatedIdx.has(i)) {
              draft[i].status = "high-light-number";
            }
          }
        }
      })
    );
  };

  const hint = (): boolean => {
    const { rows, cols, cells: orgCells, blocks } = preHandle(cells);

    const res = lastRemainingCell({ cells: orgCells, rows, cols, blocks });
    if (res && res.type === ETechnique.lastRemainingCell) {
      const { payload } = res;
      console.info("Last remaining cell", payload);

      hintActions.current = {
        setValues: [{ position: payload.position, value: payload.value }],
      };

      if (payload.type === "block") {
        setHighlightBlocks([payload.typeDetail]);
      } else if (payload.type === "row") {
        setHighlightRows([payload.typeDetail]);
      } else if (payload.type === "col") {
        setHighlightCols([payload.typeDetail]);
      }
      // addHistory();
      // clickCell(res.payload.position);
      // setCellVal(res.payload.position, res.payload.value, true);

      setCells(
        produce((draft) => {
          // clear all status
          draft.forEach((cell) => {
            cell.status = "normal";
            cell.selected = false;
          });

          draft[payload.position].selected = true;
          draft[payload.position].blinkValue = payload.value;

          // high light related cells: row, col
          payload.rowRelated.forEach((rowIdx) => {
            getIdxByRow(rowIdx).forEach((idx) => {
              draft[idx].status = "high-light";
              if (draft[idx].value === payload.value) {
                draft[idx].status = "high-light-number";
              }
            });
          });

          payload.colRelated.forEach((colIdx) => {
            getIdxByCol(colIdx).forEach((idx) => {
              draft[idx].status = "high-light";
              if (draft[idx].value === payload.value) {
                draft[idx].status = "high-light-number";
              }
            });
          });

          payload.blockRelated.forEach((blockIdx) => {
            getIdxByBlock(blockIdx).forEach((idx) => {
              draft[idx].status = "high-light";
              if (draft[idx].value === payload.value) {
                draft[idx].status = "high-light-number";
              }
            });
          });
        })
      );

      setGameState("hint");
      return true;
    }

    return false;
  };

  const applyHint = () => {
    if (gameState !== "hint") {
      console.error("You are not in hint mode");
      return;
    }

    if (hintActions.current?.setValues?.length) {
      hintActions.current.setValues.forEach((action) => {
        setCells(
          produce((draft) => {
            draft[action.position].value = action.value;
            draft[action.position].blinkValue = undefined;
            draft[action.position].isOrigin = true;
          })
        );
      });
    }

    setHighlightBlocks([]);
    setHighlightRows([]);
    setHighlightCols([]);

    setGameState("playing");
    handleCellClick(0, 0);
  };

  return (
    <Container className="">
      <Wrapper>
        <Board
          cells={cells}
          onCellClick={handleCellClick}
          highlightBlocks={highlightBlocks}
          highlightRows={highlightRows}
          highlightCols={highlightCols}
        />
      </Wrapper>

      <div className="">
        <button onClick={() => newGame()}>New Game</button>
        <button onClick={() => hint()}>Hint</button>
        <button onClick={() => applyHint()} disabled={gameState !== "hint"}>
          Apply Hint
        </button>
      </div>

      <CellDebug />
    </Container>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  margin: 15px;
`;
