const express = require('express');
const app = express();

const { config } = require('./config');
const moviesApi = require('./routes/movies');
const { logErrors, errorHandler } = require('./utils/middlewares/errorHandlers');

// Middleware Body Parser
app.use(express.json());

moviesApi(app);

// Middlewares about errors was at the end.
app.use(logErrors);
app.use(errorHandler);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});