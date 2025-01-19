import { AboutSudoku } from "../components/AboutSudoku";
import Container from "../components/base/Container";
import { Sudoku } from "../modules/sudoku/components/Sudoku";

function Home() {
  return (
    <>
      <Sudoku />

      <Container>
        <AboutSudoku />
      </Container>
    </>
  );
}

export default Home;
