const express = require('express');
const productController = require('../controllers/productController');
const generateProducts = require('../utils/mocking');
const logger = require('../utils/logger');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta GET para /api/products
router.get('/products', productController.getProducts);

// Endpoint /mockingproducts
router.get('/mockingproducts', (req, res) => {
  const products = generateProducts();
  res.json(products);
});

// Ruta GET para probar los logs
router.get('/loggerTest', (req, res) => {
  logger.error('Esto es un error de prueba');
  logger.warn('Esto es una advertencia de prueba');
  logger.info('Esto es una información de prueba');
  logger.http('Esto es un log HTTP de prueba');
  logger.debug('Esto es un log de depuración de prueba');
  res.send('Logs de prueba enviados.');
});

// Ruta para obtener detalles de un producto por su id
router.get('/products/:pid', productController.getProductById);

// Ruta para agregar un nuevo producto
router.post('/products', ensureAuthenticated, productController.addProduct);

// Ruta para actualizar un producto por su id
router.put('/products/:pid', ensureAuthenticated, productController.updateProduct);

// Ruta para eliminar un producto por su id
router.delete('/products/:pid', ensureAuthenticated, productController.deleteProduct);

// Ruta para obtener la información del usuario actual
router.get('/sessions/current', (req, res) => {
  // Verifica si el usuario está autenticado
  if (req.isAuthenticated()) {
    // Retorna la información del usuario actual
    res.json({
      status: 'success',
      user: {
        id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
      }
    });
  } else {
    // Devuelve un error si el usuario no está autenticado
    res.status(401).json({ status: 'error', message: 'No autenticado' });
  }
});

// Ruta para cambiar el rol de un usuario
router.put('/users/premium/:uid', ensureAuthenticated, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Permiso rechazado' });
  }
  next();
}, userController.changeUserRole);

module.exports = router;