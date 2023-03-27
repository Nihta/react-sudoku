import styled from "styled-components";
import { trySolve } from "../utils/sudokuRules";
import Pressable from "./base/Pressable";

export default function Dev() {
  const onClick = async () => {
    let flag = false;
    do {
      flag = trySolve();
      await new Promise((r) => setTimeout(r, 100));
    } while (flag);
  };

  return (
    <div>
      <Item onClick={onClick}>Try to solve</Item>
    </div>
  );
}

const Item = styled(Pressable)`
  padding: 10px;
  margin: 10px;
  text-align: center;
  border-color: var(--color-primary);
  border-width: 2px;
  border-style: solid;
  color: var(--color-primary);
  font-weight: 600;
`;
