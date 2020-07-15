const express = require('express');
const passport = require('passport');

const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middlewares/validationHandler');

const { movieIdSchema } = require('../utils/schemas/movies'); //eslint-disable-line
const { userIdChema, userIdSchema } = require('../utils/schemas/users'); //eslint-disable-line
const {  createUserMovieSchema } = require('../utils/schemas/userMovies'); //eslint-disable-line
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');

//JWT Strategy
require('../utils/auth/strategies/jwt');

function userMoviesApi(app) { //eslint-disable-line
  const router = express.Router();

  app.use('/api/user-movies', router);

  const userMoviesService = new UserMoviesService();

  router.get('/', passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['read:user-movies']),validationHandler({ userId: userIdSchema }, 'query'),
  async function(req, res, next) {
    const { userId } = req.query;

    try {
      const userMovies = await userMoviesService.getUserMovies({ userId });
      res.status(200).json({
        data: userMovies,
        message: 'user movies listed'
      });
    }catch(err) {
      next(err);
    };
  });

  router.post('/', passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['create:user-movies']),validationHandler(createUserMovieSchema),
  async function(req, res, next) {
    const {body: userMovie} = req;

    try {
      const createUserMovieId = await userMoviesService.createUserMovie({ // eslint-disable-line
        userMovie,
      });
      res.status(201).json({
        data: createUserMovieId,
        message: 'user movie created'
      });
    }catch(err) {
      next(err);
    };
  });

  router.delete('/:userMovieId', passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['delete:user-movies']),validationHandler({ userMovieId: movieIdSchema }, 'params'), 
  async function(req, res, next ) {
    const { userMovieId } = req.params;

    try {
      const deleteUserMovieId = await userMoviesService.deleteUserMovie({ userMovieId });
      res.status(200).json({
        data: deleteUserMovieId,
        message: 'user movie deleted'
      })
    }catch(err) {
      next(err);
    };
  });

};

module.exports = userMoviesApi;