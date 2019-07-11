const debug = require('debug')('Patron::src/utils/utils');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');

const __randomString = params => {
  try {
    if (params.password) {
      return randomstring.generate(params.length || 12);
    }
    return randomstring.generate(20);
  } catch (error) {
    debug('Error into __randomString: %o', error);
    return error;
  }
};

const __hashDbContent = _content => {
  try {
    return bcrypt.hashSync(_content, 10);
  } catch (error) {
    debug('Error into __hashDbContent: %o', error);
    return error;
  }
};

module.exports = () => {
  return {
    randomString: __randomString,
    hashDbContent: __hashDbContent,
  };
};
