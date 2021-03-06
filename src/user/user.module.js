const debug = require('debug')('Pecron::src/user/user.module');
const _Config = require('../config/config');
const pecronUtils = require('../utils/utils')();
const pecronRedis = require('../modules/redis.module')();
const mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  User = mongoose.model('User');

const abstractCreateUserError = 'Error creating user';
const abstractLoginUserError = 'Wrong user or password';

const __createDefaultAdmin = async () => {
  try {
    const adminExists = await __findAdmin();
    if (adminExists && adminExists instanceof Error) {
      return {
        errorCode: 500,
        error: adminExists,
        message: abstractCreateUserError,
      };
    }
    if (adminExists) return 0;
    debug('No previous admin on DB, creating admin user...');
    const rdmPlainPasswd = __randomPassword();
    const hashPasswd = pecronUtils.hashDbContent(rdmPlainPasswd);
    if (hashPasswd instanceof Error)
      return {
        errorCode: 500,
        error: hashPasswd,
        message: abstractCreateUserError,
      };
    const _User = new User({
      email: _Config.server.adminEmail,
      password: hashPasswd,
      admin: true,
    });
    await _User.save();

    console.info('[INFO] Admin user created');
    console.table({
      email: _Config.server.adminEmail,
      password: rdmPlainPasswd,
    });
    return 0;
  } catch (error) {
    debug('Error into __createDefaultAdmin: %o', error);
    return error;
  }
};

const __randomPassword = () => {
  return pecronUtils.randomString({
    password: true,
    length: 16,
  });
};

const __findAdmin = async () => {
  try {
    return await User.findOne({ admin: true });
  } catch (error) {
    debug('Error into __findAdmin: %o', error);
    return error;
  }
};

const __login = async content => {
  try {
    const uSearch = await User.findOne({ email: content.email });
    if (!uSearch)
      return {
        errorCode: 500,
        error: new Error(abstractLoginUserError),
        message: abstractLoginUserError,
      };
    const plainPasswd = pecronUtils.unHashDbContent({
      plain: content.password,
      hash: uSearch.password,
    });

    if (plainPasswd && plainPasswd instanceof Error) return plainPasswd;

    if (!plainPasswd)
      return {
        errorCode: 500,
        error: new Error(abstractLoginUserError),
        message: abstractLoginUserError,
      };

    content.id = uSearch.id;
    const token = await pecronRedis.redisJwtSign(content);
    if (token && token instanceof Error)
      return {
        errorCode: 500,
        error: token,
        message: abstractLoginUserError,
      };
    return { token: token };
  } catch (error) {
    debug('Error into __login: %o', error);
    return {
      errorCode: 500,
      error: error,
      message: abstractLoginUserError,
    };
  }
};

const __info = async userId => {
  try {
    return await User.findById(userId).select('-_id -password -disabled');
  } catch (error) {
    debug('Error into __info: %o', error);
    return {
      errorCode: 500,
      error: error,
      message: 'Error user info',
    };
  }
};

const __listOwnCustomers = async user => {
  try {
    return await Customer.find({
      alloweds: user,
    })
      .populate({
        path: 'hosts',
      })
      .populate({
        path: 'alloweds',
        select: '-password',
      });
  } catch (error) {
    debug('Error into __listOwnCustomers: %o', error);
    return {
      errorCode: 500,
      error: error,
      message: 'Error list user customers',
    };
  }
};

module.exports = () => {
  return {
    createDefaultAdmin: __createDefaultAdmin,
    login: __login,
    info: __info,
    listOwnCustomers: __listOwnCustomers,
  };
};
