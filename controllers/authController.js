const AuthService = require('../services/authService');

const authService = new AuthService();

// Función para registrar un usuario
async function register(req, first_name, last_name, email, age, password, phoneNumber) {
  const user = await authService.register(req, first_name, last_name, email, age, password, phoneNumber);

  return user;
}

// Función para iniciar sesión
async function login(req, email, password) {
  const user = await authService.login(req, email, password);

  return user;
}

module.exports = {
  register,
  login,
};