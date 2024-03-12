const UserDAO = require('./userDAO');
const UserDTO = require('./userDTO');

class UserRepository {
  async getUserById(id) {
    const user = await UserDAO.getUserById(id);
    return new UserDTO(user);
  }

  async getUserByEmail(email) {
    const user = await UserDAO.getUserByEmail(email);
    return new UserDTO(user);
  }

  async createUser(user) {
    user.role = user.role || 'usuario';
    const createdUser = await UserDAO.createUser(user);
    return new UserDTO(createdUser);
  }

  async updateUser(id, user) {
    const updatedUser = await UserDAO.updateUser(id, user);
    return new UserDTO(updatedUser);
  }

  async deleteUser(id) {
    await UserDAO.deleteUser(id);
  }

  async findUserByGithubId(githubId) {
    const user = await UserDAO.findUserByGithubId(githubId);
    return new UserDTO(user);
  }

  async findUser(email) {
    const user = await UserDAO.findUser(email);
    return new UserDTO(user);
  }
}

module.exports = new UserRepository();