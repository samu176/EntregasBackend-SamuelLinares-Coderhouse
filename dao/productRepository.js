const ProductDAO = require('./productDAO');
const ProductDTO = require('./productDTO');

class ProductRepository {
  async getProductById(id) {
    const product = await ProductDAO.getProductById(id);
    return new ProductDTO(product);
  }

  async createProduct(product) {
    const createdProduct = await ProductDAO.createProduct(product);
    return new ProductDTO(createdProduct);
  }

  async updateProduct(id, product) {
    const updatedProduct = await ProductDAO.updateProduct(id, product);
    return new ProductDTO(updatedProduct);
  }

  async deleteProduct(id) {
    await ProductDAO.deleteProduct(id);
  }

  async getProducts(options = {}) {
    const result = await ProductDAO.getProducts(options);
    if (result.docs) {
      return {
        ...result,
        payload: result.docs.map(doc => new ProductDTO(doc))
      };
    } else {
      return {
        status: 'success',
        payload: result.map(doc => new ProductDTO(doc)),
      };
    }
  }

  async addProduct(productData) {
    const addedProduct = await ProductDAO.addProduct(productData);
    return new ProductDTO(addedProduct);
  }
}

module.exports = new ProductRepository();