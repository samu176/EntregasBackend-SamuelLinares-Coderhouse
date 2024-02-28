const express = require('express');
const router = express.Router();
const passport = require('passport');
const authManager = require('../dao/authManager'); 

// Ruta GET para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const user = await authManager.register(first_name, last_name, email, age, password);
    console.log('Usuario creado:', user);
    req.login(user, function(err) {
      if (err) {
        console.error('Error al logear despues de registrarse:', err);
        return next(err);
      }
      return res.redirect('/home'); // Redirigir a home después del registro
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.redirect('/register');
  }
});

// Ruta GET para el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
}), (req, res, next) => {
  // Si hay un error de autenticación, redirigir al cliente a la página de inicio de sesión con un mensaje de error
  if (req.authInfo && req.authInfo.message) {
    req.session.error = req.authInfo.message;
    return res.redirect('/login');
  }
  // Si la autenticación funciono, redirigir al cliente a la página de inicio
  res.redirect('/home');
});

// Rutas para autenticación de GitHub
router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // la autenticación funciono, entonces redirigir a home
    res.redirect('/home');
  });

// Ruta POST para logout
router.post('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/login');
});

// Ruta GET para el perfil del usuario
router.get('/profile', (req, res) => {
  res.render('profile', { user: req.session.user });
});

module.exports = router;