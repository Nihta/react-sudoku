import React from "react";
import styled from "styled-components";
import { useInterval } from "usehooks-ts";

import { convertTime } from "../utils/sudokuUtils";
import useSudokuStore from "../zustand/useSudokuStore";

const Time = () => {
  const time = useSudokuStore((st) => st.time);
  const incTime = useSudokuStore((st) => st.incTime);

  useInterval(incTime, 1000);

  return (
    <TimeLabel>
      <span>{convertTime(time)}</span>
    </TimeLabel>
  );
};

const TimeLabel = styled.div`
  display: flex;
  align-items: center;
  color: #94a3b7;
  font-size: 16px;
  font-weight: 600;
`;

const GameInfo = () => {
  return (
    <Wrapper>
      <LevelWrapper>
        <LevelTitle>Độ khó:</LevelTitle>
        <LevelItems>
          <LevelItem active>Dễ</LevelItem>
          <LevelItem>Trung bình</LevelItem>
          <LevelItem>Khó</LevelItem>
        </LevelItems>
      </LevelWrapper>
      <Time />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin-bottom: 12px;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const LevelWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const LevelTitle = styled.span`
  margin-right: 7px;
  color: #94a3b7;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  display: flex;
  align-items: center;
`;

const LevelItems = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.25;
`;

const LevelItem = styled.span<{
  active?: boolean;
}>`
  padding: 8px;
  margin-right: 4px;
  font-weight: 600;
  border-radius: 4px;
  color: #6e7c8c;

  &:hover {
    background-color: #f1f4f8;
  }
  &:active {
    background-color: #eaeef4;
  }

  ${(p) => p.active && ` color: #0072e3;`}
`;

export default GameInfo;
