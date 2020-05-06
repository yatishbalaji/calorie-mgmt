const path = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');

const env = !process.env.DB_URL ? dotenv.config({}).parsed: {};

const all = {
  env: process.env.NODE_ENV,
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  ip: process.env.IP || '0.0.0.0',
  DB_URL: process.env.DB_URL,
  DOMAIN: process.env.DOMAIN,
  JWT_KEY: process.env.JWT_KEY,
  SALT: process.env.SALT,
};

module.exports = _.merge(
  all,
  env,
);
