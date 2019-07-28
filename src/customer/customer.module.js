const debug = require('debug')('Pecron::src/customer/customer.module');
const _Config = require('../config/config');
const pecronUtils = require('../utils/utils')();
const pecronRedis = require('../modules/redis.module')();
const mongoose = require('mongoose'),
  CustomerHost = mongoose.model('CustomerHost'),
  Customer = mongoose.model('Customer');

const abstractCreateError = 'Error creating customer';
const abstractListError = 'Error listing';
const abstract404Customer = 'Customer not found';

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

const __listHosts = async customer => {
  try {
    if (!customer)
      return {
        errorCode: 406,
        error: new Error(abstractListError),
        message: abstractListError,
      };
    const cSearch = await Customer.findById(customer);
    if (!cSearch)
      return {
        errorCode: 404,
        error: new Error(abstract404Customer),
        message: abstract404Customer,
      };
    return await CustomerHost.find({
      customer: customer,
    }).populate({
      path: 'customer',
      populate: {
        path: 'alloweds',
        select: '-password'
      }
    }).populate({
      path: 'created.user',
      select: '-password'
    });
  } catch (error) {
    debug('Error into __listHosts: %o', error);
    return {
      errorCode: 500,
      error: error,
      message: abstractListError,
    };
  }
};

module.exports = () => {
  return {
    create: __create,
    listHosts: __listHosts,
  };
};
