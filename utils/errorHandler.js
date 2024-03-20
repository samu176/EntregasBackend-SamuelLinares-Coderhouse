const errorMessages = {
    'AddProductError': 'Error al agregar un producto a la base de datos',
    'AddToCartError': 'Error al agregar un producto al carrito',
    'CreateCartError': 'Error al crear un carrito',
    'EmptyCartError': 'Error al vaciar el carrito',
};

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = errorMessages[err.name] || err.message || 'Error interno del servidor';
    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: message
    });
}

module.exports = errorHandler;