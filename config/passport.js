const config = require('./config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  console.log(email); // Agregar esto
  console.log(password); // Agregar esto
  // Verificar si las credenciales son del admin
  if (email === config.adminEmail && password === config.adminPassword) {
    return done(null, { id: 'admin', role: 'admin' });
  }

  // Buscar el usuario en la base de datos
  const user = await userController.findUser(email);
  console.log(user); // Agregar esto
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
  function(accessToken, refreshToken, profile, cb) {
    // Buscar o crear un usuario con githubId
    userController.findUserByGithubId(profile.id).then(user => {
      if (user) {
        return cb(null, user);
      } else {
        userController.createUser(profile.username, 'sin apellido', profile.emails[0].value, 0, '1234', profile.id).then(user => {
          return cb(null, user);
        });
      }
    }).catch(err => {
      return cb(err, null);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  if (id === 'admin') {
    done(null, { id: 'admin', role: 'admin' });
  } else {
    const user = await userController.findUserById(id);
    done(null, user);
  }
});

module.exports = passport;