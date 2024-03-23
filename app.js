const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { connectToMongoDB } = require('./db/mongoConnect');
const config = require('./config/config'); 
const ensureAuthenticated = require('./middleware/authMiddleware');
const passport = require('./config/passport');
const { homeRoutes, apiRoutes, cartRoutes, messageRoutes, authRoutes } = require('./router');
const errorHandler = require('./utils/errorHandler');
const socketHandlers = require('./utils/socketHandlers');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 8080;

// Configuración de Handlebars
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}));

app.set('view engine', 'handlebars');

// Registro del helper de Handlebars
Handlebars.registerHelper('log', function(something) {
  console.log(something);
});

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a MongoDB
connectToMongoDB();

// Configuración de connect-mongo
app.use(session({
  secret: '123456',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: config.mongoUrl
  })
}));

// Inicializar Passport y la sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(errorHandler); // Usar el middleware de manejo de errores

// Uso de rutas para el home, la API, los carritos, los mensajes y la autenticación
app.use('/home', ensureAuthenticated, homeRoutes);
app.use('/api', ensureAuthenticated, apiRoutes);
app.use('/cart', ensureAuthenticated, cartRoutes); 
app.use('/messages', messageRoutes);
app.use('/', authRoutes);

// Ruta para la vista de chat
app.get('/chat', ensureAuthenticated, (req, res) => {
  res.render('chat');
});

// Ruta para obtener todos los productos en tiempo real
app.get('/realtimeProducts', ensureAuthenticated, async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const result = await productController.getProducts();
      res.render('realtimeProducts', { 
        user: req.user, 
        products: result.payload,
      });
    } else {
      res.status(403).send('Acceso denegado');
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para la vista de productos
app.get('/products', async (req, res) => {
  try {
    const filter = req.query.filter || {};
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const options = {
      filter,
      limit,
      page
    };

    const productsData = await productController.getProducts(options);

    console.log("Products Data:", productsData);
    console.log("Payload in Products Data:", productsData.payload);

    // Imprime el objeto user en la consola
    console.log(req.user);

    // Agrega los datos del usuario a los datos que se pasan a la vista
    res.render('home', { products: productsData.payload, user: req.user });
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Manejo de mensajes de chat con Socket.IO
socketHandlers(io);

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});