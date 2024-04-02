const CartService = require('../services/cartService');
const productController = require('./productController');

// Crear un nuevo carrito
const createCart = async () => {
  try {
    const cart = await CartService.createCart();
    return cart;
  } catch (error) {
    throw new Error('CreateCartError'); 
  }
};

// Obtener un carrito por su ID
const getCartById = async (cartId) => {
  try {
    const cart = await CartService.getCartById(cartId);
    return cart;
  } catch (error) {
    throw new Error('GetCartByIdError');
  }
};

// Agregar un producto al carrito
const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const result = await CartService.addProductToCart(cartId, productId, quantity);
    return result;
  } catch (error) {
    throw new Error('AddProductToCartError');
  }
};

// Remover un producto del carrito
const removeProduct = async (cartId, productId) => {
  try {
    const result = await CartService.removeProduct(cartId, productId);
    return result;
  } catch (error) {
    throw new Error('RemoveProductError');
  }
};

// Actualizar el carrito
const updateCart = async (cartId, products) => {
  try {
    const result = await CartService.updateCart(cartId, products);
    return result;
  } catch (error) {
    throw new Error('UpdateCartError');
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    const result = await CartService.updateProductQuantity(cartId, productId, quantity);
    return result;
  } catch (error) {
    throw new Error('UpdateProductQuantityError');
  }
};

// Limpiar el carrito
const clearCart = async (cartId) => {
  try {
    const result = await CartService.clearCart(cartId);
    return result;
  } catch (error) {
    throw new Error('ClearCartError');
  }
};

// Proceso de compra del carrito
const purchaseCart = async (cartId) => {
  try {
    const cart = await CartService.getCartById(cartId);
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
      await CartService.updateCart(cartId, notPurchasedProducts);
      return { success: false, payload: notPurchasedProducts };
    }

    await CartService.clearCart(cartId);
    return { success: true, payload: 'Compra finalizada con éxito' };
  } catch (error) {
    throw new Error('PurchaseCartError');
  }
};

module.exports = { createCart, getCartById, addProductToCart, removeProduct, updateCart, updateProductQuantity, clearCart, purchaseCart };