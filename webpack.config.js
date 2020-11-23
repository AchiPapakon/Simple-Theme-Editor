var path = require('path');

module.exports = {
    entry: {
        App: path.resolve(__dirname, 'app', 'jsx', 'App.jsx')
    },
    output: {
        path: path.resolve(__dirname, 'public', 'webpack'),
        filename: '[name].js',
        publicPath: '/webpack'
    },
    module: {
        rules: [{
            test: /\.sass$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'sass-loader'
                }
            ]
        },
        {
            test: /\.jsx*$/,
            include: [
                path.resolve(__dirname, 'app', 'jsx'),
                path.resolve(__dirname, 'app', 'test')
            ],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        }]
    }
};
