import styled from "styled-components";
import GlobalStyles from "./components/base/GlobalStyles";
import Header from "./components/Header";
import Sudoku from "./components/Sudoku";

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <Container>
        <SiteContent>
          <Sudoku />
        </SiteContent>
        <Aside />
      </Container>
    </>
  );
}

const Container = styled.div`
  padding: 0 10px;
  margin: 0 auto;
  width: 100%;

  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
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

const SiteContent = styled.div`
  flex-basis: 100%;

  @media screen and (min-width: 768px) {
    max-width: calc(100% - 180px);
    margin-right: 20px;
  }

  @media screen and (min-width: 1070px) {
    max-width: calc(100% - 320px);
  }
`;

const Aside = styled.aside`
  min-height: 60px;
  background-color: #eee;

  @media (min-width: 768px) {
    display: block;
    width: 160px;
    min-width: 160px;
    margin-top: 20px;
  }

  @media screen and (min-width: 1070px) {
    width: 300px;
    min-width: 300px;
  }
`;

export default App;
