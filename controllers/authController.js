const bcrypt = require('bcrypt');
const userController = require('./userController');

const saltRounds = 10;

async function register(first_name, last_name, email, age, password) {
  // Hashear la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return userController.createUser(first_name, last_name, email, age, hashedPassword);
}

async function login(email, password) {
  console.log(email); // Agregar esto
  console.log(password); // Agregar esto
  const user = await userController.findUser(email);
  console.log(user); // Agregar esto
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