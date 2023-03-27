import styled from "styled-components";
import { convertTime } from "../utils/sudokuUtils";
import useSudokuStore from "../zustand/useSudokuStore";
import { useGameStore } from "../zustand/useGameStore";

export default function VictoryAlert() {
  const time = useSudokuStore((state) => state.time);
  const difficulty = useGameStore((state) => state.difficulty);

  return (
    <Wrapper>
      <Title>Congratulations</Title>
      <ListItem>
        <span>Difficulty</span>
        <span>{difficulty}</span>
      </ListItem>
      <ListItem>
        <span>Time</span>
        <span>{convertTime(time)}</span>
      </ListItem>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 99;
  background-color: var(--color-primary);
  color: white;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ListItem = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;
