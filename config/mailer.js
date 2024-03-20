const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.SEND_MESSAGE_EMAIL,
    pass: config.SEND_MESSAGE_EMAIL_PASSWORD
  }
});

async function sendMail(to, subject, text) {
  const mailOptions = {
    from: config.SEND_MESSAGE_EMAIL,
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}: ${error}`);
  }
}

module.exports = sendMail;