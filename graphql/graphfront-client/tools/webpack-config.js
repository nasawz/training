'use strict';

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const pkgJson = require('../package.json');
const config = require('./config');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin-hash');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OfflinePlugin = require('offline-plugin');

const tsImportPluginFactory = require('ts-import-plugin')


module.exports = (type) => {
    const isDev = type === 'dev';
    const isDist = type === 'dist';

    const extractApp = new ExtractTextPlugin({
        filename: isDist ? `bundle/${pkgJson.version}/${pkgJson.name}.[contenthash:8].css` : `bundle/${pkgJson.version}/${pkgJson.name}.css`,
        allChunks: true
    });

    const postcssFun = (loader) => {
        let arr = [
            require('postcss-import')({ root: loader.resourcePath })
        ]
        if (isDist) {
            arr.push(require('cssnano')())
        }
        return arr
    }
    return {
        devtool: {
            dev: 'inline-source-map',
            dll: false,
            test: false,
            dist: false,
        }[type],
        resolve: {
            alias: {
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.html', '.scss', '.less', '.css']
        },
        entry: _.compact([
            isDev && 'react-hot-loader/patch',
            isDev && `webpack-hot-middleware/client?http://127.0.0.1:${config.port}`,
            isDev && 'webpack/hot/only-dev-server',
            './src/index',
        ]),
        output: {
            publicPath: '',
            filename: isDist ? `bundle/${pkgJson.version}/[name].[hash].js` : `bundle/${pkgJson.version}/[name].js`,
            chunkFilename: isDist ? `bundle/${pkgJson.version}/module.[name].[hash].js` : `bundle/${pkgJson.version}/module.[name].js`,
            path: path.join(config.webpack.path.pub)
        },
        externals: {
        },
        plugins: _.compact([
            isDev && new webpack.HotModuleReplacementPlugin(),
            isDist && new webpack.optimize.UglifyJsPlugin(),
            isDist && new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(type === 'dist' ? 'production' : type),
                }
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            extractApp,
            new webpack.optimize.CommonsChunkPlugin({
                name: `common`,
                minChunks: function (module) {
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            new HtmlWebpackPlugin(),
            new HtmlWebpackIncludeAssetsPlugin({
                assets: [
                ],
                append: false
            }),
            new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|zh-cn)$/),
        ]),
        module: {
            rules: _.compact([
                {
                    test: /\.(tsx?|jsx?)$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: extractApp.extract(
                        {

                            use: ['css-loader?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        plugins: postcssFun
                                    }
                                }, `sass-loader`],
                            publicPath: '../../'
                        }
                    )
                },
                {
                    test: /\.less$/,
                    use: extractApp.extract({
                        use: ['css-loader?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: postcssFun
                                }
                            }, `less-loader`],
                        publicPath: '../../'
                    })
                },
                {
                    test: /\.css$/,
                    use: extractApp.extract({
                        use: ['css-loader?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]', {
                            loader: 'postcss-loader',
                            options: {
                                plugins: postcssFun
                            }
                        }], publicPath: '../../'
                    })
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loaders: [
                        'url-loader?limit=1&name=img/[name].[ext]',
                    ],
                    include: path.resolve(config.webpack.path.src)
                },
                {
                    test: /\.(eot|ttf|woff)$/i,
                    loaders: [
                        'url-loader?name=font/[name].[ext]',
                    ]
                }
            ])
        }
    }
}