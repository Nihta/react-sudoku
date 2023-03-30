import React from "react";
import styled from "styled-components";
import { useInterval } from "usehooks-ts";

import { actionNewGame, incTime } from "../zustand/Sudoku";
import { useGameStore } from "../zustand/useGameStore";
import useSudokuStore from "../zustand/useSudokuStore";
import Pressable from "./base/Pressable";
import { TimerPause, TimerPlay } from "./svgs";
import SelectDifficulty from "./SelectDifficulty";
import { convertTime } from "../utils/timeUtils";

const Time = () => {
  const time = useSudokuStore((st) => st.time);
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
  const setGameState = useGameStore((state) => state.setGameState);

  const toggle = () => {
    if (gameState === "paused") {
      setGameState("playing");
    } else if (gameState === "playing") {
      setGameState("paused");
    }
  };

  return (
    <Wrapper>
      <SelectDifficulty onChange={actionNewGame} />
      <Flex>
        <Time />
        {["playing", "paused", "idle"].includes(gameState) && (
          <Toggle onClick={toggle}>
            {(gameState === "playing" || gameState === "idle") && (
              <TimerPause />
            )}
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default GameInfo;
