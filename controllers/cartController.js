const CartDAO = require('./dao/cartDAO');
const productManager = require('./productManager');

// Crear un nuevo carrito
const createCart = async () => {
  try {
    return await CartDAO.createCart();
  } catch (error) {
    console.error(error);
    throw new Error('Error creando el nuevo carrito'); 
  }
};

// Obtener un carrito por su ID
const getCartById = async (cartId) => {
  try {
    return await CartDAO.getCartById(cartId);
  } catch (error) {
    console.error(error);
    throw new Error('Error obteniendo el carrito por ID');
  }
};

// Agregar un producto al carrito
const addProductToCart = async (cartId, productId, quantity) => {
  try {
    return await CartDAO.addProductToCart(cartId, productId, quantity);
  } catch (error) {
    console.error(error);
    throw new Error('Error agregando producto al carrito');
  }
};

// Remover un producto del carrito
const removeProduct = async (cartId, productId) => {
  try {
    return await CartDAO.removeProduct(cartId, productId);
  } catch (error) {
    console.error(error);
    throw new Error('Error eliminando producto del carrito');
  }
};

// Actualizar el carrito
const updateCart = async (cartId, products) => {
  try {
    return await CartDAO.updateCart(cartId, products);
  } catch (error) {
    console.error(error);
    throw new Error('Error actualizando el carrito');
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    return await CartDAO.updateProductQuantity(cartId, productId, quantity);
  } catch (error) {
    console.error(error);
    throw new Error('Error actualizando la cantidad del producto');
  }
};

// Limpiar el carrito
const clearCart = async (cartId) => {
  try {
    return await CartDAO.clearCart(cartId);
  } catch (error) {
    console.error(error);
    throw new Error('Error al limpiar el carrito');
  }
};

// Proceso de compra carrito
const purchaseCart = async (cartId) => {
  try {
    const cart = await getCartById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const notPurchasedProducts = [];
    for (const product of cart.products) {
      const productInfo = await productManager.getProductById(product.productId);
      if (productInfo.stock < product.quantity) {
        notPurchasedProducts.push(product);
      } else {
        await productManager.updateStock(product.productId, productInfo.stock - product.quantity);
      }
    }

    if (notPurchasedProducts.length > 0) {
      await updateCart(cartId, notPurchasedProducts);
      return { success: false, payload: notPurchasedProducts };
    }

    await clearCart(cartId);
    return { success: true, payload: 'Compra finalizada con éxito' };
  } catch (error) {
    console.error(error);
    throw new Error('Error finalizando la compra');
  }
};

module.exports = { createCart, getCartById, addProductToCart, removeProduct, updateCart, updateProductQuantity, clearCart, purchaseCart };