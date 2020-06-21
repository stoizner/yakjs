const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve('../../frontend/'),
        filename: 'yakjs-frontend.js'
    },
    mode: 'production',
    devtool: 'source-map'
}
