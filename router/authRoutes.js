const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const sendMail = require('../config/mailer');

// Ruta GET para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const user = await authController.register(req, first_name, last_name, email, age, password);
    console.log('Usuario creado:', user);
    req.login(user, function(err) {
      if (err) {
        console.error('Error al logear después de registrarse:', err);
        return next(err);
      }
      sendMail(email, 'Gracias por registrarte en nuestra página', 'Hola, gracias por registrarte en nuestra página. ¡Que tengas un buen día!');
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
}), (req, res) => {
  res.redirect('/home');
});

// Rutas para autenticación de GitHub
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/home');
});

// Ruta POST para logout
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
});

// Ruta GET para el perfil del usuario
router.get('/profile', (req, res) => {
  // Asegúrate de que el usuario está correctamente almacenado en la sesión
  if (!req.user) return res.redirect('/login');
  
  // Crear un DTO del usuario con solo la información necesaria
  const userDto = {
    id: req.user.id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
  };

  res.render('profile', { user: userDto });
});

module.exports = router;
