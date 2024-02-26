const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true
    },

    resolve: {
        extensions: [".ts", ".tsx", ".css", ".js", ".jsx"],
        alias: {
            "@activity-bar": path.resolve(__dirname, './src/activity-bar'),
            "@shared": path.resolve(__dirname, './src/shared')
        },
        modules: ['node_modules']
    },

    module: {
        rules: [
            {
                test: /\.((c|sc)ss)$/i,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader'
            }
        ] 
    },

    mode: 'development',

    plugins: [new HtmlWebpackPlugin({
        template: "./public/index.html"
    })],

    devServer: {
        port: 3000,
        static: 'dist/index.html'
    },

    watch: true
}
