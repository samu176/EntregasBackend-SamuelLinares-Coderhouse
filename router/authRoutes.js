const express = require('express');
const router = express.Router();
const authManager = require('../dao/authManager');

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

module.exports = router;