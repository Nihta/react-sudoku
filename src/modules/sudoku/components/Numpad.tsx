import styled from "styled-components";
import Pressable from "../../../components/base/Pressable";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type NumpadProps = {
  onClick: (n: number) => void;
};

export function Numpad({ onClick }: NumpadProps) {
  return (
    <Container>
      {arr.map((n) => (
        <NumpadItem key={n} onClick={() => onClick(n)}>
          {n}
        </NumpadItem>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  margin: 5px 0;
  grid-template-columns: repeat(9, 1fr);

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 2%;
  }
`;

const NumpadItem = styled(Pressable)`
  font-size: 36px;
  color: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 767px) {
    background: transparent;
    &:hover {
      background: transparent;
    }
    &:active {
      background: #d2dae7;
    }
  }
`;
