// webpack v4
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const merge = require("webpack-merge");

console.log("NODE_ENV: ", process.env.NODE_ENV); // 'local'
console.log("Production: ", process.env.production); // true
module.exports = env => {
  const { PLATFORM, VERSION } = process.env;
  return merge([
    {
      name: "base",
      mode: "development",
      entry: ["@babel/polyfill", "./src/client/index.js"],
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash].js"
      },
      resolve: {
        extensions: [".js", ".jsx"]
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            include: [
              path.resolve(__dirname, "src"),
              path.resolve(__dirname, "node_modules/@salesforce")
            ],
            use: { loader: "babel-loader" }
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['eslint-loader']
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader"
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              PLATFORM === "production"
                ? MiniCssExtractPlugin.loader
                : "style-loader"
              ,
              "css-loader",
              "sass-loader"
            ]
          },
          // Sass
          {
            test: /\.scss$/,
            use: [
              // Minify on production env
              PLATFORM === "production"
                ? MiniCssExtractPlugin.loader
                : "style-loader",
              "css-loader",
              "sass-loader"
            ]
          },
          {
            test: /\.svg$/,
            loader: "url-loader?limit=10000",
            include: [
              path.join(
                __dirname,
                "node_modules/@salesforce-ux/design-system/assets/icons"
              )
            ]
          },
          {
            test: /\.(gif|jpe?g|png)$/,
            loader: "url-loader?limit=10000"
          },
          {
            test: /\.(eot|woff|woff2|ttf)$/,
            loader:
              "url-loader?limit=30&name=/assets/fonts/webfonts/[name].[ext]"
          }
        ]
      },
      devtool: "inline-source-map",
      devServer: {
        hot: true,
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3001,
        proxy: {
          '/api': 'http://localhost:3000'
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.VERSION": JSON.stringify(process.env.VERSION),
          "process.env.PLATFORM": JSON.stringify(process.env.PLATFORM)
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          template: "./src/client/index.html",
          filename: "index.html"
        }),
        new webpack.HotModuleReplacementPlugin()
      ]
    }
  ]);
};
