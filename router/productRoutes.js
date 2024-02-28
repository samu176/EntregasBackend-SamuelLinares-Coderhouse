const express = require('express');
const productManager = require('../dao/productManager');
const router = express.Router();

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

// Ruta para obtener detalles de un producto por su id
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await productManager.addProduct(newProduct);
    res.json({ status: 'success', payload: addedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para actualizar un producto por su id
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para eliminar un producto por su id
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    res.json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;