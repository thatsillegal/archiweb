const mongoose = require('mongoose');

const Users = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    set(val) {
      return require('bcryptjs').hashSync(val, 12);
    }
  },
  sid: {
    type: Number,
    unique: true
  },
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
})

Users.pre('save', function (next) {
  this.updated = Date.now();
  next();
});


const model = mongoose.model('Users', Users);

module.exports = model;
