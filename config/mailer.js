const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.sendMessageEmail,
    pass: config.sendMessageEmailPassword
  }
});

async function sendMail(to, subject, text) {
  const mailOptions = {
    from: config.sendMessageEmail,
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado a ${to}`);
  } catch (error) {
    console.error(`Error enviando email a ${to}: ${error}`);
  }
}

module.exports = sendMail;