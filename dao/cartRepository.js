const CartDAO = require('./cartDAO');
const CartDTO = require('./cartDTO');

class CartRepository {
  async getCartById(id) {
    const cart = await CartDAO.getCartById(id);
    return new CartDTO(cart);
  }

  async createCart(cart) {
    const createdCart = await CartDAO.createCart(cart);
    return new CartDTO(createdCart);
  }

  async updateCart(id, cart) {
    const updatedCart = await CartDAO.updateCart(id, cart);
    return new CartDTO(updatedCart);
  }

  async deleteCart(id) {
    const deletedCart = await CartDAO.deleteCart(id);
    return new CartDTO(deletedCart);
  }
}

module.exports = new CartRepository();