class SudokuSolver {
  validate(puzzleString) {
    if (/[^1-9.]/.test(puzzleString)) return "invalid characters";
    if (puzzleString.length !== 81) return "invalid length";
    return "valid";
  }

  coordToIndex(row, column) {
    const rows = "ABCDEFGHI";
    const rowIndex = rows.indexOf(row.toUpperCase());
    return rowIndex * 9 + (column - 1);
  }

  findRowNumber(index) {
    return Math.floor(index / 9);
  }

  findColNumber(index) {
    return index % 9;
  }

  findGridNumber(index) {
    const row = this.findRowNumber(index);
    const col = this.findColNumber(index);
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  checkRowPlacement(puzzle, row, column, value) {
    const rowIndex = "ABCDEFGHI".indexOf(row.toUpperCase());
    for (let i = 0; i < 9; i++) {
      const index = rowIndex * 9 + i;
      if (puzzle[index] === value && i !== column - 1) return false;
    }
    return true;
  }

  checkColPlacement(puzzle, row, column, value) {
    const colIndex = column - 1;
    const checkIndex = this.coordToIndex(row, column);
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + colIndex;
      if (puzzle[index] === value && index !== checkIndex) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    const index = this.coordToIndex(row, column);
    const startRow = Math.floor(this.findRowNumber(index) / 3) * 3;
    const startCol = Math.floor(this.findColNumber(index) / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const i = (startRow + r) * 9 + (startCol + c);
        if (puzzle[i] === value && i !== index) return false;
      }
    }
    return true;
  }

  solve(puzzle) {
    const validation = this.validate(puzzle);
    if (validation !== "valid") return "unsolvable";

    const solveRecursive = (board) => {
      const index = board.indexOf('.');
      if (index === -1) return board;

      const row = Math.floor(index / 9);
      const col = index % 9;
      const rowChar = 'ABCDEFGHI'[row];

      for (let num = 1; num <= 9; num++) {
        const val = String(num);
        if (
          this.checkRowPlacement(board, rowChar, col + 1, val) &&
          this.checkColPlacement(board, rowChar, col + 1, val) &&
          this.checkRegionPlacement(board, rowChar, col + 1, val)
        ) {
          const newBoard = board.slice(0, index) + val + board.slice(index + 1);
          const result = solveRecursive(newBoard);
          if (result) return result;
        }
      }

      return false;
    };

    const result = solveRecursive(puzzle);
    return result || "unsolvable";
  }
}

module.exports = SudokuSolver;
