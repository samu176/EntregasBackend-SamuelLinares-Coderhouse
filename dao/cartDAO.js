const Cart = require('../models/cartModel');

class CartDAO {
  async createCart() {
    const newCart = new Cart();
    return newCart.save();
  }

  async getCartById(cartId) {
    return Cart.findById(cartId).populate('products.productId');
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    return cart.save();
  }

  async removeProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter((product) => product.productId.toString() !== productId);
    return cart.save();
  }

  async updateCart(cartId, products) {
    const cart = await Cart.findById(cartId);
    cart.products = products;
    return cart.save();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      return cart.save();
    }
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    cart.products = [];
    return cart.save();
  }
}

module.exports = new CartDAO();