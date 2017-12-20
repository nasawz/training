const webpackConfig = require('./tools/webpack-config')('dev');
const path = require('path');

const commonsChunkPluginIndex = webpackConfig.plugins.findIndex(plugin => plugin.chunkNames);
webpackConfig.plugins.splice(commonsChunkPluginIndex, 1);

webpackConfig.externals = {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
}

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            './test/test_index.js'
        ],
        exclude: [
        ],
        preprocessors: {
            './test/test_index.js': ['webpack', 'sourcemap', 'coverage'],
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,
            // quiet: true,
            // stats: {
            //     colors: true
            // }
        },
        proxies: {
            '/api': 'http://127.0.0.1:3000/'
        },
        // reporters: ['progress', 'coverage'],

        // coverageReporter: {
        //     reporters: [
        //         {
        //             type: 'html',
        //             dir: 'coverage/'
        //         },
        //         {
        //             // 这就是Codecov支持的文件类型
        //             type: 'cobertura',
        //             subdir: '.',
        //             dir: 'coverage/'
        //         }
        //     ]
        // },
        reporters: ['progress', 'coverage-istanbul'],
        // any of these options are valid: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-api/lib/config.js#L33-L39
        coverageIstanbulReporter: {

            // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
            reports: ['text-summary', 'html', 'cobertura'],

            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
            dir: path.join(__dirname, 'coverage'),

            // if using webpack and pre-loaders, work around webpack breaking the source path
            fixWebpackSourcePaths: true,

            // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped`
            skipFilesWithNoCoverage: true,

            // Most reporters accept additional config options. You can pass these through the `report-config` option
            'report-config': {

                // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/html
                    subdir: 'html'
                }

            },

            // // enforce percentage thresholds
            // // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
            // thresholds: {
            //     emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
            //     global: { // thresholds for all files
            //         statements: 100,
            //         lines: 100,
            //         branches: 100,
            //         functions: 100
            //     },
            //     each: { // thresholds per file
            //         statements: 100,
            //         lines: 100,
            //         branches: 100,
            //         functions: 100,
            //         overrides: {
            //             'baz/component/**/*.js': {
            //                 statements: 98
            //             }
            //         }
            //     }
            // }

        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}