import styled from "styled-components";
import { convertTime } from "../../../utils/timeUtils";
import Pressable from "../../../components/base/Pressable";
import { TimerPause, TimerPlay } from "../../../components/svgs";

const TimeLabel = styled.div`
  display: flex;
  align-items: center;
  color: #94a3b7;
  font-size: 16px;
  font-weight: 600;
`;

type TimerProps = {
  isPlaying: boolean;
  onToggle: () => void;
  time: number;
};

export const Timer = (props: TimerProps) => {
  return (
    <Flex>
      <TimeLabel>
        <span>{convertTime(props.time)}</span>
      </TimeLabel>
      <Toggle onClick={props.onToggle}>
        {props.isPlaying ? (
          <TimerPause />
        ) : (
          <TimerPlay className="timer-play" />
        )}
      </Toggle>
    </Flex>
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
