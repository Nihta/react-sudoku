import styled from "styled-components";
import { useGameStore } from "../zustand/useGameStore";

export default function GamePause() {
  const setGamestate = useGameStore((state) => state.setGamestate);

  const play = () => {
    setGamestate("playing");
  };

  return (
    <Wrapper>
      <Content>
        <svg
          onClick={play}
          xmlns="http://www.w3.org/2000/svg"
          className="icon-play-big"
          viewBox="0 0 60 60"
        >
          <g fill="none" fillRule="evenodd">
            <circle cx={30} cy={30} r={30} fill="#0072E3" />
            <path
              fill="#FFF"
              d="m39.12 31.98-12.56 8.64a2.4 2.4 0 0 1-3.76-1.98V21.36a2.4 2.4 0 0 1 3.76-1.97l12.56 8.63a2.4 2.4 0 0 1 0 3.96z"
            />
          </g>
        </svg>
      </Content>
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
  z-index: 9;
`;

const Content = styled.div`
  width: 60px;
  height: 60px;
`;
