const express = require('express');
const app = express();

const { config } = require('./config');

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/json', function (req, res) {
  res.json( { hello: 'World!' } );
});

app.get('/:year', function (req, res) {
  const year = req.params.year;
  if (year % 4 == 0 || year % 100 == 0 || year % 400 == 0) {
    res.send('Leap YEAR, has 366 days');
  } else {
    res.send('Sorry, not leap year!')
  };
});

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});