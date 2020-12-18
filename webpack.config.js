const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config');

baseConfig.entry = {
    launchUrl: "./src/image-tracking-launch-url/index.ts",
    playAnimationFromButtonTap: "./src/image-tracking-glb-animation/index.ts",
    playAnimationFromGaze: "./src/image-tracking-play-animation-from-gaze/index.ts",
    faceTrackingFaceMesh: "./src/face-tracking-face-mesh/index.ts",
    faceTracking3DModel: "./src/face-tracking-3d-model-photo-feature/index.ts",
    instantTracking3DModel: "./src/instant-tracking-gltf-loader/index.ts"
}

baseConfig.output = {
    filename: "[name].js",
    path: __dirname + 'dist'
}

baseConfig.plugins = [
    new HtmlWebpackPlugin({
        filename: 'image-tracking-launch-url.html',
        template: './src/base.html',
        chunks: ['launchUrl']
    }),
    new HtmlWebpackPlugin({
        filename: 'image-tracking-glb-animation.html',
        template: './src/play-animation-from-button-tap.html',
        chunks: ['playAnimationFromButtonTap']
    }),
    new HtmlWebpackPlugin({
        filename: 'image-tracking-play-animation-from-gaze.html',
        template: './src/base.html',
        chunks: ['playAnimationFromGaze']
    }),
    new HtmlWebpackPlugin({
        filename: 'face-tracking-face-mesh.html',
        template: './src/base.html',
        chunks: ['faceTrackingFaceMesh']
    }),
    new HtmlWebpackPlugin({
        filename: 'face-tracking-3d-model-photo-feature.html',
        template: './src/face-tracking-photo-feature.html',
        chunks: ['faceTracking3DModel']
    }),
    new HtmlWebpackPlugin({
        filename: 'instant-tracking-gltf-loader.html',
        template: './src/instant-tracking.html',
        chunks: ['instantTracking3DModel']
    })
];

baseConfig.devServer = {
    contentBase: './dist',
    https: true,
    host: "0.0.0.0",
    hot: true,
    open: true
};

baseConfig.output.path = path.resolve(__dirname, 'dist');
module.exports = baseConfig;
