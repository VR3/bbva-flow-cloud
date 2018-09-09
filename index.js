const express = require('express');
const figlet = require('figlet');

const app = express();

/**
 * Validation
 * /
 */
app.get('/', (req, res) => {
  res.send('7199133ec99f15eead1b186837278c8572f6fa72');
});

/**
 * GET /api/
 */
/**
 * Listen on 8080
 */
app.listen(80);

/**
 * Mandatory Figlet.
 */
figlet('BBVA-Flow', (err, res) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(res);
  }
});
