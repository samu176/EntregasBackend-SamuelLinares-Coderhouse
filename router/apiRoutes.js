const express = require('express');
const productManager = require('../dao/productManager');
const generateProducts = require('../utils/mocking');
const router = express.Router();

// Ruta GET para /api/products
router.get('/products', async (req, res) => {
  try {
    // Obtiene la lista de productos
    const products = await productManager.getProducts({});
    // Devuelve los productos como JSON
    res.json(products);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Endpoint /mockingproducts
router.get('/mockingproducts', (req, res) => {
  const products = generateProducts();
  res.json(products);
});

// Ruta para obtener detalles de un producto por su id
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para agregar un nuevo producto
router.post('/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await productManager.addProduct(newProduct);
    res.json({ status: 'success', payload: addedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para actualizar un producto por su id
router.put('/products/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para eliminar un producto por su id
router.delete('/products/:pid', async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    res.json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;