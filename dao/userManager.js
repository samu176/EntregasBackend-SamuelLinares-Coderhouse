const User = require('./models/userModel');

async function createUser(first_name, last_name, email, age, password, githubId) {
  // Agrega un campo de rol y githubId
  const user = new User({ first_name, last_name, email, age, password, githubId, role: 'usuario' });
  return user.save();
}

async function findUser(email) {
  return User.findOne({ email });
}

async function findUserById(id) {
  return User.findById(id);
}

async function findUserByGithubId(githubId) {
  return User.findOne({ githubId });
}

module.exports = {
  createUser,
  findUser,
  findUserById,
  findUserByGithubId,
};