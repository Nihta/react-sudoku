import styled from "styled-components";
import {actionNewGame} from "../zustand/Sudoku";

export default function Header() {
  return (
    <Wrapper>
      <div />
      <NewGameButton onClick={actionNewGame}>New game</NewGameButton>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  height: 60px;
  margin-bottom: 0 0 5px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(0, 63, 123, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 980px) {
    height: 70px;
  }
`;

const NewGameButton = styled.div`
  margin-right: 18px;
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;

  &:active {
    color: #3a90e5;
  }

  @media (min-width: 980px) {
    display: none;
  }
`;
