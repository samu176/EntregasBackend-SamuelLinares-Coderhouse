const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const productManager = require('./dao/productManager');
const messageManager = require('./dao/messageManager');
const { connectToMongoDB } = require('./db/mongoConnect');
const config = require('./config/config'); 
const ensureAuthenticated = require('./middleware/authMiddleware');
const passport = require('./config/passport');
const { homeRoutes, apiRoutes, cartRoutes, messageRoutes, authRoutes } = require('./router');
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
      const result = await productManager.getProducts();
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

    const productsData = await productManager.getProducts(options);

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
io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado al chat');

  socket.on('chatMessage', async (data) => {
    try {
      // Guarda el mensaje en la base de datos
      const newMessage = await messageManager.addMessage(data.name, data.message);
      // Emite el mensaje a todos los clientes
      io.emit('chatMessage', newMessage);
    } catch (error) {
      console.error('Error cargando los mensajes', error);
    }
  });

  socket.on('newProduct', async (productData) => {
    try {
      // Agrega el nuevo producto a la base de datos
      const newProduct = await productManager.addProduct(productData);
      // Obtiene la lista actualizada de productos
      const products = await productManager.getProducts({});
      // Emite el evento 'updateProducts' con la lista actualizada de productos
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al agregar el producto', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Se desconecto un usuario del chat');
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});