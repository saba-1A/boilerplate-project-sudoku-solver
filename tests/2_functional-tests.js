const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
  const validPuzzleSolution = '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
  
  test('Solve a puzzle with valid puzzle string', function(done) {
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: validPuzzleString})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.solution, validPuzzleSolution)
      done()
      })
    })
  
  test('Solve a puzzle with missing puzzle string', function(done) {
    chai.request(server)
    .post('/api/solve')
    .send({})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Required field missing')
      done()
      })
    })

  const invalidPuzzleStringChars = '..839.t.5g5.....964..1.......16.29846.9.312.0..754.....62..5.78.8...3.2...492...1'
  test('Solve a puzzle with invalid characters', function(done) {
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: invalidPuzzleStringChars})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Invalid characters in puzzle')
      done()
      })
    })

  const invalidPuzzleStringLength = '..839.7.575..62..5.78.8...3.2...492...1'
  test('Solve a puzzle with incorrect length', function(done) {
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: invalidPuzzleStringLength})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
      done()
      })
    })

  const unsolvablePuzzle = '............................................7..754.....62..5.78.8...3.2...492...1'
  test('Solve a puzzle that cannot be solved', function(done) {
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: unsolvablePuzzle})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Puzzle cannot be solved')
      done()
      })
    })

  test('Check a puzzle placement with all fields', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: validPuzzleString, coordinate: "A1", value: "2"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.valid, true)
      done()
      })
    })

  test('Check a puzzle placement with single placement conflict', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: validPuzzleString, coordinate: "A1", value: "3"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.valid, false)
      assert.equal(res.body.conflict.length, 1)
      done()
      })
    })

  test('Check a puzzle placement with multiple placement conflicts', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: validPuzzleString, coordinate: "A1", value: "4"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.valid, false)
      assert.equal(res.body.conflict.length, 2)
      done()
      })
    })
  
  test('Check a puzzle placement with all placement conflicts', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: validPuzzleString, coordinate: "A1", value: "7"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.valid, false)
      assert.equal(res.body.conflict.length, 3)
      done()
      })
    })
  
  test('Check a puzzle placement with missing required fields', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({coordinate: "A1", value: "7"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Required field(s) missing')
      done()
      })
    })
  
  test('Check a puzzle placement with invalid characters', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: invalidPuzzleStringChars, coordinate: "A1", value: "2"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Invalid characters in puzzle')
      done()
      })
    })
  
  test('Check a puzzle placement with incorrect length', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: invalidPuzzleStringLength, coordinate: "A1", value: "2"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
      done()
      })
    })
  
  test('Check a puzzle placement with all fields', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: validPuzzleString, coordinate: "Z0", value: "2"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Invalid coordinate')
      done()
      })
    })

  test('Check a puzzle placement with invalid placement value', function(done) {
    chai.request(server)
    .post('/api/check')
    .send({puzzle: validPuzzleString, coordinate: "A1", value: "0"})
    .end(function(err, res){
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response is an obj')
      assert.equal(res.body.error, 'Invalid value')
      done()
      })
    })
});
