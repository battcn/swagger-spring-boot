'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SWAGGER_URL: '"http://120.78.231.21:9999"'
});
