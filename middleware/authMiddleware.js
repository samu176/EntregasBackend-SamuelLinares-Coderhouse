function ensureAuthenticated(req, res, next) {
  if (req.user) {
    console.log(`Usuario autenticado: ${req.user.email}`);
    // Verificar si el usuario es administrador para la pagina de productos en tiempo real
    if (req.path === '/realtimeProducts' && req.user.role !== 'admin') {
      console.log('Acceso denegado. Redirigiendo al home. Ruta requiere rol admin.');
      return res.redirect('/home'); // redirige a los usuarios que no son rol "admin" a la página de inicio
    }

    // Verificar si el usuario es un usuario normal para las rutas de chat y carrito
    if ((req.path.startsWith('/chat') || req.path.startsWith('/cart')) && req.user.role !== 'usuario') {
      console.log('Acceso denegado. Redirigiendo al home. Ruta requiere rol usuario.');
      return res.redirect('/home'); // redirige a los usuarios que no son rol "usuario" a la página de inicio
    }

    return next();
  } else {
    console.log('Usuario no autenticado. Redirigiendo al login.');
    res.redirect('/login');
  }
}

module.exports = ensureAuthenticated;
