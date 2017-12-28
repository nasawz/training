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
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.html', '.scss', '.less', '.css']
    },
    node: {
      fs: 'empty'
    },
    entry: _.compact([
      isDev && 'react-hot-loader/patch',
      isDev && `webpack-hot-middleware/client?http://127.0.0.1:${config.port}`,
      isDev && 'webpack/hot/only-dev-server',
      './src/index',
      './src/style/index',
    ]),
    output: {
      publicPath: '',
      filename: isDist ? `bundle/${pkgJson.version}/[name].[hash].js` : `bundle/${pkgJson.version}/[name].js`,
      chunkFilename: isDist ? `bundle/${pkgJson.version}/module.[name].[hash].js` : `bundle/${pkgJson.version}/module.[name].js`,
      path: path.join(config.webpack.path.pub)
    },
    externals: {
      // 'react': 'React',
      // 'react-dom': 'ReactDOM',
      // 'lodash': '_',
      // 'jquery': 'jQuery',
      // 'backbone': 'Backbone',
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
      new CopyWebpackPlugin([
        {
          from: config.webpack.path.src + '/lib/',
          to: 'lib/'
        },
        {
          from: config.webpack.path.src + '/favicon.png',
          to: './'
        }
      ]),
      new HtmlWebpackPlugin({
        title: 'bpm-draw',
        template: './src/templates/index.ejs',
        filename: 'index.html'
      }),
      new HtmlWebpackIncludeAssetsPlugin({
        assets: [
          // 'lib/rappid.min.css',
          // 'lib/lodash.min.js',
          // 'lib/react.min.js',
          // 'lib/react-dom.min.js',
        ],
        append: false
      }),
    ]),
    module: {
      rules: _.compact([
        {
          test: /\.(tsx?|jsx?)$/,
          loader: 'ts-loader',
          exclude: /node_modules/
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