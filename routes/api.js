'use strict';
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.post('/api/check', (req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value)
      return res.json({ error: 'Required field(s) missing' });

    if (!/^[A-I][1-9]$/i.test(coordinate))
      return res.json({ error: 'Invalid coordinate' });

    if (!/^[1-9]$/.test(value))
      return res.json({ error: 'Invalid value' });

    const validation = solver.validate(puzzle);
    if (validation !== "valid")
      return res.json({ error: validation === "invalid length"
        ? 'Expected puzzle to be 81 characters long'
        : 'Invalid characters in puzzle' });

    const row = coordinate[0];
    const col = coordinate[1];

    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push("row");
    if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push("column");
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push("region");

    if (conflicts.length === 0) return res.json({ valid: true });
    return res.json({ valid: false, conflict: conflicts });
  });

  app.post('/api/solve', (req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) return res.json({ error: 'Required field missing' });

    const validation = solver.validate(puzzle);
    if (validation !== "valid")
      return res.json({ error: validation === "invalid length"
        ? 'Expected puzzle to be 81 characters long'
        : 'Invalid characters in puzzle' });

    const solution = solver.solve(puzzle);
    if (solution === "unsolvable")
      return res.json({ error: 'Puzzle cannot be solved' });

    return res.json({ solution });
  });
};
