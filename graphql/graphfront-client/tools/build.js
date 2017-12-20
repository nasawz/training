'use strict';

const config = require('./config');

const path = require('path');
const webpack = require('webpack');
const shell = require('shelljs');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const webpackConfig = require('./webpack-config')('dist');
const ArgumentParser = require('argparse').ArgumentParser;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const parser = new ArgumentParser({
    addHelp: true,
    description: 'Whether to show bundle content as convenient interactive zoomable treemap',
});

parser.addArgument(['--profile', '-p'], {
    help: 'Whether to show profile of the bundle.',
    defaultValue: false
});

const args = parser.parseArgs();
// Show profile of the build bundle
// https://github.com/th0r/webpack-bundle-analyzer
if (args.profile) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
        // Can be `server`, `static` or `disabled`.
        // In `server` mode analyzer will start HTTP server to show bundle report.
        // In `static` mode single HTML file with bundle report will be generated.
        // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        analyzerMode: 'static',
        // Path to bundle report file that will be generated in `static` mode.
        // Relative to bundles output directory.
        reportFilename: 'report.html',
        // Automatically open report in default browser
        openAnalyzer: false,
        // If `true`, Webpack Stats JSON file will be generated in bundles output directory
        generateStatsFile: false,
        // Options for `stats.toJson()` method.
        // For example you can exclude sources of your modules from stats file with `source: false` option.
        // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null
    }));
}
// Clean folder
const buildFolder = config.webpack.path.pub;
shell.rm('-rf', buildFolder);


// Webpack build
console.log('Building, it may take a few seconds...');
console.time('✨ Done');
const compiler = webpack(webpackConfig);

let lastPercentage = 0;
compiler.apply(new ProgressPlugin((percentage, msg) => {
    percentage = Math.round(percentage * 10000) / 100;
    if (/building modules/.test(msg) && percentage - lastPercentage < 8) {
        return;
    }
    lastPercentage = percentage;
    console.log(percentage + '%', msg);
}));

compiler.run((err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.timeEnd('✨ Done');
    }
});
