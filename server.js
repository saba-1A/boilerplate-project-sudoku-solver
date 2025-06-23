'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const expect = require('chai').expect;

const fccTestingRoutes = require('./routes/fcctesting.js');
const apiRoutes = require('./routes/api.js');
const runner = require('./test-runner');

const app = express();

// === Middleware ===
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); // Allow CORS for FCC tests

// Built-in body parser for POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Routes ===

// Home page
app.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// FCC testing routes
fccTestingRoutes(app);

// Your API routes
apiRoutes(app);

// 404 Not Found middleware
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

// === Start Server ===
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);

  // Run FCC tests after delay if in test mode
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try {
        runner.run();
      } catch (err) {
        console.log('Tests are not valid:');
        console.error(err);
      }
    }, 1500);
  }
});

module.exports = app; // for FCC and functional testing
