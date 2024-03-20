const UserRepository = require('../repositories/userRepository');

async function createUser(first_name, last_name, email, age, password, githubId) {
  // Agrega un campo de rol y githubId
  const user = { first_name, last_name, email, age, password, githubId, role: 'usuario' };
  return UserRepository.createUser(user);
}

async function findUser(email) {
  return UserRepository.findUser(email);
}

async function findUserById(id) {
  return UserRepository.getUserById(id);
}

async function findUserByGithubId(githubId) {
  return UserRepository.findUserByGithubId(githubId);
}

module.exports = {
  createUser,
  findUser,
  findUserById,
  findUserByGithubId,
};