const Product = require('../models/productModel');

class ProductDAO {
  async getProductById(id) {
    const product = await Product.findById(id);
    return product ? this.toDTO(product) : null;
  }

  async createProduct(product) {
    const newProduct = new Product(product);
    const savedProduct = await newProduct.save();
    return this.toDTO(savedProduct);
  }

  async updateProduct(id, product) {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    return updatedProduct ? this.toDTO(updatedProduct) : null;
  }

  async deleteProduct(id) {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct ? this.toDTO(deletedProduct) : null;
  }

  async getProducts(options = {}) {
    const { limit, page, sort, query } = options;
    const filter = query ? { category: query } : {};
    const sortOptions = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

    if (limit && page) {
      const result = await Product.paginate(filter, {
        limit,
        page,
        sort: sortOptions,
        lean: true, 
      });
      return {
        ...result,
        docs: result.docs.map(doc => this.toDTO(doc))
      };
    } else {
      const result = await Product.find(filter).sort(sortOptions).lean();
      return result.map(doc => this.toDTO(doc));
    }
  }

  async addProduct(productData) {
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    return this.toDTO(savedProduct);
  }

  toDTO(product) {
    return {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnails: product.thumbnails,
      code: product.code,
      stock: product.stock,
      category: product.category,
    };
  }
}

module.exports = new ProductDAO();