const express = require('express');
const MoviesService = require('../services/movies');
const { movieIdSchema, createMovieSchema, updateMovieSchema } = require('../utils/schemas/movies');
const validationHandler = require('../utils/middlewares/validationHandler');
const cacheResponse = require('../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS,SIXTY_MINUTES_IN_SECONDS }  = require('../utils/time');
const passport = require('passport');
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');

//  JWT strategy
require('../utils/auth/strategies/jwt');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  // get all movies
  router.get('/', passport.authenticate('jwt', { session: false }) ,
  scopesValidationHandler(['read:movies']),async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;
    try {
      //throw new Error('Error getting movies');
      const movies = await moviesService.getMovies( { tags } )
      res.status(200).json({
        data: movies,
        message: 'movies listed'
      })
    } catch(err) {
      next(err);
    }
  });

  // get specific movie
  router.get('/:movieId', passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['read:movies']),validationHandler( { movieId: movieIdSchema }, 'params' ), async (req, res, next) => {
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
    const { movieId } = req.params;
    try {
      const movies = await moviesService.getMovie( { movieId } );
      res.status(200).json({
        data: movies,
        message: 'movies retrieved'
      })
    } catch(err) {
      next(err);
    }
  });

  // create a new movie
  router.post('/', passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['create:movies']),validationHandler(createMovieSchema),async (req, res, next) => {
    const { body: movie } = req;
    try {
      const createMovieId = await moviesService.createMovie( { movie } );
      res.status(201).json({
        data: createMovieId,
        message: 'movies created'
      })
    } catch(err) {
      next(err);
    }
  });

  // update
  router.put('/:movieId', passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['update:movies']),validationHandler( { movieId: movieIdSchema}, 'params' ) ,validationHandler(updateMovieSchema) ,async (req, res, next) => {
    const { body: movie } = req;
    const { movieId } = req.params;
    try {
      const updatedMovieId = await moviesService.updateMovie( { movieId, movie } );
      res.status(200).json({
        data: updatedMovieId,
        message: 'movie updated'
      })
    } catch(err) {
      next(err);
    }
  });

  // delete a movie
  router.delete('/:movieId', passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['delete:movies']),validationHandler( { movieId: movieIdSchema }, 'params' ) ,async (req, res, next) => {
    const { movieId } = req.params;
    try {
      const deleteMovieId = await moviesService.deleteMovie( { movieId } );
      res.status(200).json({
        data: deleteMovieId,
        message: 'movie deleted'
      })
    } catch(err) {
      next(err);
    }
  });
};

module.exports = moviesApi;