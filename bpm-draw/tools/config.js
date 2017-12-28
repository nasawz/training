"use strict";

const path = require('path');
const __basename = path.dirname(__dirname);

var config = {
  port: '9003',
  deploy: {
    host: '',
    port: 22,
    auth: '',
    remotePath: ''
  },
  webpack: {
    path: {
      base: __basename,
      src: path.resolve(__basename, 'src'),
      dev: path.resolve(__basename, 'dev'),
      pub: path.resolve(__basename, 'dist'),
    },
  }
}
module.exports = config