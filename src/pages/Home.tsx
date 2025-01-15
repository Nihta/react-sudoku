import styled from "styled-components";
import Sudoku from "../components/Sudoku";
import Dev from "../components/Dev";
import Container from "../components/base/Container";
import { AboutSudoku } from "../components/AboutSudoku";
const SHOW_DEV_TOOL = false;

function Home() {
  return (
    <>
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

export default Home;
