require('dotenv').config();

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
const productController = require('./controllers/productController');
const setupRoutes = require('./router');
const errorHandler = require('./utils/errorHandler');
const socketHandlers = require('./utils/socketHandlers');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
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
  logger.debug(something);
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

app.use((req, res, next) => {
  logger.debug(`Información de la sesión: ${JSON.stringify(req.session)}`);
  next();
});


// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'APIs for Ecommerce Application',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./docs/*.yaml'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware para agregar logger al objeto req
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

// Inicializar Passport y la sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

// Uso de rutas para el home, la API, los carritos, los mensajes, la autenticación y los productos en tiempo real
setupRoutes(app);

app.use(errorHandler); // Usar el middleware de manejo de errores

// Ruta para la vista de chat
app.get('/chat', ensureAuthenticated, (req, res) => {
  res.render('chat');
});

// Manejo de mensajes de chat con Socket.IO
socketHandlers(io);

// Pasar el objeto 'io' a controlador de productos
productController.setIo(io);

// Iniciar el servidor
server.listen(PORT, () => {
  logger.info(`Servidor escuchando en http://localhost:${PORT}`);
});