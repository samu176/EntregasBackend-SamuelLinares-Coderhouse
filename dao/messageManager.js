const Message = require('./models/messageModel'); 

// Obtener todos los mensajes
const getMessages = async () => {
  try {
    const messages = await Message.find();
    return messages;
  } catch (error) {
    console.error(error);
    throw new Error('Error al leer los mensajes de la base de datos');
  }
};

// Agregar un nuevo mensaje
const addMessage = async (name, message) => {
  try {
    const newMessage = new Message({ name, message, timestamp: new Date() });
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.error(error);
    throw new Error('EError al guardar en la base de datos');
  }
};

module.exports = {
  getMessages,
  addMessage,
};