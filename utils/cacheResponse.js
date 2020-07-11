const { config } = require('../config');

function cache(res, seconds) {
  if (!config.dev) {
    res.set("Cache-Control", `public, max-age=${seconds}`);
  };
};

module.exports = cache;