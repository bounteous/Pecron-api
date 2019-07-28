const debug = require('debug')('Pecron::src/middlewares/jwt.module.js');
const redisJwt = require('../modules/redis.module')();
const pecronMsgs = require('../config/messages');
const _Config = require('../config/config');

const __resError = params => {
  let msg = pecronMsgs.server.internalError;
  if (params) {
    if (params.missingToken) msg = pecronMsgs.server.missingToken;
  }
  return {
    status: 500,
    body: msg,
  };
};

module.exports = (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      const { status, body } = __resError({
        missingToken: true,
      });
      res.status(status);
      return res.send(body);
    }
    redisJwt.instances.jwt
      .verify(token)
      .then(decode => {
        req.userId = decode.id;
        req.user = decode.dataToken;
        if (_Config.webServer.debugRequests)
          console.info(
            'User %s accessing to [%s] url %s',
            decode.dataToken.email,
            req.method,
            req.url,
          );
        next();
      })
      .catch(err => {
        res.status(401);
        res.send('Unauthorized');
      });
  } catch (error) {
    debug(error);
    const { status, body } = __resError({});
    res.status(status);
    return res.send(body);
  }
};
