import styled from "styled-components";
import { BREAKPOINTS } from "../constants";
import useSudokuStore from "../zustand/useSudokuStore";

export default function Header() {
  const actionNewGame = useSudokuStore((state) => state.actionNewGame);

  return (
    <Wrapper>
      <div />
      <NewGameButton onClick={actionNewGame}>Trò chơi mới</NewGameButton>
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

  @media ${BREAKPOINTS.mdAndLarger} {
    display: none;
  }
`;
