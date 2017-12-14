const HtmlWebpackPlugin = require('html-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const path = require('path');
const html = new HtmlWebpackPlugin({ template: './src/index.ejs' })
const offline = new OfflinePlugin

module.exports = {
  entry: './src/main',
  devServer: {
    port: 8080,
    inline: true,
    progress: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.tsx$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    html,
    offline
  ],
}