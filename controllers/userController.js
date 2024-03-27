const UserRepository = require('../repositories/userRepository');

async function createUser(first_name, last_name, email, age, password, githubId = null, cartId = null) {
  // Agrega un campo de cart al objeto del usuario si se proporciona cartId
  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
    githubId,
    role: 'usuario',
    cart: cartId
  };
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
