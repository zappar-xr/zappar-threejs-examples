const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zappar.js',
    library: 'Zappar',
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".wasm"]
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    open: true
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /zcv\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader"
      }
    ],

  }
};
