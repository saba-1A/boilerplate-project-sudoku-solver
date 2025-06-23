'use strict';
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  // ✅ Check puzzle placement
  app.post('/api/check', (req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // 🔴 Validate required fields
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // 🔴 Validate coordinate format (only A–I and 1–9 allowed)
    if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // 🔴 Validate value format (1–9)
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    // 🔴 Validate puzzle string
    const validation = solver.validate(puzzle);
    if (validation === 'invalid length') {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }
    if (validation === 'invalid characters') {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // ✅ Extract row and column
    const row = coordinate[0].toUpperCase();
    const col = coordinate[1];

    // ✅ Check for placement conflicts
    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
    if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  // ✅ Solve the entire puzzle
  app.post('/api/solve', (req, res) => {
    const { puzzle } = req.body;

    // 🔴 Required check
    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }

    // 🔴 Puzzle validation
    const validation = solver.validate(puzzle);
    if (validation === 'invalid length') {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }
    if (validation === 'invalid characters') {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // ✅ Try solving
    const solution = solver.solve(puzzle);
    if (solution === 'unsolvable') {
      return res.json({ error: 'Puzzle cannot be solved' });
    }

    return res.json({ solution });
  });
};
