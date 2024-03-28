const bcrypt = require('bcrypt');
const userController = require('./userController');
const cartController = require('./cartController');

const saltRounds = 10;

async function register(req, first_name, last_name, email, age, password) {
  console.log(`Intentando registrar un nuevo usuario con email: ${email}`);
  
  // Hashear la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Crear un carrito para el usuario
  console.log(`Creando carrito para el nuevo usuario con email: ${email}`);
  const newCart = await cartController.createCart();
  console.log(`Carrito creado para el usuario con email: ${email}, Carrito ID: ${newCart._id}`);

  // Crear usuario y asociar el carrito creado con el usuario
  console.log(`Registrando usuario con email: ${email}`);
  const user = await userController.createUser(first_name, last_name, email, age, hashedPassword, null, newCart._id);
  console.log(`Usuario registrado con éxito:`, user);

  // Almacenar el ID del carrito en la sesión del usuario 
  console.log(`Almacenando el ID del carrito en la sesión del usuario con email: ${email}`);
  req.session.cart = newCart._id;
  console.log(`ID del carrito almacenado en la sesión: ${req.session.cartId}`);

  return user;
}

async function login(req, email, password) {
  console.log(`Intentando iniciar sesión para el usuario con email: ${email}`);
  const user = await userController.findUser(email);
  if (user) {
    console.log(`Usuario encontrado con email: ${email}, procediendo a verificar contraseña.`);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log(`Usuario con email: ${email} ha iniciado sesión con éxito.`);
      // Verificar que el usuario tenga un cartId antes de intentar reasignarlo
      if (user.cartId) {
        req.session.cart = user.cart; // Reasignar el cartId del usuario a la sesión
        console.log(`Reasignando cartId a la sesión: ${req.session.cartId}`);
      } else {
        console.log(`El usuario con email: ${email} no tiene un cartId asociado.`);
      }
      return user;
    } else {
      console.log(`Contraseña incorrecta para el usuario con email: ${email}.`);
    }
  } else {
    console.log(`No se encontró un usuario con email: ${email}.`);
  }
  return null;
}


module.exports = {
  register,
  login,
};
