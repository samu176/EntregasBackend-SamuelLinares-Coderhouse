const winston = require('winston');
const { NODE_ENV } = process.env;

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const devConfig = {
  levels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      level: 'debug',
    }),
  ],
};

const prodConfig = {
  levels,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
    }),
  ],
};

const logger = winston.createLogger(NODE_ENV === 'prod' ? prodConfig : devConfig);

module.exports = logger;