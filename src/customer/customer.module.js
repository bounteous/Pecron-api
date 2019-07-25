const debug = require('debug')('Pecron::src/customer/customer.module');
const _Config = require('../config/config');
const pecronUtils = require('../utils/utils')();
const pecronRedis = require('../modules/redis.module')();
const mongoose = require('mongoose'),
  Customer = mongoose.model('Customer');

const abstractCreateError = 'Error creating customer';

const __create = async content => {
  try {
    if (!content.hosts) content.hosts = [];
    const _Customer = new Customer({
      name: content.name,
      hosts: content.hosts,
      alloweds: [content.user],
      'created.user': content.user,
    });
    await _Customer.save();
    console.info('[INFO] Customer created');
    console.table({
      name: content.name,
      hosts: content.hosts,
    });
    return 'Customer created successfully';
  } catch (error) {
    debug('Error into __create: %o', error);
    return {
      errorCode: 500,
      error: error,
      message: abstractCreateError,
    };
  }
};

module.exports = () => {
  return {
    create: __create,
  };
};
