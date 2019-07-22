require('../../src/modules/db.module');
const _Config = require('../../src/config/config');
const pecronUtils = require('../../src/utils/utils')();
const pecronUserModule = require('../../src/user/user.module')();
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mongoose = require('mongoose'),
  User = mongoose.model('User');

const __create = async () => {
  try {
    const email = await new Promise((resolve, reject) => {
      rl.question('User email: ', answer => {
        resolve(answer);
      });
    });

    const uSearch = await User.findOne({ email: email });
    if (uSearch) {
      console.error(`User already exists with email ${email}`);
      process.exit(0);
    }

    const password = await new Promise((resolve, reject) => {
      rl.question(`New password for user ${email}: `, answer => {
        rl.close();
        console.info('Clearing readline history ...');
        rl.history.slice(1);
        resolve(answer);
      });
    });

    if (!password) {
      console.error('Password can not be blank');
      process.exit(0);
    } else if (password.length < _Config.security.password.minLength) {
      console.error(
        `Minimum password length is ${_Config.security.password.minLength}`,
      );
      process.exit(0);
    } else if (password.length > _Config.security.password.maxLenth) {
      console.error(
        `Maximum password length is ${_Config.security.password.maxLenth}`,
      );
      process.exit(0);
    }

    const hashPasswd = pecronUtils.hashDbContent(password);

    if (hashPasswd instanceof Error)
      return {
        errorCode: 500,
        error: hashPasswd,
        message: abstractCreateUserError,
      };
    const _User = new User({
      email: email,
      password: hashPasswd,
      admin: false,
    });
    await _User.save();

    console.info('[INFO] User created');
    process.exit(0);
  } catch (error) {
    console.error('Error into __create: %o', error);
    process.exit(-1);
  }
};

__create();
