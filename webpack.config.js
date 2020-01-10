const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = env => {
  if (!env) {
    env = {};
  }

  //定义通用插件
  let plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html"
    })
  ];

  //当生产环境时，加入插件
  if (env.production) {
    plugins.push(
      new webpack.DefinePlugin({
        NODE_ENV: "production"
      }),
      new MiniCssExtractPlugin({
        filename: "style.[hash:8].css"
      })
    );
  }

  return {
    mode: env.production ? "production" : "development",
    devtool: "source-map",
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      host: "127.0.0.1",
      port: 9090
    },
    entry: {
      components: "./src/js/global.js",
      app: "./src/js/index.js"
    },
    output: {
      filename: "[name].main.[chunkhash].js",
      path: path.resolve(__dirname, "dist")
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        }
      ]
    }
  };
};
