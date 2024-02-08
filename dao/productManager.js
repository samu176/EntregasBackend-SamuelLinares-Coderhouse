const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnails: { type: [String], required: true }, 
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

const addProduct = async (productData) => {
  try {
    const newProduct = new Product(productData);
    const addedProduct = await newProduct.save();
    return addedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProducts = async (options) => {
  try {
    const { limit = 10, page = 1, sort, query } = options;
    const filter = query ? { category: query } : {};
    const sortOptions = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

    const result = await Product.paginate(filter, {
      limit,
      page,
      sort: sortOptions,
      lean: true, 
    });

    console.log('Result.docs:', result.docs);
    console.log('Result.totalPages:', result.totalPages);
    console.log('Result.page:', result.page);

    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevPage ? `/api/home?limit=${limit}&page=${result.prevPage}` : null,
      nextLink: result.nextPage ? `/api/home?limit=${limit}&page=${result.nextPage}` : null,
    };
  } catch (error) {
    console.error('Error al obtener productos', error.message);
    throw new Error(error.message);
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProduct = async (productId, newData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, newData, { new: true });
    if (!updatedProduct) {
      throw new Error('Producto no encontrado');
    }
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(productId);
    if (!deletedProduct) {
      throw new Error('Producto no encontrado');
    }
    return deletedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { addProduct, getProducts, getProductById, updateProduct, deleteProduct };