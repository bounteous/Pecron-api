const debug = require('debug')('Pecron::tools/env-checker');
const _Config = require('../src/config/config');
const pecronUsers = require('../src/user/user.module')();

const __checkNodeVersion = () => {
  try {
    const _version = process.version.match(/^v(\d+\.\d+)/)[1];
    console.info(`[INFO] Actual Node.js version: ${_version}`);
    if (_version !== _Config.env.processVersion) {
      console.warn(
        `[WARNING] Node.js version must be: ${_Config.env.processVersion}`,
      );
      process.exit(-1);
    }
    return _version;
  } catch (error) {
    debug('Error into __checkNodeVersion: %o');
    return error;
  }
};

const __noAdminUserAlready = async () => {
  return await pecronUsers.createDefaultAdmin();
};

module.exports = () => {
  return {
    checkNodeVersion: __checkNodeVersion,
    noAdminUserAlready: __noAdminUserAlready,
  };
};
