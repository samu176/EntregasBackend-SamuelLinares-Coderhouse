function ensureAuthenticated(req, res, next) {
  if (req.user) {
    if (req.path === '/realtimeProducts' && req.user.role !== 'admin') {
      res.redirect('/home'); // redirige a los usuarios que no son admin a la página de inicio
    } else {
      return next();
    }
  } else {
    res.redirect('/login');
  }
}

module.exports = ensureAuthenticated;