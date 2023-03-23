import React from "react";
import "./GameInfo.scss";

const Time = () => {
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
