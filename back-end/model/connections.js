const mongoose = require('mongoose');

const Connections = new mongoose.Schema({
  token: {
    type: String
  },
  identity: {
    type: String,
  },
  socket: {
    type: String,
    unique: true
  },
  alive: {
    type: Boolean,
    default: true,
  },
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
});
Connections.pre('save', function (next) {
  this.updated = Date.now();
  next();
});


const model = mongoose.model('Connections', Connections);

module.exports = model;