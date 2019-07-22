require('../../src/modules/db.module');
const _Config = require('../../src/config/config');
const pecronUtils = require('../../src/utils/utils')();
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mongoose = require('mongoose'),
  User = mongoose.model('User');

const __changePassword = async () => {
  try {
    const email = await new Promise((resolve, reject) => {
      rl.question('User email to modify the password: ', answer => {
        resolve(answer);
      });
    });

    const uSearch = await User.findOne({ email: email });
    if (!uSearch) {
      console.error('The user with this email was not found');
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

    const pHash = pecronUtils.hashDbContent(password);

    await User.findByIdAndUpdate(uSearch._id, {
      password: pHash,
    });

    console.info(`Password updated for user ${email}`);

    process.exit(0);
  } catch (error) {
    console.error('Error into __changePassword: %o', error);
    process.exit(-1);
  }
};

__changePassword();
