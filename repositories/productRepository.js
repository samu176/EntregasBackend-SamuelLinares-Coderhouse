const ProductDAO = require('../dao/productDAO');

class ProductRepository {
  async getProductById(id) {
    return await ProductDAO.getProductById(id);
  }

  async createProduct(product) {
    return await ProductDAO.createProduct(product);
  }

  async updateProduct(id, product) {
    return await ProductDAO.updateProduct(id, product);
  }

  async deleteProduct(id) {
    return await ProductDAO.deleteProduct(id);
  }

  async getProducts(options = {}) {
    return await ProductDAO.getProducts(options);
  }

  async addProduct(productData) {
    return await ProductDAO.addProduct(productData);
  }
}

module.exports = new ProductRepository();