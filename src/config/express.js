const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

module.exports = function (app) {
  const env = app.get('env');
  
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors())

  if (env === 'development' || env === 'test') {
    app.use(morgan('dev'));
  }
};
