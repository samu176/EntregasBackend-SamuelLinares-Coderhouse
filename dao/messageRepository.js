const MessageDAO = require('./messageDAO');
const MessageDTO = require('./messageDTO');

class MessageRepository {
  async getMessageById(id) {
    const message = await MessageDAO.getMessageById(id);
    return new MessageDTO(message);
  }

  async createMessage(message) {
    const createdMessage = await MessageDAO.createMessage(message);
    return new MessageDTO(createdMessage);
  }

  async getMessages() {
    const messages = await MessageDAO.getMessages();
    return messages.map(message => new MessageDTO(message));
  }
}

module.exports = new MessageRepository();