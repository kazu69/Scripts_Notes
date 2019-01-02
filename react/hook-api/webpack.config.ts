import path from "path";
import webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";

const index = path.resolve(__dirname, "src/index.tsx");
const dist = path.resolve(__dirname, "public/");

const rules: webpack.Rule[] = [
  {
    test: /\.tsx?$/,
    use: "ts-loader"
  },
  {
    test: /\.(js|jsx)$/,
    use: "babel-loader"
  }
];

const module: webpack.Module = {
  rules
};

const devServer: WebpackDevServer.Configuration = {
  contentBase: dist,
  compress: true,
  port: 9000,
  clientLogLevel: 'info',
}

const config: webpack.Configuration = {
  mode: "development",
  devtool: "source-map",
  entry: index,
  module,
  output: {
      filename: "bundle.js",
      path: dist,
  },
  resolve: {
      extensions: [".ts", ".tsx", ".js"],
  },
  devServer
}

export default config
