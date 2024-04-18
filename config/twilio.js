const twilio = require('twilio');
const config = require('./config');
const logger = require('../utils/logger');

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

async function sendSMS(to, body) {
  try {
    await client.messages.create({
      body: body,
      from: config.twilioPhoneNumber,
      to: to
    });
    logger.info(`SMS enviado a ${to}`);
  } catch (error) {
    logger.error(`Error enviando SMS a ${to}: ${error}`);
  }
}

module.exports = sendSMS;