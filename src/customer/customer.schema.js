const _Config = require('../config/config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new mongoose.Schema(
  {
    name: { type: String, max: _Config.sanitizers.lenghts.customer.name },
    hosts: [{ type: Schema.Types.ObjectId, ref: 'Host' }],
    disabled: { type: Boolean, default: false },
    alloweds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    created: {
      timestamp: { type: Date, default: Date.now },
      user: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    updates: [
      {
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  {
    usePushEach: true,
  },
);

module.exports = mongoose.model('Customer', Customer);
