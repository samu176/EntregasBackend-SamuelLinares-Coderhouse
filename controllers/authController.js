const bcrypt = require('bcrypt');
const userController = require('./userController');
const cartController = require('./cartController');

const saltRounds = 10;

async function register(req, first_name, last_name, email, age, password) {
  // Hashear la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await userController.createUser(first_name, last_name, email, age, hashedPassword);
  
  // Crear un carrito para el usuario
  const newCart = await cartController.createCart();
  console.log('Carrito creado:', newCart);

  // Almacenar el ID del carrito en la sesión del usuario
  req.session.cartId = newCart._id;

  return user;
}

async function login(email, password) {
  console.log(email);
  console.log(password);
  const user = await userController.findUser(email);
  console.log(user);
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