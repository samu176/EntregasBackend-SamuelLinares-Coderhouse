const productController = require('../controllers/productController');
const messageController = require('../controllers/messageController');

module.exports = function(io) {
  io.on('connection', async (socket) => {
    console.log('Un usuario se ha conectado al chat');

    // Envía todos los productos existentes al cliente que acaba de conectarse
    try {
      const products = await productController.getProducts({});
      socket.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al obtener los productos', error);
    }

    socket.on('chatMessage', async (data) => {
      try {
        const newMessage = await messageController.addMessage(data.name, data.message);
        io.emit('chatMessage', newMessage);
      } catch (error) {
        console.error('Error cargando los mensajes', error);
      }
    });

    socket.on('newProduct', async (productData) => {
      try {
        const newProduct = await productController.addProduct(productData);
        const products = await productController.getProducts({});
        io.emit('updateProducts', products);
      } catch (error) {
        console.error('Error al agregar el producto', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Se desconecto un usuario del chat');
    });
  });
};