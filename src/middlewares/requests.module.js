const debug = require('debug')('Pecron::src/middlewares/requests.module.js');
const pecronMsgs = require('../config/messages');

const __resError = () => {
  return {
    status: 500,
    body: pecronMsgs.server.internalError,
  };
};

module.exports = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      next();
      return;
    }
    next();
  } catch (error) {
    debug(error);
    const { status, body } = __resError();
    res.status(status);
    return res.send(body);
  }
};
