import styled from "styled-components";
import GlobalStyles from "./components/base/GlobalStyles";
// import Dev from "./components/Dev";
import { AboutSudoku } from "./components/AboutSudoku";
import Container from "./components/base/Container";
import Dev from "./components/Dev";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sudoku from "./components/Sudoku";

const SHOW_DEV_TOOL = false;

function App() {
  return (
    <Wrapper>
      <GlobalStyles />
      <Header />

      <div style={{ flex: 1 }}>
        <SiteContainer>
          <SiteContent>
            <Sudoku />
          </SiteContent>

          {SHOW_DEV_TOOL && (
            <Aside>
              <Dev />
            </Aside>
          )}
        </SiteContainer>

        <Container>
          <AboutSudoku />
        </Container>
      </div>

      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

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
    /* max-width: calc(100% - 180px); */
    /* margin-right: 20px; */
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
