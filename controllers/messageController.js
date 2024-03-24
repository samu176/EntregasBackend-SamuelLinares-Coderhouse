const MessageDAO = require('../dao/messageDAO');

// Obtener todos los mensajes
const getMessages = async () => {
  try {
    return await MessageDAO.getMessages();
  } catch (error) {
    console.error(error);
    throw new Error('Error al leer los mensajes de la base de datos');
  }
};

// Agregar un nuevo mensaje
const addMessage = async (name, message) => {
  try {
    return await MessageDAO.createMessage({name, message});
  } catch (error) {
    console.error(error);
    throw new Error('Error al guardar el mensaje en la base de datos');
  }
};

module.exports = {
  getMessages,
  addMessage,
};