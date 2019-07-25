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

const __unHashDbContent = _content => {
  try {
    return bcrypt.compareSync(_content.plain, _content.hash);
  } catch (error) {
    debug('Error into __unHashDbContent: %o', error);
    return error;
  }
};

const __isJson = str => {
  try {
    JSON.parse(JSON.stringify(str));
    return true;
  } catch (error) {
    return false;
  }
};

const __resExpress = reply => {
  let status = 200;

  if (reply.errorCode) {
    status = reply.errorCode;
  }

  if (!__isJson(reply)) reply = { message: reply };

  return {
    status: status,
    body: reply,
  };
};

module.exports = () => {
  return {
    randomString: __randomString,
    hashDbContent: __hashDbContent,
    resExpress: __resExpress,
    unHashDbContent: __unHashDbContent,
  };
};
