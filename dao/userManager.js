const User = require('../models/userModel');

async function createUser(username, hashedPassword) {
  const user = new User({ username, password: hashedPassword });
  return user.save();
}

async function findUser(username) {
  return User.findOne({ username });
}

module.exports = {
  createUser,
  findUser,
};