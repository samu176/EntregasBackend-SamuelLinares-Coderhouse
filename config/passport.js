const config = require('./config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  // Verificar si las credenciales son del admin
  if (email === config.adminEmail && password === config.adminPassword) {
    return done(null, { 
      id: 'admin', 
      role: 'admin',
      first_name: 'Administrador',
      last_name: '',
      email: config.adminEmail
    });
  }

  // Buscar el usuario en la base de datos
  const user = await userController.findUser(email);
  if (!user) {
    return done(null, false, { message: 'Usuario no encontrado' });
  }

  // Verificar la contraseña
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return done(null, false, { message: 'Contraseña incorrecta' });
  }

  return done(null, user);
}));

// Configurar la estrategia de GitHub
passport.use(new GitHubStrategy({
    clientID: config.githubClientId,
    clientSecret: config.githubClientSecret,
    callbackURL: config.githubCallbackUrl
  },
  async function(accessToken, refreshToken, profile, cb) { 
    try {
      let user = await userController.findUserByGithubId(profile.id);
      if (user) {
        return cb(null, user);
      } else {
        // Inventar un email si no está visible en el perfil de GitHub
        const newCart = await cartController.createCart(); // Crear un nuevo carrito para el usuario de github
        // Crear usuario y asociar el ID del carrito creado
        user = await userController.createUser(profile.username, '.', profile.emails?.[0]?.value || `${profile.username}@github.com`, 0, '1234', profile.id, newCart._id);
        return cb(null, user);
      }
    } catch (err) {
      return cb(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  if (id === 'admin') {
    done(null, { 
      id: 'admin', 
      role: 'admin',
      first_name: 'Administrador',
      last_name: '',
      email: config.adminEmail,
      age: 30
    });
  } else {
    const user = await userController.findUserById(id);
    if (user) {
      // Crear un objeto de usuario con todos los campos que se necesitan
      const userDto = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart 
      };
      done(null, userDto);
    } else {
      done(new Error('User not found'), null);
    }
  }
});

module.exports = passport;
