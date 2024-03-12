class MessageDTO {
    constructor(message) {
      this.id = message._id;
      this.name = message.name;
      this.message = message.message;
      this.timestamp = message.timestamp;
    }
  }
  
  module.exports = MessageDTO;