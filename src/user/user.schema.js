const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new mongoose.Schema(
  {
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    name: { type: String, max: 30 },
    surname: { type: String, max: 30 },
    disabled: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
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

module.exports = mongoose.model('User', User);
