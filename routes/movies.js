const express = require('express');
const MoviesService = require('../services/movies');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  // get all movies
  router.get('/', async (req, res, next) => {
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
  router.get('/:movieId', async (req, res, next) => {
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
  router.post('/', async (req, res, next) => {
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
  router.put('/:movieId', async (req, res, next) => {
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

  // update dispatch
  router.patch('/:movieId', async (req, res, next) => {
    const { body: movie } = req;
    const { movieId } = req.params;
    try {
      const patchMovieId = await moviesService.updateMovie( { movieId, movie } );
      res.status(200).json({
        data: patchMovieId,
        message: 'movie patched'
      })
    } catch(err) {
      next(err);
    }
  });

  // delete a movie
  router.delete('/:movieId', async (req, res, next) => {
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