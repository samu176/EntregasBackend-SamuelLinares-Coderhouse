const express = require('express');
const router = express.Router();
const authManager = require('../dao/authManager');

// Ruta GET para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await authManager.register(username, password);
  if (user) {
    req.session.user = user;
    res.redirect('/home');
  } else {
    res.status(400).send('Error al registrar el usuario');
  }
});

// Ruta GET para el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await authManager.login(username, password);
  if (user) {
    req.session.user = user;
    res.redirect('/home');
  } else {
    res.status(400).send('Nombre de usuario o contraseña incorrectos');
  }
});

// Ruta GET para el perfil del usuario
router.get('/profile', (req, res) => {
  res.render('profile', { user: req.session.user });
});

module.exports = router;