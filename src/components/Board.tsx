import React, { useEffect } from "react";
import styled from "styled-components";

import Cell from "./Cell";

import { useMoveKeyboard } from "../hooks/sudokuHooks";
import { setPuzzle } from "../zustand/Sudoku";
import { dataPuzzles } from "../data/sudokuPuzzles";
import useSudokuStore from "../zustand/useSudokuStore";
import { decodeSudokuPuzzle } from "../utils/sudoku";

function Board() {
  const puzzle = useSudokuStore((st) => st.puzzle);
  useEffect(() => {
    if (!puzzle) {
      setPuzzle(decodeSudokuPuzzle(dataPuzzles["easy"][0]));
    }
  }, [puzzle]);

  useMoveKeyboard();

  return (
    <BoardWrapper>
      <BoardGrid>
        {Array.from({ length: 81 }, (_, i) => (
          <Cell idx={i} key={i} />
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
