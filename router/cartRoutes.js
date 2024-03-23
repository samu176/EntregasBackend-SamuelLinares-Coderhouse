const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.post('/', (req, res) => {
  const newCart = cartController.createCart();
  res.json(newCart);
});

router.get('/', async (req, res) => {
  const cartId = '65baddfac0916ba71d3445f2';
  const cart = await cartController.getCartById(cartId);
  if (cart) {
    res.render('carts', { cart });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartController.getCartById(cartId);
  if (cart) {
    res.render('carts', { cart });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/product/:pid', async (req, res) => {
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  const cartId = req.body.cartId;

  const cart = await cartController.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const result = await cartController.addProductToCart(cartId, productId, quantity);
  if (result) {
    res.json(cart);
  } else {
    res.status(500).json({ error: 'Error agregando producto al carrito' });
  }
});

// DELETE 
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const result = await cartController.removeProduct(cid, pid);
  res.send(result);
});

// PUT 
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  const result = await cartController.updateCart(cid, products);
  res.send(result);
});

// PUT 
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const result = await cartController.updateProductQuantity(cid, pid, quantity);
  res.send(result);
});

// DELETE 
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  const result = await cartController.clearCart(cid);
  res.send(result);
});

// POST 
router.post('/:cid/purchase', async (req, res) => {
  const { cid } = req.params;
  const result = await cartController.purchaseCart(cid);
  if (result.success) {
    res.json(result.payload);
  } else {
    res.status(500).json({ error: 'Error finalizando la compra' });
  }
});

module.exports = router;