const errorMessages = {
    'AddProductError': 'Error al agregar un producto a la base de datos',
    'AddProductToCartError': 'Error al agregar un producto al carrito',
    'CreateCartError': 'Error al crear un carrito',
    'ClearCartError': 'Error al vaciar el carrito',
    'GetCartByIdError': 'Error al obtener el carrito por su ID',
    'RemoveProductError': 'Error al eliminar un producto del carrito',
    'UpdateCartError': 'Error al actualizar el carrito',
    'UpdateProductQuantityError': 'Error al actualizar la cantidad de un producto en el carrito',
    'GetProductByIdError': 'Error al obtener un producto por su ID',
    'CreateProductError': 'Error al crear un producto',
    'UpdateProductError': 'Error al actualizar un producto',
    'DeleteProductError': 'Error al eliminar un producto',
    'GetProductsError': 'Error al obtener los productos',
    'AddProductError': 'Error al agregar un producto',
    'CartNotFoundError': 'Error, carrito no encontrado',
    'PurchaseCartError': 'Error al finalizar la compra'
};

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = errorMessages[err.message] || err.message || 'Error interno del servidor';
    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: message
    });
}

module.exports = errorHandler;