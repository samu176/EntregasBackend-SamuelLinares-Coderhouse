const CartDAO = require('../dao/cartDAO');
const productController = require('./productController');

// Crear un nuevo carrito
const createCart = async () => {
  try {
    return await CartDAO.createCart();
  } catch (error) {
    console.error(error);
    throw new Error('CreateCartError'); 
  }
};

// Obtener un carrito por su ID
const getCartById = async (cartId) => {
  try {
    return await CartDAO.getCartById(cartId);
  } catch (error) {
    console.error(error);
    throw new Error('GetCartByIdError');
  }
};

// Agregar un producto al carrito
const addProductToCart = async (cartId, productId, quantity) => {
  try {
    return await CartDAO.addProductToCart(cartId, productId, quantity);
  } catch (error) {
    console.error(error);
    throw new Error('AddProductToCartError');
  }
};

// Remover un producto del carrito
const removeProduct = async (cartId, productId) => {
  try {
    return await CartDAO.removeProduct(cartId, productId);
  } catch (error) {
    console.error(error);
    throw new Error('RemoveProductError');
  }
};

// Actualizar el carrito
const updateCart = async (cartId, products) => {
  try {
    return await CartDAO.updateCart(cartId, products);
  } catch (error) {
    console.error(error);
    throw new Error('UpdateCartError');
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    return await CartDAO.updateProductQuantity(cartId, productId, quantity);
  } catch (error) {
    console.error(error);
    throw new Error('UpdateProductQuantityError');
  }
};

// Limpiar el carrito
const clearCart = async (cartId) => {
  try {
    return await CartDAO.clearCart(cartId);
  } catch (error) {
    console.error(error);
    throw new Error('ClearCartError');
  }
};

// Proceso de compra carrito
const purchaseCart = async (cartId) => {
  try {
    const cart = await getCartById(cartId);
    if (!cart) {
      throw new Error('CartNotFoundError');
    }

    const notPurchasedProducts = [];
    for (const product of cart.products) {
      const productInfo = await productController.getProductById(product.productId);
      if (productInfo.stock < product.quantity) {
        notPurchasedProducts.push(product);
      } else {
        await productController.updateStock(product.productId, productInfo.stock - product.quantity);
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
    throw new Error('PurchaseCartError');
  }
};

module.exports = { createCart, getCartById, addProductToCart, removeProduct, updateCart, updateProductQuantity, clearCart, purchaseCart };