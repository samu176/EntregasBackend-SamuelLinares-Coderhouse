const CartDAO = require('../dao/cartDAO');

class CartRepository {
  async getCartById(id) {
    return await CartDAO.getCartById(id);
  }

  async createCart(cart) {
    return await CartDAO.createCart(cart);
  }

  async updateCart(id, cart) {
    return await CartDAO.updateCart(id, cart);
  }

  async deleteCart(id) {
    return await CartDAO.deleteCart(id);
  }
}

module.exports = new CartRepository();