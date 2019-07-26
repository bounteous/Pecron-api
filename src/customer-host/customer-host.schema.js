const _Config = require('../config/config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerHost = new mongoose.Schema(
  {
    name: {
      type: String,
      max: _Config.sanitizers.lenghts['customer-host'].name,
      require: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      require: true,
    },
    address: {
      ip: { type: String, require: true },
      type: { type: String, require: true },
    },
    description: {
      type: String,
      max: _Config.sanitizers.lenghts['customer-host'].description,
    },
    disabled: { type: Boolean, default: false },
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

module.exports = mongoose.model('CustomerHost', CustomerHost);
