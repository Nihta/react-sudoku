import React, { useEffect } from "react";
import styled from "styled-components";

import Cell from "./Cell";

import { easyPuzzles } from "../data/sudokuPuzzles";
import { useMoveKeybroad } from "../hooks/sudokuHooks";
import useSudokuStore from "../zustand/useSudokuStore";

function Board() {
  const { setPuzzle } = useSudokuStore((state) => state);

  useEffect(() => {
    setPuzzle(easyPuzzles[0]);
  }, [setPuzzle]);

  useMoveKeybroad();

  return (
    <BoardWrapper>
      <BoardGrid>
        {Array.from({ length: 9 }, (_, i) => (
          <React.Fragment key={i}>
            {Array.from({ length: 9 }, (_, j) => (
              <Cell row={i} col={j} key={`${i}${j}`} />
            ))}
          </React.Fragment>
        ))}
      </BoardGrid>
    </BoardWrapper>
  );
}

const BoardWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  text-align: center;
  position: relative;
  border: 2px solid var(--color-sudoku-border);

  &::before,
  &::after {
    content: "";
    position: absolute;
    pointer-events: none;
    z-index: 2;
  }

  &::before {
    left: 0;
    width: 100%;
    top: 32.99333333%;
    height: 33.7533333%;
    border-top: 2px solid var(--color-sudoku-border);
    border-bottom: 2px solid var(--color-sudoku-border);
  }

  &::after {
    top: 0;
    height: 100%;
    left: 32.9333333%;
    width: 33.7833333%;
    border-left: 2px solid var(--color-sudoku-border);
    border-right: 2px solid var(--color-sudoku-border);
  }
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  width: 100%;
  height: 100%;
`;

export default Board;
