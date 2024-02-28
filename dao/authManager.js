const bcrypt = require('bcrypt');
const userManager = require('./userManager');

const saltRounds = 10;

async function register(first_name, last_name, email, age, password) {
  // Hashear la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return userManager.createUser(first_name, last_name, email, age, hashedPassword);
}

async function login(email, password) {
  const user = await userManager.findUser(email);
  if (user) {
    // Verificar la contraseña hasheada
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Las contraseñas coinciden
      return user;
    }
  }
  return null;
}

module.exports = {
  register,
  login,
};