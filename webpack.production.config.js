var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './app/main.js',
  output: {
    path: __dirname + '/build',
    filename: '[name]-[hash].js'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel'],
      },
      {
        test: /\.(css|styl)$/,
        loader: ExtractTextPlugin.extract('style', 'css!stylus')
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.tmpl.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name]-[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
