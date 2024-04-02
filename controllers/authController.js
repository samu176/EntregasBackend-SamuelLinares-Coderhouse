const AuthService = require('../services/authService');

// Creamos una instancia de AuthService
const authService = new AuthService();

// Función para registrar un usuario
async function register(req, first_name, last_name, email, age, password) {


  // Usamos authService.register en lugar de userService.registerUser y cartController.createCart
  const user = await authService.register(req, first_name, last_name, email, age, password);

  return user;
}

// Función para iniciar sesión
async function login(req, email, password) {


  // Usamos authService.login en lugar de userService.loginUser
  const user = await authService.login(req, email, password);


  return user;
}

// Exportamos las funciones
module.exports = {
  register,
  login,
};