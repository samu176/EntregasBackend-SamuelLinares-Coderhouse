const Message = require('../models/messageModel');

class MessageDAO {
  async getMessageById(id) {
    return Message.findById(id);
  }

  async createMessage(message) {
    const newMessage = new Message(message);
    return newMessage.save();
  }

  async getMessages() {
    return Message.find();
  }
}

module.exports = new MessageDAO();