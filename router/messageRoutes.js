const express = require('express');
const router = express.Router();
const messageManager = require('../dao/messageManager');

// Obtener todos los mensajes
router.get('/', async (req, res) => {
  try {
    const messages = await messageManager.getMessages();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los mensajes de la base de datos'});
  }
});

// Agregar un nuevo mensaje
router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;
    const newMessage = await messageManager.addMessage(name, message);
    res.json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar un nuevo mensaje'});
  }
});

module.exports = router;
