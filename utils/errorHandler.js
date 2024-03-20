const errorMessages = {
    'ValidationError': 'Datos de entrada inválidos',
    'CastError': 'Formato de ID inválido',
    'MongoError': 'Error de base de datos',
    'ProductNotFound': 'Producto no encontrado',
    'UserNotFound': 'Usuario no encontrado',
    'InvalidCredentials': 'Credenciales inválidas',
    'EmailAlreadyExists': 'El correo electrónico ya está en uso',
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