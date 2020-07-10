const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

const { config } = require('./config');
const moviesApi = require('./routes/movies');
const { logErrors, wrapErrors, errorHandler } = require('./utils/middlewares/errorHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

// Middleware Body Parser
app.use(express.json());
app.use(cors());
app.use(helmet());
moviesApi(app);
// Catch 404 error
app.use(notFoundHandler);

// Middlewares about errors was at the end.
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);


app.listen(config.port, function () {
  console.log(`CORS-enabled web server listening on port ${config.port}`)
  console.log(`Listening http://localhost:${config.port}`);
});