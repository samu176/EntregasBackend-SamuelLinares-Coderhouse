const express = require('express');
const productManager = require('../dao/productManager');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');

// Ruta para obtener todos los productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = { limit: parseInt(limit), page: parseInt(page), sort, query };
    const result = await productManager.getProducts(options);

    const { payload, totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage, prevLink, nextLink } = result;

    res.render('home', { 
      user: req.user, 
      products: payload, 
      totalPages, 
      prevPage, 
      nextPage, 
      currentPage, 
      hasPrevPage, 
      hasNextPage, 
      prevLink, 
      nextLink
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;