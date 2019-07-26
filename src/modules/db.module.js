const _Config = require('../config/config');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const URI = `mongodb://${_Config.mongo.username}:${_Config.mongo.password}@${
  _Config.mongo.host
}:${_Config.mongo.port}/${_Config.mongo.db}`;

mongoose.connect(URI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.info(`Mongoose default connection open to ${URI}`);
});

mongoose.connection.on('error', error => {
  console.error(`Mongoose default connection error: ${error}`);
  process.exit(-1);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose default connection disconnected');
});

// Fix deprecations
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.warn(
      'Mongoose default connection disconnected through app termination',
    );
    process.exit(0);
  });
});

require('../user/user.schema');
require('../customer/customer.schema');
require('../customer-host/customer-host.schema');
