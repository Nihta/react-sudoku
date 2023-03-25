import React from "react";
import styled from "styled-components";
import { useInterval } from "usehooks-ts";

import { convertTime } from "../utils/sudokuUtils";
import { useGameStore } from "../zustand/useGameStore";
import useSudokuStore from "../zustand/useSudokuStore";
import Pressable from "./base/Pressable";
import { TimerPause, TimerPlay } from "./svgs";

const Time = () => {
  const time = useSudokuStore((st) => st.time);
  const incTime = useSudokuStore((st) => st.incTime);
  const gameState = useGameStore((state) => state.gameState);

  useInterval(() => {
    if (gameState === "playing") {
      incTime();
    }
  }, 1000);

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
  const gameState = useGameStore((state) => state.gameState);
  const setGamestate = useGameStore((state) => state.setGamestate);

  const toggle = () => {
    if (gameState === "paused") {
      setGamestate("playing");
    } else if (gameState === "playing") {
      setGamestate("paused");
    }
  };

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
      <Flex>
        <Time />
        {["playing", "paused"].includes(gameState) && (
          <Toggle onClick={toggle}>
            {gameState === "playing" && <TimerPause />}
            {gameState === "paused" && <TimerPlay className="timer-play" />}
          </Toggle>
        )}
      </Flex>
    </Wrapper>
  );
};

const Flex = styled.div`
  display: flex;
`;

const Toggle = styled(Pressable)`
  margin-left: 10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  svg {
    fill: #94a3b7;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .timer-play {
    margin-left: 1px;
  }
`;

const Wrapper = styled.div`
  margin-bottom: 12px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
