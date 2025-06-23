const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');

const solver = new Solver();

const validString =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solvedString =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
  // ✅ Validation
  test('Handles a valid puzzle string of 81 characters', () => {
    assert.equal(solver.validate(validString), 'valid');
  });

  test('Handles a puzzle string with invalid characters', () => {
    assert.equal(
      solver.validate('1.5..2.8A..63.12.7.2..5.....'),
      'invalid characters'
    );
  });

  test('Handles a puzzle string with incorrect length', () => {
    assert.equal(solver.validate('1.5..2.8'), 'invalid length');
  });

  // ✅ Row validation
  test('Valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validString, 'A', '2', '3'));
  });

  test('Invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validString, 'A', '2', '5'));
  });

  // ✅ Column validation
  test('Valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validString, 'A', '2', '3'));
  });

  test('Invalid column placement', () => {
    // Updated: 2 is already in column 2, so this should fail
    assert.isFalse(solver.checkColPlacement(validString, 'A', '2', '2'));
  });

  // ✅ Region (3x3 grid) validation
  test('Valid region placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validString, 'A', '2', '3'));
  });

  test('Invalid region placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validString, 'A', '2', '6'));
  });

  // ✅ Solver
  test('Solver returns the expected solution for a valid incomplete puzzle', () => {
    assert.equal(solver.solve(validString), solvedString);
  });

  test('Solver fails on an unsolvable puzzle', () => {
    const unsolvable = validString.slice(0, 80) + 'X'; // corrupts last char
    assert.equal(solver.solve(unsolvable), 'unsolvable');
  });
});
