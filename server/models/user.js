const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const ROLES = require('../models/role');

const userSchema = new Schema({
  _id: {
    type: ObjectId,
    auto: true
  },
  role: {
    type: String,
    enum: ROLES,
    required: true
  },
  firstName: {
    type: String,
    minLength: 2,
    maxLength:256,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 2,
    maxLength:256,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
