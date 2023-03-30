export function getBlockIdx(row: number, col: number) {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

export function getCellPos(idx: number) {
  const row = Math.floor(idx / 9);
  const col = idx % 9;
  return {
    row,
    col,
    block: getBlockIdx(row, col),
  };
}
