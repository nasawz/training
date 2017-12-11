'use strict';

const config = require('./config');

const path = require('path');
const http = require('http');

const express = require('express');
const webpack = require('webpack');

const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const getConfig = require('./webpack-config');


const proxy = require('http-proxy-middleware');
var options = {
  target: 'http://127.0.0.1:3000/',
  secure: false,
  changeOrigin: true,
  ws: true,
  ignorePath: false,
  pathRewrite: {
    '^/api': ''
  }
};
var webProxy = proxy(options);

function startDevServer() {
  const app = express();
  const devConfig = getConfig('dev');

  const compiler = webpack(devConfig);
  app.use(devMiddleware(compiler, {
    publicPath: devConfig.output.publicPath,
    historyApiFallback: true,
  }));

  app.use(hotMiddleware(compiler));
  app.use('/api/*', webProxy);

  app.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`Dev server listening at http://localhost:${config.port}/`);
  });
}

startDevServer()