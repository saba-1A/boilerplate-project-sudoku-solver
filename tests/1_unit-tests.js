const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()

suite('Unit Tests', () => {
  const validTestString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
  test('Logic handles a valid puzzle string of 81 characters', function(done) {
    assert.equal(solver.validate(validTestString), "valid")
    done()
  })

  const testStringInvalidChars = '1.q..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
  test('Logic handles a puzzle string with invalid characters', function(done) {
    assert.equal(solver.validate(testStringInvalidChars), "invalid characters")
    done()
  })

  const testStringInvalidLength = '1.444..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
  test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
    assert.equal(solver.validate(testStringInvalidLength), "invalid length")
    done()
  })

  test('Logic handles a valid row placement', function(done) {
    assert.equal(solver.checkRowPlacement(validTestString, "A", "2", "3"), true)
    done()
  })

  test('Logic handles a invalid row placement', function(done) {
    assert.equal(solver.checkRowPlacement(validTestString, "A", "2", "5"), false)
    done()
  })  

  test('Logic handles a valid col placement', function(done) {
    assert.equal(solver.checkColPlacement(validTestString, "A", "2", "3"), true)
    done()
  })  

  test('Logic handles a invalid col placement', function(done) {
    assert.equal(solver.checkColPlacement(validTestString, "A", "2", "7"), false)
    done()
  })

  test('Logic handles a valid grid placement', function(done) {
    assert.equal(solver.checkRegionPlacement(validTestString, "A", "2", "3"), true)
    done()
  })  

  test('Logic handles a invalid grid placement', function(done) {
    assert.equal(solver.checkRegionPlacement(validTestString, "A", "2", "6"), false)
    done()
  })  

  const testStringSolution = "135762984946381257728459613694517832812936745357824196473298561581673429269145378"  
  test('Valid puzzle strings pass the solver', function(done) {
    assert.equal(solver.solve(testStringSolution), testStringSolution)
    done()
  })

  test('Invalid puzzle strings fail the solver', function(done) {
    assert.equal(solver.solve(testStringInvalidLength), "unsolvable")
    done()
  })
  
  test('Solver returns the expected solution for an incomplete puzzle', function(done) {
    assert.equal(solver.solve(validTestString), testStringSolution)
    done()
  })  
});
