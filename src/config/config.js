module.exports = {
  env: {
    processVersion: '10.16',
  },
  webServer: {
    origin: '0.0.0.0',
    port: 2424,
    debugRequests: true,
  },
  mongo: {
    db: 'pecron',
    host: 'localhost',
    port: '27017',
    username: 'pecron',
    password: 'changeme',
  },
  redis: {
    host: 'localhost',
    port: 6379,
    maxretries: 10,
    auth: 'changeme',
    secret: 'changeme',
    kea: false,
  },
  server: {
    adminRandomPasswordStorageFile: '.ADMIN_PASSWORD',
    adminEmail: 'admin@pecron.gpl',
  },
  jwt: {
    secret: 'changeme',
    redisDb: 0,
    multiple: false,
    ttl: '15 minutes',
  },
};
