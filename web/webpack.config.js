// web/webpack.config.js

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appDirectory = path.resolve(__dirname, "../");

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, "index.web.js"),
    path.resolve(appDirectory, "src"),
    path.resolve(appDirectory, "node_modules/react-native-uncompiled"),
    path.resolve(appDirectory, "node_modules/react-native-vector-icons"),
    path.resolve(appDirectory, "node_modules/react-navigation-tabs"),
    path.resolve(
      appDirectory,
      "node_modules/@react-native-community/async-storage"
    ),
    path.resolve(appDirectory, "node_modules/@react-navigation"),
    path.resolve(appDirectory, "node_modules/react-native-markdown-package"),
    path.resolve(appDirectory, "node_modules/react-native-lightbox"),
    path.resolve(appDirectory, "node_modules/react-native-gesture-handler"),
    path.resolve(appDirectory, "node_modules/react-navigation-drawer"),
    path.resolve(appDirectory, "node_modules/react-native-camera"),
    path.resolve(appDirectory, "node_modules/react-native-qrcode-svg")
  ],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      // The 'react-native' preset is recommended to match React Native's packager
      presets: ["module:metro-react-native-babel-preset"],
      // Re-write paths to import only the modules needed by the app
      plugins: ["react-native-web"]
    }
  }
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]"
    }
  }
};

module.exports = {
  node: {
    fs: "empty"
  },

  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, "index.web.js")
  ],

  // configures where the build ends up
  output: {
    filename: "bundle.web.js",
    path: path.resolve(appDirectory, "dist")
  },

  // ...the rest of your config

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "./index.html")
    })
  ],

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration]
  },

  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      "react-native$": "react-native-web"
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [".web.js", ".js"]
  }
};
