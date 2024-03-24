// Rutas para el home, la API, los carritos, los mensajes, la autenticación y los productos en tiempo real
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./apiRoutes');
const cartRoutes = require('./cartRoutes');
const messageRoutes = require('./messageRoutes');
const authRoutes = require('./authRoutes');
const realtimeRoutes = require('./realtimeRoutes');

module.exports = {
  homeRoutes,
  apiRoutes,
  cartRoutes,
  messageRoutes,
  authRoutes,
  realtimeRoutes
};