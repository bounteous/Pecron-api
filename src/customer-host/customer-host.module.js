const debug = require('debug')('Pecron::src/customer/customer.module');
const _Config = require('../config/config');
const pecronUtils = require('../utils/utils')();
const pecronRedis = require('../modules/redis.module')();
const mongoose = require('mongoose'),
  CustomerHost = mongoose.model('CustomerHost'),
  Customer = mongoose.model('Customer');

const abstractCreateError = 'Error creating customer host';
const customerUnavailableError = 'Customer not found or disabled';

const __create = async content => {
  try {
    if (!content.description) content.description = '';
    const cSearch = await Customer.findById(content.customer);
    if (!cSearch || cSearch.disabled)
      return {
        errorCode: 403,
        error: new Error(customerUnavailableError),
        message: customerUnavailableError,
      };
    const _CustomerHost = new CustomerHost({
      name: content.name,
      customer: content.customer,
      'address.ip': content.address.ip,
      'address.type': content.address.type,
      description: content.description,
      'created.user': content.user,
    });
    await _CustomerHost.save();
    console.info('[INFO] Customer host created');
    console.table({
      name: content.name,
      customer: content.customer,
      'address.ip': content.address.ip,
      'address.type': content.address.type,
      description: content.description,
      'created.user': content.user,
    });
    return 'Customer host created successfully';
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
