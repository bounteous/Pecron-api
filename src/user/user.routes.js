const debug = require('debug')('Pecron::src/user/user.routes');
const pecronUtils = require('../utils/utils')();
const pecronUserModule = require('./user.module')();
const pecronMsgs = require('../config/messages');
const mongoSanitize = require('mongo-sanitize');
const express = require('express');
const routes = express.Router();

routes.get('/', async (req, res) => {
  try {
    const userId = mongoSanitize(req.userId);
    if (!userId) {
      res.status(500);
      return res.send(pecronMsgs.server.internalError);
    }
    const rUser = await pecronUserModule.info(userId);
    const { status, body } = pecronUtils.resExpress(rUser);
    res.status(status);
    res.send(body);
  } catch (error) {
    const _error = 'Error into GET /';
    debug(`${_error} -> %o`, error);
    return _error;
  }
});

routes.get('/list/customers', async (req, res) => {
  try {
    const userId = mongoSanitize(req.userId);
    if (!userId) {
      res.status(500);
      return res.send(pecronMsgs.server.internalError);
    }
    const rUser = await pecronUserModule.listOwnCustomers(userId);
    const { status, body } = pecronUtils.resExpress(rUser);
    res.status(status);
    res.send(body);
  } catch (error) {
    const _error = 'Error into GET /list/customers';
    debug(`${_error} -> %o`, error);
    return _error;
  }
});

module.exports = routes;
