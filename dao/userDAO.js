const User = require('../models/userModel');

class UserDAO {
  async getUserById(id) {
    return User.findById(id);
  }

  async getUserByEmail(email) {
    return User.findOne({ email: email });
  }

  async createUser(user) {
    user.role = user.role || 'usuario';
    const newUser = new User(user);
    return newUser.save();
  }

  async updateUser(id, user) {
    return User.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  async findUserByGithubId(githubId) {
    return User.findOne({ githubId });
  }

  async findUser(email) {
    return User.findOne({ email });
  }
}

module.exports = new UserDAO();