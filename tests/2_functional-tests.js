const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');

let solver = new Solver();

const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solvedString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
  test('Valid puzzle string of 81 characters', () => {
    assert.equal(solver.validate(validString), 'valid');
  });

  test('Puzzle with invalid characters', () => {
    assert.equal(solver.validate('1.5..2.8A..63.12.7.2..5.....'), 'invalid characters');
  });

  test('Puzzle with incorrect length', () => {
    assert.equal(solver.validate('1.5..2.8'), 'invalid length');
  });

  test('Valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validString, 'A', '2', '3'));
  });

  test('Invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validString, 'A', '2', '5'));
  });

  test('Valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validString, 'A', '2', '3'));
  });

  test('Invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(validString, 'A', '2', '8'));
  });

  test('Valid region placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validString, 'A', '2', '3'));
  });

  test('Invalid region placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validString, 'A', '2', '6'));
  });

  test('Solver returns solution for a valid puzzle', () => {
    assert.equal(solver.solve(validString), solvedString);
  });

  test('Solver fails on unsolvable puzzle', () => {
    const badPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    assert.equal(solver.solve(badPuzzle), 'unsolvable');
  });
});
