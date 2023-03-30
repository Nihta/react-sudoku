import styled from "styled-components";
import GlobalStyles from "./components/base/GlobalStyles";
import Dev from "./components/Dev";
import Header from "./components/Header";
import Sudoku from "./components/Sudoku";
import Container from "./components/base/Container";

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <SiteContainer>
        <SiteContent>
          <Sudoku />
        </SiteContent>
        <Aside>
          <Dev />
        </Aside>
      </SiteContainer>
    </>
  );
}

const SiteContainer = styled(Container)`
  margin-bottom: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (min-width: 768px) {
    flex-direction: row;
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
