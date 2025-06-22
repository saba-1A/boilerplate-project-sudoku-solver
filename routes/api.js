'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        return res.json({ error: 'Required field(s) missing' })
      }
      
      const validCoordrRegex = /^[A-I][1-9]$/ig
      if (!validCoordrRegex.test(req.body.coordinate)) {
        return res.json({ error: 'Invalid coordinate'})
      }

      const validValueRegex = /^[1-9]$/ig
      if (!validValueRegex.test(req.body.value)) {
        return res.json({ error: 'Invalid value' })
      }

      if (solver.validate(req.body.puzzle) === "invalid length") {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      } else if (solver.validate(req.body.puzzle) === "invalid characters") {
        return res.json({ error: 'Invalid characters in puzzle' })
      }

      const validRowPalement = solver.checkRowPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value)
      const validColPalement = solver.checkColPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value)
      const validGridPalement = solver.checkRegionPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value)
      
      if (validRowPalement && validColPalement && validGridPalement) {
        console.log("valid placement")
        return res.json({valid: true})
      } else {
        let conflictArray = []
        conflictArray = !validRowPalement ? [...conflictArray, "row"] : conflictArray
        conflictArray = !validColPalement ? [...conflictArray, "column"] : conflictArray
        conflictArray = !validGridPalement ? [...conflictArray, "region"] : conflictArray
        return res.json({valid: false, conflict: conflictArray})
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const reqPuzzle = req.body.puzzle
      if (!reqPuzzle) {
        return res.json({ error: 'Required field missing' })
      }
      if (solver.validate(reqPuzzle) === "valid") {
        const puzzleSolution = solver.solve(reqPuzzle)
        if (puzzleSolution === "unsolvable") {
          return res.json({ error: 'Puzzle cannot be solved' })
        }
        return res.json({solution: puzzleSolution})
      } else if (solver.validate(reqPuzzle) === "invalid length") {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      } else if (solver.validate(reqPuzzle) === "invalid characters") {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
    });
};
