// Ruta para obtener todos los productos en tiempo real
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const ensureAuthenticated = require('../middleware/authMiddleware');

router.get('/realtimeProducts', ensureAuthenticated, async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const result = await productController.getProducts();
      console.log(req.user); // Agrega esta línea
      res.render('realtimeProducts', { 
        user: req.user, 
        products: result.payload, 
      });
    } else {
      res.status(403).send('Acceso denegado');
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;