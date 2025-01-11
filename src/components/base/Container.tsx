import styled from "styled-components";

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 10px;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 801px) {
    max-width: 801px;
  }

  @media (min-width: 980px) {
    max-width: 980px;
  }

  @media (min-width: 1070px) {
    max-width: 1070px;
  }

  @media (min-width: 1200px) {
    max-width: 1200px;
  }

  @media (max-height: 800px) and (min-width: 1070px) {
    max-width: 1070px;
  }
`;

export default Container;
