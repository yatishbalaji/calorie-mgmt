const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const config = require('./config/environment');
const logger = require('./components/logger');

const app = express();
const server = http.createServer(app);

require('./config/express')(app);
require('./routes')(app);

function startServer() {
  server.listen(config.port, config.ip, () => {
    logger.debug(`New Server listening on ${config.port}, in ${app.get('env')} mode`);
  });
}

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', err);
});

mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, function(err) {
  if (err) return logger.error(err);

  startServer();
});

// Expose app
module.exports = app;
