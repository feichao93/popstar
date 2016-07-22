var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: "./app/main.js",
  output: {
    path: __dirname + "/build",
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.(css|styl)$/,
        loader: "style!css!stylus"
      },
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
