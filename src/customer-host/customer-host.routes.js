const debug = require('debug')(
  'Pecron::src/customer-host/customer-host.routes',
);
const _Config = require('../config/config');
const pecronUtils = require('../utils/utils')();
const pecronCustomerHostModule = require('./customer-host.module')();
const mongoSanitize = require('mongo-sanitize');
const express = require('express');
const routes = express.Router();

routes.post('/:customer', async (req, res) => {
  try {
    if (!req.body.address) {
      res.status(400);
      return res.send(`Address field can not be blank`);
    }
    const content = {
      name: mongoSanitize(req.body.name),
      customer: mongoSanitize(req.params.customer),
      address: {
        ip: mongoSanitize(req.body.address.ip),
        type: mongoSanitize(req.body.address.type),
      },
      description: mongoSanitize(req.body.description),
      user: mongoSanitize(req.userId),
    };
    if (
      !content.name ||
      !content.address ||
      !content.address.ip ||
      !content.address.type
    ) {
      res.status(400);
      return res.send('Name and address can not be blank');
    } else if (
      content.name > _Config.sanitizers.lenghts['customer-host'].name
    ) {
      res.status(400);
      return res.send(
        `Maximum host name length is ${
          _Config.sanitizers.lenghts['customer-host'].name
        }`,
      );
    } else if (
      content.description &&
      content.description >
        _Config.sanitizers.lenghts['customer-host'].description
    ) {
      res.status(400);
      return res.send(
        `Maximum description length is ${
          _Config.sanitizers.lenghts['customer-host'].description
        }`,
      );
    } else if (
      content.address.ip === 'ipv4' &&
      content.address.ip > _Config.sanitizers.lenghts['customer-host'].ipv4
    ) {
      res.status(400);
      return res.send(
        `Maximum ipv4 address length is ${
          _Config.sanitizers.lenghts['customer-host'].ipv4
        }`,
      );
    } else if (
      content.address.ip === 'ipv6' &&
      content.address.ip > _Config.sanitizers.lenghts['customer-host'].ipv6
    ) {
      res.status(400);
      return res.send(
        `Maximum ipv6 address length is ${
          _Config.sanitizers.lenghts['customer-host'].ipv4
        }`,
      );
    }
    const rCustomerHost = await pecronCustomerHostModule.create(content);
    const { status, body } = pecronUtils.resExpress(rCustomerHost);
    res.status(status);
    return res.send(body);
  } catch (error) {
    const _error = 'Error into POST /';
    debug(`${_error} -> %o`, error);
    return _error;
  }
});

module.exports = routes;
