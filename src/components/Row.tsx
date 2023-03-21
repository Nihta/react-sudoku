import Cell from "./Cell";

type RowProps = {
  row: number;
};

function Row(props: RowProps) {
  const { row } = props;

  return (
    <>
      <div className="sudoku-row">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
          <Cell row={row} col={val} key={val} />
        ))}
      </div>
    </>
  );
}

export default Row;
