const Product = require('../models/productModel');

class ProductDAO {
  async getProductById(id) {
    return Product.findById(id);
  }

  async createProduct(product) {
    const newProduct = new Product(product);
    return newProduct.save();
  }

  async updateProduct(id, product) {
    return Product.findByIdAndUpdate(id, product, { new: true });
  }

  async deleteProduct(id) {
    return Product.findByIdAndDelete(id);
  }

  async getProducts(options = {}) {
    const { limit, page, sort, query } = options;
    const filter = query ? { category: query } : {};
    const sortOptions = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

    if (limit && page) {
      return Product.paginate(filter, {
        limit,
        page,
        sort: sortOptions,
        lean: true, 
      });
    } else {
      return Product.find(filter).sort(sortOptions).lean();
    }
  }

  async addProduct(productData) {
    const newProduct = new Product(productData);
    return newProduct.save();
  }
}

module.exports = new ProductDAO();