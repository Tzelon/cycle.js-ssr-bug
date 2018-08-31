const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const browserConfig = {
    entry: './client.js',
    devtool: "source-map",
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: require.resolve('babel-loader'),
                options: {
                    cacheDirectory: true,
                    presets: ["@babel/preset-env"]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __isBrowser__: "true"
        })
    ]
};

const serverConfig = {
    entry: './server.js',
    target: 'node',
    devtool: "source-map",
    mode: 'development',
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'public', 'server'),
        filename: 'server.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // cacheDirectory: true,
                    presets: [["@babel/preset-env", {
                        targets: {
                            node: true
                        }
                    }]]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __isBrowser__: "false"
        })
    ]
};

module.exports = [browserConfig, serverConfig];