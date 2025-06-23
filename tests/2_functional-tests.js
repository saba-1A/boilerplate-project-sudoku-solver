const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solvedString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Functional Tests', () => {
  // Solve API tests
  test('Solve a puzzle with valid puzzle string', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, solvedString);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5..abc9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5..' }) // too short
      .end((err, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved', (done) => {
    const badPuzzle = puzzleString.slice(0, 80) + '1'; // force unsolvable
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: badPuzzle })
      .end((err, res) => {
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  // Check API tests
  test('Check a puzzle placement with all fields', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A2',
        value: '3'
      })
      .end((err, res) => {
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single conflict', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A2',
        value: '5'
      })
      .end((err, res) => {
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ['row']);
        done();
      });
  });

  test('Check a puzzle placement with multiple conflicts', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A2',
        value: '2'
      })
      .end((err, res) => {
        assert.isFalse(res.body.valid);
        assert.includeMembers(res.body.conflict, ['row', 'column']);
        done();
      });
  });

  test('Check a puzzle placement with all conflicts', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A2',
        value: '1'
      })
      .end((err, res) => {
        assert.isFalse(res.body.valid);
        assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: '1' })
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters', (done) => {
    const puzzle = puzzleString.slice(0, 1) + 'x' + puzzleString.slice(2);
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle,
        coordinate: 'A2',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with invalid coordinate', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'Z9',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid value', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A2',
        value: '10'
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});
