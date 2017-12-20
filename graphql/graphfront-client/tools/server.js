'use strict';

const config = require('./config');

const path = require('path');
const http = require('http');

const express = require('express');
const fallback = require('express-history-api-fallback');
const webpack = require('webpack');

const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const getConfig = require('./webpack-config');


const proxy = require('http-proxy-middleware');
var options = {
    target: 'http://127.0.0.1:3000/', // target host
    secure: false,
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    ignorePath: false,
    pathRewrite: {
        '^/api': ''
    }
};

var webProxy = proxy(options);


// Start an express server for development using webpack dev-middleware and hot-middleware
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

    // // First, find files from src folder
    // app.use(express.static(path.join(__dirname, '../src')));

    // // Also support files from root folder, mainly for the dev-vendor bundle
    // app.use(express.static(path.join(__dirname, '../')));

    // History api fallback
    // app.use(fallback('index.html', { root: path.join(__dirname, '../src') }));

    // // Other files should not happen, respond 404
    // app.get('*', (req, res) => {
    //     console.log('Warning: unknown req: ', req.path);
    //     res.sendStatus(404);
    // });

    app.listen(config.port, (err) => {
        if (err) {
            console.error(err);
        }
        console.log(`Dev server listening at http://localhost:${config.port}/`);
    });
}

startDevServer()