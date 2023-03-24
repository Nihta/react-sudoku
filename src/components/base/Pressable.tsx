import styled from "styled-components";

const Pressable = styled.div`
  cursor: pointer;
  user-select: none;
  border-radius: 5px;

  background-color: #eaeef4;
  &:hover {
    background-color: #dce3ed;
  }
  &:active {
    background-color: #d2dae7;
  }
`;

export default Pressable;
