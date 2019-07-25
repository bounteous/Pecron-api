const debug = require('debug')('Pecron::src/customer/customer.routes');
const _Config = require('../config/config');
const pecronUtils = require('../utils/utils')();
const pecronCustomerModule = require('./customer.module')();
const mongoSanitize = require('mongo-sanitize');
const express = require('express');
const routes = express.Router();

routes.post('/', async (req, res) => {
  try {
    const content = {
      user: mongoSanitize(req.userId),
      name: mongoSanitize(req.body.name),
      hosts: mongoSanitize(req.body.hosts),
    };
    if (!content.name) {
      res.status(500);
      return res.send('Name required');
    } else if (content.name.length > _Config.sanitizers.lenghts.customer.name) {
      res.status(500);
      return res.send(
        `Maximum name length is ${_Config.sanitizers.lenghts.customer.name}`,
      );
    }
    const rCustomer = await pecronCustomerModule.create(content);
    const { status, body } = pecronUtils.resExpress(rCustomer);
    res.status(status);
    return res.send(body);
  } catch (error) {
    const _error = 'Error into POST /';
    debug(`${_error} -> %o`, error);
    return _error;
  }
});

module.exports = routes;
