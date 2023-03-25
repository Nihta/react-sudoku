import classNames from "classnames";
import styled from "styled-components";

import { useCell, useCellNote } from "../hooks/sudokuHooks";
import { useGameStore } from "../zustand/useGameStore";
import useSudokuStore from "../zustand/useSudokuStore";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
function Note({ values }: { values: number[] }) {
  return (
    <NoteWrapper>
      {arr.map((i) => (
        <NoteItem key={i}>{values.includes(i) ? i : ""}</NoteItem>
      ))}
    </NoteWrapper>
  );
}

const NoteWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  width: 100%;
  height: 100%;
  line-height: 1;
  user-select: none;
  cursor: pointer;
`;

const NoteItem = styled.div`
  font-size: 12px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #79899b;
`;

type CellProps = {
  idx: number;
};

function Cell(prop: CellProps) {
  const { idx } = prop;

  const clickCell = useSudokuStore((state) => state.clickCell);
  const gameState = useGameStore((state) => state.gameState);

  const cell = useCell(idx);
  const note = useCellNote(idx);

  if (!cell) {
    return null;
  }

  const isHasNote = note.length > 0;
  const isHide = gameState === "paused";

  const cellOnClick = () => {
    clickCell(idx);
  };

  const className = classNames({
    hide: isHide,
    incorrect: cell.status === "conflict",
    selected: cell.selected,
    highlight: cell.status === "high-light",
    "highlight-number": cell.status === "high-light-number",
    "user-type": !cell.isOrigin,
    origin: cell.isOrigin,
  });

  return (
    <CellWrapper className={className} onClick={cellOnClick}>
      {isHasNote ? (
        <Note values={note} />
      ) : (
        <CellValue>{cell.value ? cell.value : ""}</CellValue>
      )}
    </CellWrapper>
  );
}

const CellWrapper = styled.div`
  position: relative;
  border-left: 1px solid var(--color-sudoku-border-2);
  border-bottom: 1px solid var(--color-sudoku-border-2);
  &:nth-child(9n + 1),
  &:nth-child(9n + 4),
  &:nth-child(9n + 7) {
    border-left: none;
  }
  &:nth-last-child(-n + 9),
  &:nth-child(-n + 27):nth-child(n + 19),
  &:nth-child(-n + 54):nth-child(n + 46) {
    border-bottom: none;
  }
  &:nth-child(-n + 9) {
    border-top: none;
  }
  &:nth-child(9n) {
    border-right: none;
  }

  &.highlight {
    background: #e2ebf3;
  }
  &.highlight-number {
    background: #c3d7ea;
  }
  &.selected,
  &:hover {
    background: #bbdefb !important;
  }
  &.incorrect {
    color: #e55c6c !important;
    background: #f7cfd6;
  }
  &.origin {
    color: #344861 !important;
  }
  &.user-type {
    color: #006fde;
  }

  &.hide {
    color: transparent !important;
    background: transparent !important;
  }
`;

const CellValue = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  font-size: 36px;
  user-select: none;
`;

export default Cell;
