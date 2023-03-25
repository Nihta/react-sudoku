import styled from "styled-components";
import "./App.css";
import GlobalStyles from "./components/base/GlobalStyles";
import Sudoku from "./components/Sudoku";
import { BREAKPOINTS } from "./constants.ts";

function App() {
  return (
    <>
      <GlobalStyles />
      <header className="site-header" />
      <Container>
        <div className="site-content">
          <Sudoku />
        </div>
        <Aside />
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  padding: 10px;
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;


  @media ${BREAKPOINTS.desktop} {
    max-width: 1070px;
  }

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }

  /* @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 801px) {
    max-width: 801px;
  }

  @media (min-width: 980px) {
    .container {
      max-width: 980px;
    }
  }

  @media (min-width: 1070px) {
    max-width: 1070px;
  }

  @media (min-width: 1200px) {
    max-width: 1200px;
  }

  @media (max-height: 800px) and (min-width: 1070px) {
    max-width: 1070px;
  } */
`;

const Aside = styled.aside`
  width: 300px;
  background-color: #eee;
`;

export default App;
