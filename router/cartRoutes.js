const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  console.log('Intentando crear un nuevo carrito...');
  try {
    const newCart = await cartController.createCart();
    console.log('Nuevo carrito creado:', newCart);
    res.json(newCart);
  } catch (error) {
    console.error('Error creando el carrito:', error);
    res.status(500).json({ error: 'Error creando el carrito' });
  }
});

// Obtener el carrito del usuario en sesión
router.get('/', async (req, res) => {
  const cartId = req.user.cart;
  console.log(`Buscando carrito con ID de sesión: ${cartId}`);
  if (!cartId) {
    console.log('No se encontró el ID del carrito en la sesión.');
    return res.status(404).json({ error: 'Carrito no encontrado. El usuario no tiene un carrito asociado.' });
  }

  try {
    const cart = await cartController.getCartById(cartId);
    console.log('Carrito encontrado con éxito:', cart);
    res.render('carts', { cart });
  } catch (error) {
    console.error('Error al buscar el carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
});

// Agregar un producto al carrito
router.post('/product/:pid', async (req, res) => {
  console.log(`Sesión actual: ${JSON.stringify(req.session)}`);
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  console.log(`Agregando producto al carrito. Producto ID: ${productId}, Cantidad: ${quantity}`);

  const cartId = req.user.cart;
  console.log(`Cart ID obtenido de la sesión: ${cartId}`);

  if (!cartId) {
    console.log('No se encontró el ID del carrito en la sesión para agregar producto.');
    return res.status(404).json({ error: 'Carrito no encontrado.' });
  }

  try {
    const result = await cartController.addProductToCart(cartId, productId, quantity);
    console.log(`Producto agregado con éxito al carrito. Carrito ID: ${cartId}, Producto ID: ${productId}`);
    res.json(result);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error agregando producto al carrito' });
  }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  console.log(`Eliminando producto del carrito. Carrito ID: ${cid}, Producto ID: ${pid}`);
  try {
    const result = await cartController.removeProduct(cid, pid);
    console.log(`Producto eliminado con éxito del carrito. Carrito ID: ${cid}, Producto ID: ${pid}`);
    res.send(result);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).send({ error: 'Error al eliminar producto del carrito' });
  }
});

// Actualizar un carrito
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  console.log(`Actualizando carrito. Carrito ID: ${cid}, Productos:`, products);
  try {
    const result = await cartController.updateCart(cid, products);
    console.log(`Carrito actualizado con éxito. Carrito ID: ${cid}`);
    res.send(result);
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    res.status(500).send({ error: 'Error al actualizar el carrito' });
  }
});

// Finalizar compra del carrito
router.post('/:cid/purchase', async (req, res) => {
  const { cid } = req.params;
  console.log(`Finalizando compra para el carrito ID: ${cid}`);
  try {
    const result = await cartController.purchaseCart(cid);
    if (result.success) {
      console.log(`Compra finalizada con éxito para el carrito ID: ${cid}`);
      res.json(result.payload);
    } else {
      console.log('Error finalizando la compra:', result);
      res.status(500).json({ error: 'Error finalizando la compra', details: result.payload });
    }
  } catch (error) {
    console.error('Error durante el proceso de compra:', error);
    res.status(500).json({ error: 'Error en el proceso de compra' });
  }
});

// Eliminar un carrito
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  console.log(`Intentando eliminar el carrito con ID: ${cid}`);
  try {
    const result = await cartController.clearCart(cid);
    console.log(`Carrito eliminado con éxito. Carrito ID: ${cid}`);
    res.send({ message: 'Carrito eliminado con éxito', data: result });
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).send({ error: 'Error al eliminar el carrito' });
  }
});

// Actualizar la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  console.log(`Actualizando cantidad para el producto. Carrito ID: ${cid}, Producto ID: ${pid}, Cantidad: ${quantity}`);
  try {
    const result = await cartController.updateProductQuantity(cid, pid, quantity);
    console.log(`Cantidad actualizada con éxito para el producto en el carrito. Carrito ID: ${cid}, Producto ID: ${pid}`);
    res.send(result);
  } catch (error) {
    console.error('Error al actualizar cantidad del producto en el carrito:', error);
    res.status(500).send({ error: 'Error al actualizar cantidad del producto en el carrito' });
  }
});

module.exports = router;
