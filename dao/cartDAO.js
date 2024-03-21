const Cart = require('../models/cartModel');

class CartDAO {
  async createCart() {
    try {
      const newCart = new Cart();
      return newCart.save();
    } catch (error) {
      throw new Error('CreateCartError');
    }
  }

  async getCartById(cartId) {
    try {
      return Cart.findById(cartId).populate('products.productId');
    } catch (error) {
      throw new Error('GetCartByIdError');
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      return cart.save();
    } catch (error) {
      throw new Error('AddProductToCartError');
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = cart.products.filter((product) => product.productId.toString() !== productId);
      return cart.save();
    } catch (error) {
      throw new Error('RemoveProductError');
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = products;
      return cart.save();
    } catch (error) {
      throw new Error('UpdateCartError');
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
        return cart.save();
      }
    } catch (error) {
      throw new Error('UpdateProductQuantityError');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = [];
      return cart.save();
    } catch (error) {
      throw new Error('ClearCartError');
    }
  }
}

module.exports = new CartDAO();