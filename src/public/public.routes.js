const debug = require('debug')('Pecron::src/public/public.routes');
const pecronUtils = require('../utils/utils')();
const pecronUserModule = require('../user/user.module')();
const mongoSanitize = require('mongo-sanitize');
const express = require('express');
const routes = express.Router();

routes.post('/login', async (req, res) => {
  try {
    const content = {
      email: mongoSanitize(req.body.email),
      password: mongoSanitize(req.body.password),
    };
    if (!content.email || !content.password) {
      res.status(500);
      return res.send('Email and password required');
    }
    const rUser = await pecronUserModule.login(content);
    const { status, body } = pecronUtils.resExpress(rUser);
    res.status(status);
    res.send(body);
  } catch (error) {
    const _error = 'Error into GET /login';
    debug(`${_error} -> %o`, error);
    return _error;
  }
});

module.exports = routes;
