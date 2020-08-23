const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
  }),
  new MiniCssExtractPlugin({
    filename: "style.css",
  }),
  new CopyPlugin({
    patterns: [
      {
        from: "./src/fonts",
        to: "./fonts",
      },
      {
        from: "./src/images",
        to: "./images",
      },
    ],
  }),
];
module.exports = (arg) => {
  if (arg.mode === "production") {
    plugins.push(new CleanWebpackPlugin());
  }

  return {
    entry: ["./src/js/index.js", "./src/scss/style.scss"],
    devtool: "source-map",

    output: {
      filename: "scripts/bundle.js",
      path: path.resolve(__dirname, "dist"),
    },

    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },

        {
          test: /\.(s[ac]ss)$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "./dist/style",
              },
            },
            {
              loader: "css-loader",
              options: {
                url: false,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: [
                  require("cssnano")({
                    preset: "default",
                  }),
                  require("autoprefixer"),
                ],
              },
            },
            {
              loader: "sass-loader",
            },
          ],
        },
      ],
    },

    plugins,

    devServer: {
      port: 3000,
      open: true,
    },
  };
};
