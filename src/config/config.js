module.exports = {
  env: {
    processVersion: '10.16',
  },
  webServer: {
    origin: '0.0.0.0',
    port: 2424,
  },
  mongo: {
    uri: 'mongodb://localhost:27017/pecron',
  },
  server: {
    adminRandomPasswordStorageFile: '.ADMIN_PASSWORD',
    adminEmail: 'admin@pecron.gpl'
  },
};
