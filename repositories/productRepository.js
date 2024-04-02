const ProductDAO = require('../dao/productDAO');

class ProductRepository {
  async getProductById(id) {
    const product = await ProductDAO.getProductById(id);
    return product;
  }

  async createProduct(product) {
    const createdProduct = await ProductDAO.createProduct(product);
    return createdProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await ProductDAO.updateProduct(id, product);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await ProductDAO.deleteProduct(id);
    return deletedProduct;
  }

  async getProducts(options = {}) {
    const products = await ProductDAO.getProducts(options);
    return products;
  }

  async addProduct(productData) {
    const addedProduct = await ProductDAO.addProduct(productData);
    return addedProduct;
  }
}

module.exports = new ProductRepository();