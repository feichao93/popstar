const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',

  entry: "./app/main.js",
  output: {
    path: __dirname + "/build",
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel']
      }
    ],
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /node_modules/,
      }
    ]
  },

  resolve: {
    root: [
      path.resolve('.'),
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.tmpl.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    port: 12345,
    contentBase: "build",
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true
  }
}
