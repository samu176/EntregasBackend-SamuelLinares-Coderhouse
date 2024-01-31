const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    const mongoURL = 'mongodb+srv://admin:admin@cluster0.afvs2wp.mongodb.net/ecommerce?retryWrites=true&w=majority';
    await mongoose.connect(mongoURL);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al intentar conectar a MongoDB:', error.message);
  }
};

module.exports = connectToMongoDB;
