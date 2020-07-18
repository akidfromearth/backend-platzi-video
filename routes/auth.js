const express = require('express');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const passport = require('passport');
const { config } = require('../config');
const usersService = require('../services/users');
const validationHandler = require('../utils/middlewares/validationHandler');
const { createUserSchema, createProviderUserSchema } = require('../utils/schemas/users');

// Basic strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeyService = new ApiKeysService();
  const userService = new usersService();

  router.post('/sign-in', async function(req, res, next) {
    const { apiKeyToken } = req.body;

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    };

    passport.authenticate('basic',async function(err, user) {

      try {
        if (err || !user) {
          next(boom.unauthorized());
        }

        req.login(user, { session: false }, async function(err) {
          if (err) {
            next(err);
          };

          const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          };

          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m'
          });
          return res.status(200).json({ token, user: {id, name, email} });
        });
      }catch(err) {
        next(err);
      }
    })(req, res, next);
  });

  router.post('/sign-up', validationHandler(createUserSchema), async function(req, res, next) {
    const { body: user } = req;
    try {
      const createUserId = await userService.createUser({ user });
      res.status(201).json({
        data: createUserId,
        message: 'user created',
      });
    }catch(err) {
      next(err);
    }
  });

  router.post('/sign-provider', validationHandler(createProviderUserSchema), async function(req, res, next) {
    const { body } = req;

    const { apiKeyToken,  ...user } = body;

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    };

    try {
      const queriedUser = await userService.getOrCreateUSer({ user });
      const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

      if (!apiKey) {
        next(boom.unauthorized());
      };

      const { _id: id, name, email } = queriedUser;

      const payload = {
        sub:id,
        name,
        email,
        scopes: apiKey.scopes
      };

      const token = jwt.sign(payload, config.authJwtSecret, {
        expiresIn: '15m'
      });

      res.status(200).json({
        token,
        user: {id, name, email}
      });

    }catch(error) {
      next(error);
    };

  });

};

module.exports = authApi;