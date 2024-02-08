const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const productManager = require('./dao/productManager');
const messageManager = require('./dao/messageManager');
const { connectToMongoDB, mongoURL } = require('./db/mongoConnect');
const ensureAuthenticated = require('./middleware/authMiddleware');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 8080;

// Configuración de Handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs.engine({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main',
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
  secret: '1234567',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongoUrl: mongoURL 
  })
}));

// Rutas para productos, carritos y autenticación
const productRoutes = require('./router/productRoutes');
const cartRoutes = require('./router/cartRoutes');
const messageRoutes = require('./router/messageRoutes');
const authRoutes = require('./router/authRoutes');

app.use('/home', ensureAuthenticated, productRoutes);
app.use('/cart', ensureAuthenticated, cartRoutes); 
app.use('/messages', messageRoutes);
app.use('/', authRoutes);

// Ruta para la vista de chat
app.get('/chat', ensureAuthenticated, (req, res) => {
  res.render('chat');
});

// Ruta para la vista de productos
app.get('/products', async (req, res) => {
  try {
    const options = {
    };

    const productsData = await getProducts(options);

    console.log("Products Data:", productsData);
    console.log("Payload in Products Data:", productsData.payload);

    res.render('home', { products: productsData.payload, ...otrosDatos });
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

  socket.on('disconnect', () => {
    console.log('Se desconecto un usuario del chat');
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});