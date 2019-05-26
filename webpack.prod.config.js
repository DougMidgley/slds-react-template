/* eslint-disable */
const merge = require("webpack-merge");
// Configs
const baseConfig = require("./webpack.base.config");
// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const prodConfiguration = env => {
  return merge([
    {
        mode:"production",
      // Un-comment this part if you want to use splitChunks. That's all.
      optimization: {
         runtimeChunk: 'single',
         splitChunks: {
           cacheGroups: {
             vendor: {
               test: /[\\/]node_modules[\\/]/,
               name: 'vendors',
               chunks: 'all'
             }
           }
         },
        minimizer: [new UglifyJsPlugin()]
      },
      plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
          })
        new OptimizeCssAssetsPlugin(),
        // Change output file name if you want.
        new Visualizer({ filename: "./statistics.html" }),
        new BundleAnalyzerPlugin()
      ]
    }
  ]);
};

module.exports = env => {
  return merge(baseConfig(env), prodConfiguration(env));
};
