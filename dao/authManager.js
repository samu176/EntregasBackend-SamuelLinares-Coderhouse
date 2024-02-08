const bcrypt = require('bcrypt');
const userManager = require('./userManager');

async function register(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return userManager.createUser(username, hashedPassword);
}

async function login(username, password) {
  const user = await userManager.findUser(username);
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
}

module.exports = {
  register,
  login,
};