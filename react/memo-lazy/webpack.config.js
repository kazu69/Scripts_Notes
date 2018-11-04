const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    memo: "./src/MemoComponent",
    lazy: "./src/LazyComponent",
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000
},
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }
    ]
  }
};
