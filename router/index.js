// Rutas para el home, la API, los carritos, los mensajes y la autenticación
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./apiRoutes');
const cartRoutes = require('./cartRoutes');
const messageRoutes = require('./messageRoutes');
const authRoutes = require('./authRoutes');

module.exports = {
  homeRoutes,
  apiRoutes,
  cartRoutes,
  messageRoutes,
  authRoutes
};