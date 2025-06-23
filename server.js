require('dotenv').config();
const express = require('express');
const expect = require('chai').expect;
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const apiRoutes = require('./routes/api.js');
const runner = require('./test-runner');

const app = express();

// Middleware
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); // For FCC testing only

// ✅ Use express's built-in body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Page
app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// FCC Testing Routes
fccTestingRoutes(app);

// Your API Routes
apiRoutes(app);

// 404 Handler
app.use((req, res) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
  
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
