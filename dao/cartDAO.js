const Cart = require('../models/cartModel');

class CartDAO {
  async getCartById(id) {
    return Cart.findById(id).populate('products.productId');
  }

  async createCart(cart) {
    const newCart = new Cart(cart);
    return newCart.save();
  }

  async updateCart(id, cart) {
    return Cart.findByIdAndUpdate(id, cart, { new: true });
  }

  async deleteCart(id) {
    return Cart.findByIdAndDelete(id);
  }
}

module.exports = new CartDAO();