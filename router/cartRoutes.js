const express = require('express');
const cartManager = require('../dao/cartManager');
const router = express.Router();

router.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.json(newCart);
});

router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/product/:pid', (req, res) => {
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const newCart = cartManager.createCart();
  const result = cartManager.addProductToCart(newCart.id, productId, quantity);
  if (result.success) {
    res.json(result.cart);
  } else {
    res.status(404).json({ error: result.message });
  }
});

// DELETE 
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const result = await cartManager.removeProduct(cid, pid);
  res.send(result);
});

// PUT 
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  const result = await cartManager.updateCart(cid, products);
  res.send(result);
});

// PUT 
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const result = await cartManager.updateProductQuantity(cid, pid, quantity);
  res.send(result);
});

// DELETE 
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  const result = await cartManager.clearCart(cid);
  res.send(result);
});

module.exports = router;