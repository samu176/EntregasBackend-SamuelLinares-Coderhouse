require('dotenv').config();

module.exports = {
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
  sendMessageEmail: process.env.SEND_MESSAGE_EMAIL,
  sendMessageEmailPassword: process.env.SEND_MESSAGE_EMAIL_PASSWORD
};