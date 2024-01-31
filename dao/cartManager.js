const Cart = require('./models/cartModel'); 

// Crear un nuevo carrito
const createCart = async () => {
  try {
    const newCart = new Cart();
    await newCart.save();
    return newCart;
  } catch (error) {
    console.error(error);
    throw new Error('Error creando el nuevo carrito'); 
  }
};

// Obtener un carrito por su ID
const getCartById = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId).populate('products.productId');
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error obteniendo el carrito por ID');
  }
};

// Agregar un producto al carrito
const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('carrito no encontrado');
    }

    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (productIndex > -1) {
      // El producto ya está en el carrito, solo actualiza la cantidad
      cart.products[productIndex].quantity += quantity;
    } else {
      // Agrega el nuevo producto al carrito
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error agregando producto al carrito');
  }
};

// Remover un producto del carrito
const removeProduct = async (cartId, productId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = cart.products.filter((product) => product.productId.toString() !== productId);
    await cart.save();
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error eliminando producto del carrito');
  }
};

// Actualizar el carrito
const updateCart = async (cartId, products) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carritoo no encontrado');
    }

    cart.products = products;
    await cart.save();
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error actualizando el carrito');
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('carrrito no encontrado');
    }

    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
    } else {
      throw new Error('Producto no encontrado en el carrito');
    }

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error actualizando la cantidad del producto');
  }
};

// Limpiar el carrito
const clearCart = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = [];
    await cart.save();
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error al limpiar el carrito');
  }
};

module.exports = { createCart, getCartById, addProductToCart, removeProduct, updateCart, updateProductQuantity, clearCart };