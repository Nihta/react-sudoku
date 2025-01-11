import styled from "styled-components";

export const AboutSudoku = () => {
  return (
    <Container>
      <Group>
        <H2>About Sudoku</H2>
        <P>
          The popular Japanese puzzle game Sudoku is based on the logical
          placement of numbers. An online game of logic, Sudoku doesn’t require
          any calculation nor special math skills; all that is needed are brains
          and concentration.
        </P>
      </Group>

      <Group>
        <H2>How to play Sudoku</H2>
        <P>
          The goal of Sudoku is to fill in a 9x9 grid with digits so that each
          column, row, and 3x3 section contain the numbers between 1 to 9. At
          the beginning of the game, the 9x9 grid will have some of the squares
          filled in. Your job is to use logic to fill in the missing digits and
          complete the grid. Don’t forget, a move is incorrect if:
        </P>

        <Ul>
          <Li>Any row contains more than one of the same number from 1 to 9</Li>
          <Li>
            Any column contains more than one of the same number from 1 to 9
          </Li>
          <Li>
            Any 3x3 grid contains more than one of the same number from 1 to 9
          </Li>
        </Ul>
      </Group>

      <Group>
        <H2>Sudoku Tips</H2>
        <P>
          Sudoku is a fun puzzle game once you get the hang of it. At the same
          time, learning to play Sudoku can be a bit intimidating for beginners.
          So, if you are a complete beginner, here are a few Sudoku tips that
          you can use to improve your Sudoku skills.
        </P>

        <Ul>
          <Li>
            Tip 1: Look for rows, columns of 3x3 sections that contain 5 or more
            numbers. Work through the remaining empty cells, trying the numbers
            that have not been used. In many cases, you will find numbers that
            can only be placed in one position considering the other numbers
            that are already in its row, column, and 3x3 grid.
          </Li>
          <Li>
            Tip 2: Break the grid up visually into 3 columns and 3 rows. Each
            large column will have 3, 3x3 grids and each row will have 3, 3x3
            grids. Now, look for columns or grids that have 2 of the same
            number. Logically, there must be a 3rd copy of the same number in
            the only remaining 9-cell section. Look at each of the remaining 9
            positions and see if you can find the location of the missing
            number.
          </Li>
        </Ul>
      </Group>
    </Container>
  );
};

const Container = styled.section`
  color: #6e7c8c;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 1.63;

  margin-top: 28px;
  @media (min-width: 768px) {
    margin-top: 48px;
  }
`;

const Group = styled.div`
  margin-bottom: 28px;
  @media (min-width: 768px) {
    margin-bottom: 48px;
  }
`;

const H2 = styled.h2`
  color: #344861;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 1.21;
  vertical-align: middle;
  margin-bottom: 20px;
`;

const P = styled.p`
  margin-bottom: 16px;
`;

const Ul = styled.ul`
  background-color: #f3f6fa;
  border-radius: 5px;
  display: block;
  list-style: disc outside;
  // min 768
  margin: 30px 0 0;
  padding: 30px 30px 30px 45px;

  margin: 20px 0 0;
  padding: 20px 20px 20px 33px;
  @media (min-width: 768px) {
    margin: 30px 0 0;
    padding: 30px 30px 30px 45px;
  }
`;

const Li = styled.li`
  &:first-child {
    margin-top: 0;
  }

  margin-top: 15px;
  padding-left: 13px;
`;
