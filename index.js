const debug = require('debug')('Pecron::/index');
require('./src/modules/db.module');
// Web server
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// Modules
const fs = require('fs');
// Routes
const routes = {
  public: require('./src/public/public.routes'),
  user: require('./src/user/user.routes'),
};
// Middlewares
const middlewares = {
  requests: require('./src/middlewares/requests.module'),
  jwt: require('./src/middlewares/jwt.module'),
};
const _configPath = './src/config/config.js';

if (!fs.existsSync(_configPath)) {
  console.error('[ERROR] Configuration file not found!');
  process.exit(-1);
}

const _Config = require(_configPath);

// Checkers
const _envChecker = require('./tools/env-checker')();
_envChecker.checkNodeVersion();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use(
  cors({
    origin:'*',
    credentials: false,
    preflightContinue: true,
    exposedHeaders: ['Content-Type', 'Set-Cookie'],
    allowedHeaders: ['Content-Type', 'Set-Cookie', 'Authorization'],
  }),
);

// Public
app.use(middlewares.requests);
app.use('/', routes.public);
// Private
app.use(middlewares.jwt);
app.use('/user', routes.user);

app.listen(_Config.webServer.port, _Config.webServer.origin, async () => {
  await _envChecker.noAdminUserAlready();
  console.log(
    'Pecron-Api listening on -> %s:%i',
    _Config.webServer.origin,
    _Config.webServer.port,
  );
});
