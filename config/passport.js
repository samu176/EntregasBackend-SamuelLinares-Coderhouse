const config = require('./config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const userManager = require('../dao/userManager');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  // Verificar si las credenciales son del admin
  if (email === config.adminEmail && password === config.adminPassword) {
    return done(null, { _id: 'admin', role: 'admin' });
  }

  // Buscar el usuario en la base de datos
  const user = await userManager.findUser(email);
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
    userManager.findUserByGithubId(profile.id).then(user => {
      if (user) {
        return cb(null, user);
      } else {
        userManager.createUser(profile.username, 'sin apellido', profile.emails[0].value, 0, '1234', profile.id).then(user => {
          return cb(null, user);
        });
      }
    }).catch(err => {
      return cb(err, null);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  if (id === 'admin') {
    done(null, { _id: 'admin', role: 'admin' });
  } else {
    const user = await userManager.findUserById(id);
    done(null, user);
  }
});

module.exports = passport;