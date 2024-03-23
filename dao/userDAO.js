const User = require('../models/userModel');

class UserDAO {
  async getUserById(id) {
    const user = await User.findById(id);
    return user ? this.toDTO(user) : null;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email });
    return user ? this.toDTO(user) : null;
  }

  async createUser(user) {
    user.role = user.role || 'usuario';
    const newUser = new User(user);
    const savedUser = await newUser.save();
    return this.toDTO(savedUser);
  }

  async updateUser(id, user) {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser ? this.toDTO(updatedUser) : null;
  }

  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser ? this.toDTO(deletedUser) : null;
  }

  async findUserByGithubId(githubId) {
    const user = await User.findOne({ githubId });
    return user ? this.toDTO(user) : null;
  }

  async findUser(email) {
    const user = await User.findOne({ email });
    return user ? this.toDTO(user) : null;
  }

  toDTO(user) {
    return {
      id: user._id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      password: user.password, // Agrega esta línea
    };
  }
}

module.exports = new UserDAO();