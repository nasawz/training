"use strict";

const path = require('path');
const __basename = path.dirname(__dirname);

var config = {
    port: '9001',
    deploy: {
        host: '118.244.237.2',
        port: 22000,
        auth: 'hpe',
        remotePath: '/opt/baleina/baleina/code/cod'
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