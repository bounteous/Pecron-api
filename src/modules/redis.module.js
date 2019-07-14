const debug = require('debug')('src/modules/mem.db.module');
const _Config = require('../config/config');
const _RedisJwt = require('redis-jwt');
const __instances = {
  jwt: new _RedisJwt({
    //host: '/tmp/redis.sock', //unix domain
    host: _Config.redis.host, //can be IP or hostname
    port: _Config.redis.port, // port
    maxretries: _Config.redis.maxretries, //reconnect retries, default 10
    //auth: '123', //optional password, if needed
    db: _Config.jwt.redisDb, //optional db selection
    secret: _Config.jwt.secret, // secret key for Tokens!
    multiple: _Config.jwt.multiple, // single or multiple sessions by user
    kea: _Config.redis.kea, // Enable notify-keyspace-events KEA
  }),
};

const __redisJwtSign = async payload => {
  return await new Promise((resolve, reject) => {
    __instances.jwt
      .sign(payload.id, {
        ttl: _Config.jwt.ttl,
        dataToken: {
          email: payload.email,
        },
        dataSession: { email: payload.email },
      })
      .then(token => {
        resolve(token);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = () => {
  return {
    redisJwtSign: __redisJwtSign,
    instances: __instances,
  };
};
