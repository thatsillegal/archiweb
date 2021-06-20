const mongoose = require('mongoose');
const {v4} = require('uuid');

const APIAuth = new mongoose.Schema({
  token: {
    type: String,
    default: v4(),
    unique: true
  },
  username: {
    type: String,
  },
  description: {
    type: String,
    default: 'default'
  }
})

const model = mongoose.model('APIAuth', APIAuth);

module.exports = model;