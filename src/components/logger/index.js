const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const { NODE_ENV, root } = require('../../config/environment');

const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      filename: `${root}/logs/error.%DATE%.log`,
      maxFiles: '14d',
    }),
    new winston.transports.Console({
      name: 'console',
      level: 'debug',
      silent: NODE_ENV === 'production',
    }),
  ],
});

module.exports = logger;
