const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config');

baseConfig.entry = {
    launchUrl: "./src/launch-url/index.ts",
    playAnimationFromButtonTap: "./src/play-animation-from-button-tap/index.ts",
    playAnimationFromGaze: "./src/play-animation-from-gaze/index.ts",
    faceTrackingFaceMesh: "./src/face-tracking-face-mesh/index.ts",
    faceTracking3DModel: "./src/face-tracking-3d-model/index.ts",
    instantTracking3Dmodel: "./src/instant-tracking-3d-model/index.ts"
}

baseConfig.output = {
    filename: "[name].js",
    path: __dirname + 'dist'
}

baseConfig.plugins = [
    new HtmlWebpackPlugin({
        filename: 'launch-url.html',
        template: './src/base.html',
        chunks: ['launchUrl']
    }),
    new HtmlWebpackPlugin({
        filename: 'play-animation-from-button-tap.html',
        template: './src/play-animation-from-button-tap.html',
        chunks: ['playAnimationFromButtonTap']
    }),
    new HtmlWebpackPlugin({
        filename: 'play-animation-from-gaze.html',
        template: './src/base.html',
        chunks: ['playAnimationFromGaze']
    }),
    new HtmlWebpackPlugin({
        filename: 'face-tracking-face-mesh.html',
        template: './src/base.html',
        chunks: ['faceTrackingFaceMesh']
    }),
    new HtmlWebpackPlugin({
        filename: 'face-tracking-3d-model.html',
        template: './src/base.html',
        chunks: ['faceTracking3DModel']
    }),
    new HtmlWebpackPlugin({
        filename: 'instant-tracking-3d-model.html',
        template: './src/base.html',
        chunks: ['instantTracking3Dmodel']
    })
];

baseConfig.devServer = {
    contentBase: './dist',
    https: true,
    host: "0.0.0.0"
};

baseConfig.output.path = path.resolve(__dirname, 'dist');
module.exports = baseConfig;