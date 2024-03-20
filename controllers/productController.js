const ProductRepository = require('../repositories/productRepository');

async function addProduct(productData) {
  try {
    return await ProductRepository.addProduct(productData);
  } catch (error) {
    throw new Error(error.message);
  }
};

async function getProducts(options = {}) {
  try {
    return await ProductRepository.getProducts(options);
  } catch (error) {
    console.error('Error al obtener productos', error.message);
    throw new Error(error.message);
  }
};

async function getProductById(productId) {
  try {
    return await ProductRepository.getProductById(productId);
  } catch (error) {
    throw new Error(error.message);
  }
};

async function updateProduct(productId, newData) {
  try {
    return await ProductRepository.updateProduct(productId, newData);
  } catch (error) {
    throw new Error(error.message);
  }
};

async function deleteProduct(productId) {
  try {
    return await ProductRepository.deleteProduct(productId);
  } catch (error) {
    throw new Error(error.message);
  }
};

async function updateStock(productId, newStock) {
  try {
    const product = await getProductById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    product.stock = newStock;
    await product.save();
    return true;
  } catch (error) {
    console.error('Error actualizando el stock del producto', error.message);
    throw new Error(error.message);
  }
};

module.exports = { addProduct, getProducts, getProductById, updateProduct, deleteProduct, updateStock };