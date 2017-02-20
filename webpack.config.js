/**
 * Created by ebi on 2017/2/15.
 */
var path = require('path');

module.exports = {
    entry: {
        'index': path.resolve('src', 'install.js')
    },
    output: {
        path: '',
        filename: '[name].js'
    },
    node: {
        global: true
    },
    module: {
        loaders: [
            {
                test:/\.js(\?[^?]+)?$/,
                loader: 'babel',
            }
        ]
    }
};