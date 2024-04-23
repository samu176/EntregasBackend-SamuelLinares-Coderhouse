const nodemailer = require('nodemailer');
const config = require('./config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.sendMessageEmail,
    pass: config.sendMessageEmailPassword
  }
});

async function sendMail(mailOptions) {
  mailOptions.from = config.sendMessageEmail;

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email enviado a ${mailOptions.to}`);
  } catch (error) {
    logger.error(`Error enviando email a ${mailOptions.to}: ${error}`);
  }
}

module.exports = sendMail;