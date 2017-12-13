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
const tsImportPluginFactory = require('ts-import-plugin')
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const OfflinePlugin = require('offline-plugin');

module.exports = (type) => {
  const isDev = type === 'dev';
  const isDist = type === 'dist';

  const extractApp = new ExtractTextPlugin({
    filename: isDist ? `bundle/${pkgJson.version}/pwa.[contenthash:8].css` : `bundle/${pkgJson.version}/pwa.css`,
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
      './src/index'
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
        // {
        //   from: config.webpack.path.src + '/lib/',
        //   to: 'lib/'
        // },
        {
          from: config.webpack.path.src + '/assets/',
          to: 'assets/'
        },
        {
          from: config.webpack.path.src + '/favicon.png',
          to: './'
        },
      ]),
      new WebpackManifestPlugin({
        fileName: 'manifest.json',
        seed: {
          name: pkgJson.name,
          short_name: pkgJson.name,
          start_url: 'index.html',
          display: 'standalone',
          theme_color: '#40a9ff',
          background_color: '#f0f2f5',
          orientation: 'landscape',
          icons: [{
            src: 'favicon.png',
            sizes: '144x144',
            type: 'image/png'
          }]
        }
      }),
      new HtmlWebpackPlugin({
        title: 'pwa',
        template: './src/templates/index.ejs',
        filename: 'index.html'
      }),
      new HtmlWebpackIncludeAssetsPlugin({
        assets: [
          // 'lib/react.production.min.js',
          // 'lib/react-dom.production.min.js',
        ],
        append: false
      }),
      new OfflinePlugin({
        excludes: ['**/*.map'],
        updateStrategy: 'changed',
        autoUpdate: 1000 * 60 * 2,
        ServiceWorker: {
          navigateFallbackURL: '/',
          events: true,
        }
      })
    ]),
    module: {
      rules: _.compact([
        {
          test: /\.(tsx?|jsx?)$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [tsImportPluginFactory({})]
            }),
            compilerOptions: {
              module: 'es2015'
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.less$/,
          use: extractApp.extract({
            use: ['css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postcssFun
                }
              }, 'less-loader'],
            publicPath: '../../'
          })
        },
        {
          test: /\.css$/,
          use: extractApp.extract({
            use: ['css-loader', {
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