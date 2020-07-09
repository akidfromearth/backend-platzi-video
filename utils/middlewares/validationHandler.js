const boom = require('@hapi/boom');

function validate() {
  return false;
};

function validationHandler(schema, check = "body") { // eslint-disable-line
  return function (req, res, next) {
    const error = validate(req[check], schema);
    error ? next(boom.badRequest(error)) : next();
  };
};