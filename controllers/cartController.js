const CartDAO = require('../dao/cartDAO');
const productController = require('./productController');

// Crear un nuevo carrito
const createCart = async () => {
  console.log('Intentando crear un nuevo carrito...');
  try {
    const cart = await CartDAO.createCart();
    console.log('Nuevo carrito creado:', cart);
    return cart;
  } catch (error) {
    console.error('Error al crear carrito:', error);
    throw new Error('CreateCartError'); 
  }
};

// Obtener un carrito por su ID
const getCartById = async (cartId) => {
  console.log(`Intentando obtener el carrito con ID: ${cartId}`);
  try {
    const cart = await CartDAO.getCartById(cartId);
    console.log(`Carrito con ID ${cartId} obtenido con éxito:`, cart);
    return cart;
  } catch (error) {
    console.error(`Error al obtener el carrito con ID ${cartId}:`, error);
    throw new Error('GetCartByIdError');
  }
};

// Agregar un producto al carrito
const addProductToCart = async (cartId, productId, quantity) => {
  console.log(`Intentando agregar producto al carrito. Cart ID: ${cartId}, Product ID: ${productId}, Cantidad: ${quantity}`);
  try {
    const result = await CartDAO.addProductToCart(cartId, productId, quantity);
    console.log(`Producto agregado con éxito al carrito. Cart ID: ${cartId}, Product ID: ${productId}, Cantidad: ${quantity}`);
    return result;
  } catch (error) {
    console.error(`Error al agregar producto al carrito. Cart ID: ${cartId}, Product ID: ${productId}:`, error);
    throw new Error('AddProductToCartError');
  }
};

// Remover un producto del carrito
const removeProduct = async (cartId, productId) => {
  console.log(`Intentando remover producto del carrito. Cart ID: ${cartId}, Product ID: ${productId}`);
  try {
    const result = await CartDAO.removeProduct(cartId, productId);
    console.log(`Producto eliminado con éxito del carrito. Cart ID: ${cartId}, Product ID: ${productId}`);
    return result;
  } catch (error) {
    console.error(`Error al eliminar producto del carrito. Cart ID: ${cartId}, Product ID: ${productId}:`, error);
    throw new Error('RemoveProductError');
  }
};

// Actualizar el carrito
const updateCart = async (cartId, products) => {
  console.log(`Intentando actualizar el carrito. Cart ID: ${cartId}, Productos:`, products);
  try {
    const result = await CartDAO.updateCart(cartId, products);
    console.log(`Carrito actualizado con éxito. Cart ID: ${cartId}`);
    return result;
  } catch (error) {
    console.error(`Error al actualizar el carrito. Cart ID: ${cartId}:`, error);
    throw new Error('UpdateCartError');
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (cartId, productId, quantity) => {
  console.log(`Intentando actualizar la cantidad del producto en el carrito. Cart ID: ${cartId}, Product ID: ${productId}, Nueva Cantidad: ${quantity}`);
  try {
    const result = await CartDAO.updateProductQuantity(cartId, productId, quantity);
    console.log(`Cantidad del producto actualizada con éxito en el carrito. Cart ID: ${cartId}, Product ID: ${productId}`);
    return result;
  } catch (error) {
    console.error(`Error al actualizar cantidad de producto en el carrito. Cart ID: ${cartId}, Product ID: ${productId}:`, error);
    throw new Error('UpdateProductQuantityError');
  }
};

// Limpiar el carrito
const clearCart = async (cartId) => {
  console.log(`Intentando limpiar el carrito. Cart ID: ${cartId}`);
  try {
    const result = await CartDAO.clearCart(cartId);
    console.log(`Carrito limpiado con éxito. Cart ID: ${cartId}`);
    return result;
  } catch (error) {
    console.error(`Error al limpiar el carrito. Cart ID: ${cartId}:`, error);
    throw new Error('ClearCartError');
  }
};

// Proceso de compra del carrito
const purchaseCart = async (cartId) => {
  console.log(`Intentando finalizar compra con el carrito ID: ${cartId}`);
  try {
    const cart = await getCartById(cartId);
    if (!cart) {
      throw new Error('CartNotFoundError');
    }

    const notPurchasedProducts = [];
    for (const product of cart.products) {
      const productInfo = await productController.getProductById(product.productId);
      if (productInfo.stock < product.quantity) {
        console.log(`Stock insuficiente para el producto ID: ${product.productId}`);
        notPurchasedProducts.push(product);
      } else {
        await productController.updateStock(product.productId, productInfo.stock - product.quantity);
      }
    }

    if (notPurchasedProducts.length > 0) {
      await updateCart(cartId, notPurchasedProducts);
      console.log(`Compra no completada por stock insuficiente. Productos no comprados:`, notPurchasedProducts);
      return { success: false, payload: notPurchasedProducts };
    }

    await clearCart(cartId);
    console.log(`Compra finalizada con éxito. Cart ID: ${cartId}`);
    return { success: true, payload: 'Compra finalizada con éxito' };
  } catch (error) {
    console.error(`Error en el proceso de compra del carrito. Cart ID: ${cartId}:`, error);
    throw new Error('PurchaseCartError');
  }
};

module.exports = { createCart, getCartById, addProductToCart, removeProduct, updateCart, updateProductQuantity, clearCart, purchaseCart };
