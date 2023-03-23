import React from "react";
import { useInterval } from "usehooks-ts";
import useSudokuStore from "../zustand/useSudokuStore";
import "./GameInfo.scss";

const Time = () => {
  const time = useSudokuStore((st) => st.time);
  const incTime = useSudokuStore((st) => st.incTime);

  useInterval(incTime, 1000);

  const timeStr =
    `${Math.floor(time / 60)}`.padStart(2, "0") +
    ":" +
    `${time % 60}`.padStart(2, "0");

  return (
    <div className="game-info-time">
      <span>{timeStr}</span>
    </div>
  );
};

const TimeMemo = React.memo(Time);

const GameInfo = () => {
  return (
    <div className="game-info-wrapper">
      <div className="game-info-level__wrapper">
        <span className="game-info-level__title">Độ khó:</span>
        <div className="game-info-level__items">
          <span className="game-info-level__item active">Dễ</span>
        </div>
      </div>
      <TimeMemo />
    </div>
  );
};

export default GameInfo;
