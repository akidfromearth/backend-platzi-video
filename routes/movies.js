const express = require('express');
const { moviesMock } = require('../utils/mocks/movies');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  // get all movies
  router.get('/', async (req, res, next) => {
    try {
      const movies = await Promise.resolve(moviesMock);
      res.status(200).json({
        data: movies,
        message: 'movies listed'
      })
    } catch(err) {
      next(err);
    }
  });

  // get specific movie
  router.get('/:movieId', async (req, res, next) => {
    try {
      const movies = await Promise.resolve(moviesMock[0]);
      res.status(200).json({
        data: movies,
        message: 'movies retrieved'
      })
    } catch(err) {
      next(err);
    }
  });

  // create a new movie
  router.post('/', async (req, res, next) => {
    try {
      const createMovieId = await Promise.resolve(moviesMock[0].id);
      res.status(201).json({
        data: createMovieId,
        message: 'movies created'
      })
    } catch(err) {
      next(err);
    }
  });

  // update
  router.put('/:movieId', async (req, res, next) => {
    try {
      const updatedMovieId = await Promise.resolve(moviesMock[0].id);
      res.status(200).json({
        data: updatedMovieId,
        message: 'movie updated'
      })
    } catch(err) {
      next(err);
    }
  });

  // delete a movie
  router.delete('/:movieId', async (req, res, next) => {
    try {
      const deleteMovieId = await Promise.resolve(moviesMock[0].id);
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