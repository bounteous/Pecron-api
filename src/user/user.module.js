const debug = require('debug')('Pecron::src/user/user.module');
const _Config = require('../config/config');
const pecronUtils = require('../utils/utils')();
const mongoose = require('mongoose'),
  User = mongoose.model('User');

const abstractCreateUserError = 'Error creating user';

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

module.exports = () => {
  return {
    createDefaultAdmin: __createDefaultAdmin,
  };
};
