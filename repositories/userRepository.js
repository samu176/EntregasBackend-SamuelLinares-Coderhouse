const UserDAO = require('../dao/userDAO');

class UserRepository {
  async getUserById(id) {
    const user = await UserDAO.getUserById(id);
    return user;
  }

  async getUserByEmail(email) {
    const user = await UserDAO.getUserByEmail(email);
    return user;
  }

  async createUser(user) {
    user.role = user.role || 'usuario';
    const createdUser = await UserDAO.createUser(user);
    return createdUser;
  }

  async updateUser(id, user) {
    const updatedUser = await UserDAO.updateUser(id, user);
    return updatedUser;
  }

  async deleteUser(id) {
    await UserDAO.deleteUser(id);
  }

  async findUserByGithubId(githubId) {
    const user = await UserDAO.findUserByGithubId(githubId);
    return user;
  }

  async findUser(email) {
    const user = await UserDAO.findUser(email);
    return user;
  }
}

module.exports = new UserRepository();