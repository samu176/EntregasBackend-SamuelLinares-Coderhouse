// Importamos el repositorio correspondiente
const ProductRepository = require('../repositories/productRepository');

class ProductService {
  // Método para agregar un producto
  async addProduct(productData) {
    try {
      // Llamar al método correspondiente del repositorio
      const product = await ProductRepository.addProduct(productData);
      return product;
    } catch (error) {
      throw new Error('AddProductError: ' + error.message);
    }
  }

  // Método para obtener los productos
  async getProducts(options = {}) {
    try {
      // Llamar al método correspondiente del repositorio
      const productsData = await ProductRepository.getProducts(options);
      return productsData;
    } catch (error) {
      throw new Error('GetProductsError: ' + error.message);
    }
  }

  // Método para obtener un producto por su ID
  async getProductById(productId) {
    try {
      // Llamar al método correspondiente del repositorio
      const product = await ProductRepository.getProductById(productId);
      return product;
    } catch (error) {
      throw new Error('GetProductByIdError: ' + error.message);
    }
  }

  // Método para actualizar un producto
  async updateProduct(productId, newData, userId, userRole) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.owner !== userId && userRole !== 'admin') {
        throw new Error('Permission denied');
      }
      const updatedProduct = await ProductRepository.updateProduct(productId, newData);
      return updatedProduct;
    } catch (error) {
      throw new Error('UpdateProductError: ' + error.message);
    }
  }

  // Método para eliminar un producto
  async deleteProduct(productId, userId, userRole) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.owner !== userId && userRole !== 'admin') {
        throw new Error('Permission denied');
      }
      await ProductRepository.deleteProduct(productId);
    } catch (error) {
      throw new Error('DeleteProductError: ' + error.message);
    }
  }

  // Método para actualizar el stock de un producto
  async updateStock(productId, newStock) {
    try {
      // Obtener el producto por su ID
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Actualizar el stock del producto
      product.stock = newStock;
      await product.save();
      return true;
    } catch (error) {
      throw new Error('UpdateStockError: ' + error.message);
    }
  }
}

module.exports = new ProductService();