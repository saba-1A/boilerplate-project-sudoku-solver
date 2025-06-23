const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

suite('Unit Tests', () => {
  const validPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solvedPuzzle =
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const invalidCharPuzzle =
    '1.q..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const shortPuzzle =
    '1.444..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';

  // ✔ Validate Puzzle
  test('Handles a valid puzzle string of 81 characters', (done) => {
    assert.equal(solver.validate(validPuzzle), 'valid');
    done();
  });

  test('Handles a puzzle string with invalid characters', (done) => {
    assert.equal(solver.validate(invalidCharPuzzle), 'invalid characters');
    done();
  });

  test('Handles a puzzle string that is not 81 characters in length', (done) => {
    assert.equal(solver.validate(shortPuzzle), 'invalid length');
    done();
  });

  // ✔ Row Placement
  test('Handles a valid row placement', (done) => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 'A', '2', '3'));
    done();
  });

  test('Handles an invalid row placement', (done) => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 'A', '2', '5'));
    done();
  });

  // ✔ Column Placement
  test('Handles a valid column placement', (done) => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 'A', '2', '3'));
    done();
  });

  test('Handles an invalid column placement', (done) => {
    assert.isFalse(solver.checkColPlacement(validPuzzle, 'A', '2', '7'));
    done();
  });

  // ✔ Region/Grid Placement
  test('Handles a valid region (3x3 grid) placement', (done) => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 'A', '2', '3'));
    done();
  });

  test('Handles an invalid region (3x3 grid) placement', (done) => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 'A', '2', '6'));
    done();
  });

  // ✔ Solver Functionality
  test('Valid puzzle strings pass the solver', (done) => {
    assert.equal(solver.solve(solvedPuzzle), solvedPuzzle);
    done();
  });

  test('Invalid puzzle strings fail the solver', (done) => {
    assert.equal(solver.solve(shortPuzzle), 'unsolvable');
    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    assert.equal(solver.solve(validPuzzle), solvedPuzzle);
    done();
  });
});
