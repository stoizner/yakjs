import path from 'path';

export default {
    context: path.resolve(__dirname, './frontend/src/'),
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './frontend/static/'),
        filename: 'yakjs-frontend.js'
    },
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['./loaders/litCssLoader.js'],
            },
        ],
    },
}
