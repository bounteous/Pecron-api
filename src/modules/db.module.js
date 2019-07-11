const _Config = require('../config/config');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(_Config.mongo.uri, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.info(`Mongoose default connection open to ${_Config.mongo.uri}`);
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
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.warn(
      'Mongoose default connection disconnected through app termination',
    );
    process.exit(0);
  });
});

require('../user/user.schema');
