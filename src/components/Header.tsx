import React, { useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "usehooks-ts";

import { NewGameContent } from "./BtnNewGame";

export default function Header() {
  const [active, setActive] = useState(false);

  const ref = React.useRef(null);

  const toggle = () => {
    setActive((a) => !a);
  };

  useOnClickOutside(ref, () => {
    if (active) {
      setActive(false);
    }
  });

  return (
    <Wrapper>
      <div />
      <Content ref={ref}>
        <NewGameButton onClick={toggle}>New game</NewGameButton>
        {active && (
          <NewGameContent
            callBack={() => {
              setActive(false);
            }}
          />
        )}
      </Content>
    </Wrapper>
  );
}

const NewGameWrapper = styled.div`
  position: relative;
`;

const Content = styled(NewGameWrapper)`
  @media (min-width: 980px) {
    display: none;
  }
`;

const Wrapper = styled.header`
  height: 60px;
  margin: 0 0 0 5px;
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
