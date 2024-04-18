const express = require('express');
const productController = require('../controllers/productController');
const generateProducts = require('../utils/mocking');
const logger = require('../utils/logger');
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
router.post('/products', productController.addProduct);

// Ruta para actualizar un producto por su id
router.put('/products/:pid', productController.updateProduct);

// Ruta para eliminar un producto por su id
router.delete('/products/:pid', productController.deleteProduct);

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

module.exports = router;