const assert = require('assert');
const proxyquire = require('proxyquire');

const { getAllStub, MongoLibMock } = require('../utils/mocks/mongoLib');
const { moviesMock } = require('../utils/mocks/movies');

describe('services - movies', function() {
  const MoviesServcices = proxyquire('../services/movies',{
    '../lib/mongo': MongoLibMock,
  });

  const moviesService = new MoviesServcices();

  describe('When get movies method is called',  async function(){
    it('Should call the getall MongoLib mehtod', async function() {
      await moviesService.getMovies({});
      assert.strictEqual(getAllStub.called, true);
    });
    it('Should return an array of movies', async function() {
      const result = await moviesService.getMovies({});
      const expected = moviesMock;
      assert.deepEqual(result, expected);
    })
  });
});